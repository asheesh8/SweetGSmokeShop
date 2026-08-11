import type { MetadataRoute } from 'next'
import { CATEGORIES, PRODUCTS } from '@/lib/products'

const SITE = 'https://www.sweetgsmokeshop.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/visit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE}/shop/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE}/shop/${p.category}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
