import type { MetadataRoute } from 'next'
import { getInventory } from '@/lib/inventory'

const SITE = 'https://www.sweetgsmokeshop.com'

/**
 * Built from live inventory, so a product added in /admin is submitted to
 * search engines without a redeploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const { items, categories } = await getInventory()

  return [
    { url: SITE, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/visit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...categories.map((c) => ({
      url: `${SITE}/shop/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...items.map((p) => ({
      url: `${SITE}/shop/${p.categorySlug}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
