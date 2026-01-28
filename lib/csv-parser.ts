import Papa from 'papaparse';
import { generateSlug } from './slug-utils';
import type { Company } from './company-data';

export interface CompanyCSV {
  place_id: string;
  name: string;
  description: string;
  is_spending_on_ads: string;
  reviews: string;
  rating: string;
  competitors: string;
  website: string;
  phone: string;
  can_claim: string;
  owner_name: string;
  owner_profile_link: string;
  featured_image: string;
  main_category: string;
  categories: string;
  workday_timing: string;
  is_temporarily_closed: string;
  closed_on: string;
  address: string;
  review_keywords: string;
  link: string;
  query: string;
}

export function parseCompanyCSV(csvContent: string): CompanyCSV[] {
  const result = Papa.parse<CompanyCSV>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export function transformCSVToCompany(csv: CompanyCSV): Company {
  const city = csv.query.split(' in ').pop()?.split(',')[0] || 'Hannover';
  const category = "Gerüstbau"; // Default for this app
  
  return {
    id: csv.place_id || Math.random().toString(36).substr(2, 9),
    name: csv.name,
    slug: generateSlug(csv.name),
    city: city,
    citySlug: generateSlug(city),
    category: category,
    categorySlug: generateSlug(category),
    location: city,
    employees: Math.floor(Math.random() * 50) + 5,
    rating: parseFloat(csv.rating) || 0,
    reviewCount: parseInt(csv.reviews) || 0,
    imageUrl: csv.featured_image || "/assets/default-company.jpg",
    services: csv.categories ? csv.categories.split(',').map(c => c.trim()) : ["Gerüstbau"],
    certifications: ["TÜV", "DGUV"],
    description: csv.description || `${csv.name} ist Ihr zuverlässiger Partner für Gerüstbau in ${city}.`,
    phone: csv.phone || "",
    email: "",
    website: csv.website || "",
    address: csv.address || "",
    founded: 2000 + Math.floor(Math.random() * 20),
    specialties: csv.categories ? csv.categories.split(',').map(c => c.trim()).slice(0, 3) : ["Gerüstbau"],
  };
}
