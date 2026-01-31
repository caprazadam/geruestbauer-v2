import { supabase, CompanyDB } from "./supabase"
import type { Company } from "./company-data"

function companyToDb(company: Company): Omit<CompanyDB, 'created_at'> {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    city: company.city || null,
    city_slug: company.citySlug || null,
    category: company.category || null,
    category_slug: company.categorySlug || null,
    location: company.location || null,
    employees: company.employees || 0,
    rating: company.rating || 0,
    review_count: company.reviewCount || 0,
    image_url: company.imageUrl || null,
    services: company.services || [],
    certifications: company.certifications || [],
    description: company.description || null,
    phone: company.phone || null,
    email: company.email || null,
    website: company.website || null,
    address: company.address || null,
    founded: company.founded || null,
    specialties: company.specialties || [],
    google_place_id: (company as any).googlePlaceId || null,
  }
}

function dbToCompany(db: CompanyDB): Company {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    city: db.city || "",
    citySlug: db.city_slug || "",
    category: db.category || "",
    categorySlug: db.category_slug || "",
    location: db.location || "",
    employees: db.employees || 0,
    rating: db.rating || 0,
    reviewCount: db.review_count || 0,
    imageUrl: db.image_url || "",
    services: db.services || [],
    certifications: db.certifications || [],
    description: db.description || "",
    phone: db.phone || "",
    email: db.email || "",
    website: db.website || "",
    address: db.address || "",
    founded: db.founded || 0,
    specialties: db.specialties || [],
  }
}

export async function saveCompanyToSupabase(company: Company): Promise<boolean> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return false
  }
  
  try {
    const dbCompany = companyToDb(company)
    const { error } = await supabase
      .from('companies')
      .upsert(dbCompany, { onConflict: 'id' })
    
    if (error) {
      console.error('[Supabase] Error saving company:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[Supabase] Error saving company:', e)
    return false
  }
}

export async function saveMultipleCompaniesToSupabase(companies: Company[]): Promise<boolean> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return false
  }
  
  try {
    const dbCompanies = companies.map(companyToDb)
    const { error } = await supabase
      .from('companies')
      .upsert(dbCompanies, { onConflict: 'id' })
    
    if (error) {
      console.error('[Supabase] Error saving companies:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[Supabase] Error saving companies:', e)
    return false
  }
}

export async function loadCompaniesFromSupabase(): Promise<Company[]> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[Supabase] Error loading companies:', error)
      return []
    }
    
    return (data || []).map(dbToCompany)
  } catch (e) {
    console.error('[Supabase] Error loading companies:', e)
    return []
  }
}

export async function getCompanyBySlugFromSupabase(
  citySlug: string, 
  categorySlug: string, 
  companySlug: string
): Promise<Company | null> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('city_slug', citySlug)
      .eq('category_slug', categorySlug)
      .eq('slug', companySlug)
      .single()
    
    if (error || !data) {
      return null
    }
    
    return dbToCompany(data)
  } catch (e) {
    console.error('[Supabase] Error getting company:', e)
    return null
  }
}

export async function deleteCompanyFromSupabase(id: string): Promise<boolean> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return false
  }
  
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('[Supabase] Error deleting company:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[Supabase] Error deleting company:', e)
    return false
  }
}

export async function updateCompanyInSupabase(company: Company): Promise<boolean> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return false
  }
  
  try {
    const dbCompany = companyToDb(company)
    const { error } = await supabase
      .from('companies')
      .update(dbCompany)
      .eq('id', company.id)
    
    if (error) {
      console.error('[Supabase] Error updating company:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[Supabase] Error updating company:', e)
    return false
  }
}

export async function getCompaniesCountFromSupabase(): Promise<number> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return 0
  }
  
  try {
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('[Supabase] Error counting companies:', error)
      return 0
    }
    return count || 0
  } catch (e) {
    console.error('[Supabase] Error counting companies:', e)
    return 0
  }
}

export async function searchCompaniesFromSupabase(query: string): Promise<Company[]> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[Supabase] Error searching companies:', error)
      return []
    }
    
    return (data || []).map(dbToCompany)
  } catch (e) {
    console.error('[Supabase] Error searching companies:', e)
    return []
  }
}

export async function getCompaniesByCityFromSupabase(citySlug: string): Promise<Company[]> {
  if (!supabase) {
    console.warn('[Supabase] Client not initialized')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('city_slug', citySlug)
      .order('rating', { ascending: false })
    
    if (error) {
      console.error('[Supabase] Error loading companies by city:', error)
      return []
    }
    
    return (data || []).map(dbToCompany)
  } catch (e) {
    console.error('[Supabase] Error loading companies by city:', e)
    return []
  }
}

const STORAGE_KEY = "geruestbauer_companies"

export function saveCompaniesToStorage(companies: Company[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
  }
}

export function loadCompaniesFromStorage(): Company[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error("[v0] Error parsing stored companies:", e)
        return []
      }
    }
  }
  return []
}

export function addCompanyToStorage(company: Company): void {
  const companies = loadCompaniesFromStorage()
  companies.unshift(company)
  saveCompaniesToStorage(companies)
}

export function addMultipleCompaniesToStorage(newCompanies: Company[]): void {
  const existingCompanies = loadCompaniesFromStorage()
  const allCompanies = [...newCompanies, ...existingCompanies]
  saveCompaniesToStorage(allCompanies)
}

export function getAllStoredCompanies(): Company[] {
  return loadCompaniesFromStorage()
}
