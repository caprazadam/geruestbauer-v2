import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
