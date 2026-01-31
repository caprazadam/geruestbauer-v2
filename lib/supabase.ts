import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Environment variables not configured. Database features disabled.')
    return null
  }
  
  if (!isValidUrl(supabaseUrl)) {
    console.warn('[Supabase] Invalid URL format. Expected https://your-project.supabase.co format.')
    return null
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('[Supabase] Failed to create client:', error)
    return null
  }
}

export const supabase = createSupabaseClient()

export interface CompanyDB {
  id: string
  name: string
  slug: string
  city: string | null
  city_slug: string | null
  category: string | null
  category_slug: string | null
  location: string | null
  employees: number
  rating: number
  review_count: number
  image_url: string | null
  services: string[]
  certifications: string[]
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  founded: number | null
  specialties: string[]
  google_place_id: string | null
  created_at: string
}
