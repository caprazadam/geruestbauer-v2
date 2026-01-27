import type { Company } from "./company-data"

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
  companies.unshift(company) // Neue Firma am Anfang
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
