'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type Chapter = { index: number; total: number; label: string } | null

const Ctx = createContext<{
  chapter: Chapter
  setChapter: (c: Chapter) => void
}>({ chapter: null, setChapter: () => {} })

/**
 * Lets the film tell the nav which chapter is on screen.
 *
 * The nav is mounted in the root layout, above the page — so the chapter
 * readout can't be passed down as a prop. A context is the smallest thing that
 * connects them without hoisting the whole film into the layout.
 */
export function ChapterProvider({ children }: { children: React.ReactNode }) {
  const [chapter, setChapter] = useState<Chapter>(null)
  const value = useMemo(() => ({ chapter, setChapter }), [chapter])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useChapter = () => useContext(Ctx)
