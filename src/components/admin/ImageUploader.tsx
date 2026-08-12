'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { IMAGE_BUCKET, storageUrl } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'

/**
 * Product photo upload.
 *
 * Goes straight from the browser to Supabase Storage rather than through a
 * server action — a phone photo is several megabytes, and routing that through
 * a serverless function means hitting body-size limits for no benefit. The
 * bucket's RLS policy checks staff membership, so a direct upload is no less
 * protected than a proxied one.
 *
 * The resulting path is written into a hidden input, so it saves with the rest
 * of the form in one submit.
 */
export function ImageUploader({ name, initialPath }: { name: string; initialPath: string | null }) {
  const [path, setPath] = useState<string | null>(initialPath)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('That’s not an image file.')
      return
    }
    // Generous, but a stray 40MB RAW file should fail fast with a clear reason.
    if (file.size > 12 * 1024 * 1024) {
      toast.error('That photo is over 12MB — take a smaller one or resize it first.')
      return
    }

    const supabase = createClient()
    if (!supabase) {
      toast.error('Supabase isn’t configured.')
      return
    }

    setBusy(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const key = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(key, file, {
      cacheControl: '31536000',
      upsert: false,
    })

    setBusy(false)

    if (error) {
      toast.error(`Upload failed: ${error.message}`)
      return
    }
    setPath(key)
    toast.success('Photo uploaded')
  }

  const preview = storageUrl(path)

  return (
    <div>
      <input type="hidden" name={name} value={path ?? ''} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0]
          if (file) void upload(file)
        }}
        className="flex items-center gap-4 border border-dashed border-border p-4"
      >
        <div className="h-24 w-24 shrink-0 overflow-hidden border border-border bg-background">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote storage host
            <img src={preview} alt="Product photo" className="h-full w-full object-cover" />
          ) : (
            <div className="plate h-full w-full" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Drop a photo here, or take one on your phone and pick it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? 'Uploading…' : preview ? 'Replace photo' : 'Choose photo'}
            </Button>
            {preview && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setPath(null)}>
                Remove
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      {!preview && (
        <p className="mt-2 text-xs text-muted-foreground">
          No photo is fine — the site shows a styled placeholder until you add one.
        </p>
      )}
    </div>
  )
}
