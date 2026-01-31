import { MetadataRoute } from 'next'
import { siteConfig } from './metadata'
import { supabase } from '@/lib/supabase'
import { blogPosts } from '@/lib/blog-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/agb`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const cities = [
    'berlin', 'hamburg', 'muenchen', 'koeln', 'frankfurt',
    'stuttgart', 'duesseldorf', 'dortmund', 'essen', 'leipzig',
    'bremen', 'dresden', 'hannover', 'nuernberg', 'duisburg'
  ]
  
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  let companyPages: MetadataRoute.Sitemap = []
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('slug, city_slug, category_slug, created_at')
    
    if (!error && companies) {
      companyPages = companies.map((company) => ({
        url: `${baseUrl}/${company.city_slug}/${company.category_slug}/${company.slug}`,
        lastModified: company.created_at ? new Date(company.created_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (e) {
    console.error('[Sitemap] Error fetching companies:', e)
  }

  const publishedPosts = blogPosts.filter(post => post.isPublished)
  const blogPages: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...cityPages, ...companyPages, ...blogPages]
}
