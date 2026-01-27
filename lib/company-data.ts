import { loadCompaniesFromStorage } from "./company-storage"

export type Company = {
  id: string
  name: string
  slug: string
  city: string
  citySlug: string
  category: string
  categorySlug: string
  location: string
  employees: number
  rating: number
  reviewCount: number
  imageUrl: string
  services: string[]
  certifications: string[]
  description: string
  phone: string
  email: string
  website: string
  address: string
  founded: number
  specialties: string[]
}

export const companies: Company[] = [
  {
    id: "1",
    name: "Gerüstbau München GmbH",
    slug: "geruestbau-muenchen-gmbh",
    city: "München",
    citySlug: "muenchen",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "München, Bayern",
    employees: 45,
    rating: 4.9,
    reviewCount: 127,
    imageUrl: "/scaffolding-construction-munich.jpg",
    services: ["fassadengerust", "arbeitsgerust", "dachfanggerust"],
    certifications: ["ISO 9001", "TÜV", "DGUV"],
    description:
      "Seit über 25 Jahren Ihr zuverlässiger Partner für Gerüstbau in München und Umgebung. Wir bieten professionelle Lösungen für Fassadengerüste, Arbeitsgerüste und Spezialgerüste. Unsere erfahrenen Mitarbeiter garantieren höchste Sicherheitsstandards und termingerechte Ausführung.",
    phone: "+49 89 123456",
    email: "info@geruestbau-muenchen.de",
    website: "www.geruestbau-muenchen.de",
    address: "Musterstraße 123, 80331 München",
    founded: 1998,
    specialties: ["Fassadengerüst", "Arbeitsgerüst", "Dachfanggerüst"],
  },
  {
    id: "2",
    name: "Nord Gerüstbau Hamburg",
    slug: "nord-geruestbau-hamburg",
    city: "Hamburg",
    citySlug: "hamburg",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "Hamburg",
    employees: 32,
    rating: 4.7,
    reviewCount: 89,
    imageUrl: "/scaffolding-rental-hamburg.jpg",
    services: ["rollgerust", "schutzgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "TÜV"],
    description:
      "Nord Gerüstbau Hamburg ist Ihr Spezialist für Rollgerüste und Schutzgerüste im Raum Hamburg. Mit über 30 qualifizierten Mitarbeitern bieten wir auch Vermietung und Montage. Schnelle Reaktionszeiten und flexible Lösungen sind unser Markenzeichen.",
    phone: "+49 40 987654",
    email: "kontakt@nord-geruestbau.de",
    website: "www.nord-geruestbau.de",
    address: "Hafenstraße 45, 20459 Hamburg",
    founded: 2005,
    specialties: ["Rollgerüst", "Schutzgerüst", "Gerüst-Vermietung"],
  },
  {
    id: "3",
    name: "Berlin Scaffold Systems",
    slug: "berlin-scaffold-systems",
    city: "Berlin",
    citySlug: "berlin",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "Berlin",
    employees: 58,
    rating: 4.8,
    reviewCount: 156,
    imageUrl: "/professional-scaffolding-berlin.jpg",
    services: ["fassadengerust", "arbeitsgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "TÜV", "DGUV"],
    description:
      "Als eines der größten Gerüstbau-Unternehmen in Berlin bieten wir komplette Systemlösungen für Bauprojekte jeder Größenordnung. Von der Planung über die Montage bis zur Demontage - alles aus einer Hand. Modernste Technik und geschultes Personal garantieren höchste Qualität.",
    phone: "+49 30 456789",
    email: "info@berlin-scaffold.de",
    website: "www.berlin-scaffold.de",
    address: "Alexanderplatz 10, 10178 Berlin",
    founded: 1995,
    specialties: ["Fassadengerüst", "Arbeitsgerüst", "Gerüst-Vermietung"],
  },
  {
    id: "4",
    name: "Köln Gerüstbau Profis",
    slug: "koeln-geruestbau-profis",
    city: "Köln",
    citySlug: "koeln",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "Köln, NRW",
    employees: 38,
    rating: 4.6,
    reviewCount: 73,
    imageUrl: "/scaffolding-installation-cologne.jpg",
    services: ["fassadengerust", "schutzgerust", "dachfanggerust"],
    certifications: ["ISO 9001", "TÜV"],
    description:
      "Köln Gerüstbau Profis steht für Qualität und Zuverlässigkeit im Raum Köln und NRW. Unsere Kernkompetenzen liegen im Fassadengerüstbau und Dachfanggerüsten. Wir arbeiten für private Bauherren, Handwerksbetriebe und große Bauunternehmen.",
    phone: "+49 221 345678",
    email: "info@koeln-geruestbau.de",
    website: "www.koeln-geruestbau.de",
    address: "Domstraße 67, 50668 Köln",
    founded: 2008,
    specialties: ["Fassadengerüst", "Schutzgerüst", "Dachfanggerüst"],
  },
  {
    id: "5",
    name: "Frankfurt Gerüsttechnik",
    slug: "frankfurt-geruesttechnik",
    city: "Frankfurt",
    citySlug: "frankfurt",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "Frankfurt am Main, Hessen",
    employees: 42,
    rating: 4.7,
    reviewCount: 94,
    imageUrl: "/scaffolding-systems-frankfurt.jpg",
    services: ["arbeitsgerust", "rollgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "DGUV"],
    description:
      "Frankfurt Gerüsttechnik bietet innovative Gerüstlösungen für die Metropolregion Frankfurt. Spezialisiert auf Arbeitsgerüste und Rollgerüste, bedienen wir sowohl Neubauprojekte als auch Renovierungen. Unser Fuhrpark ermöglicht schnelle Lieferzeiten.",
    phone: "+49 69 234567",
    email: "service@frankfurt-geruesttechnik.de",
    website: "www.frankfurt-geruesttechnik.de",
    address: "Mainstraße 88, 60311 Frankfurt am Main",
    founded: 2010,
    specialties: ["Arbeitsgerüst", "Rollgerüst", "Gerüst-Vermietung"],
  },
  {
    id: "6",
    name: "Stuttgart Scaffold GmbH",
    slug: "stuttgart-scaffold-gmbh",
    city: "Stuttgart",
    citySlug: "stuttgart",
    category: "Gerüstbau",
    categorySlug: "geruestbau",
    location: "Stuttgart, Baden-Württemberg",
    employees: 35,
    rating: 4.5,
    reviewCount: 68,
    imageUrl: "/scaffolding-construction-stuttgart.jpg",
    services: ["fassadengerust", "arbeitsgerust", "schutzgerust"],
    certifications: ["ISO 9001", "TÜV"],
    description:
      "Stuttgart Scaffold GmbH ist Ihr Partner für sicheres Arbeiten in der Höhe. Mit modernsten Gerüstsystemen und erfahrenem Personal bieten wir maßgeschneiderte Lösungen für Ihre Bauprojekte in Stuttgart und Umgebung. Sicherheit steht bei uns an erster Stelle.",
    phone: "+49 711 567890",
    email: "info@stuttgart-scaffold.de",
    website: "www.stuttgart-scaffold.de",
    address: "Königstraße 34, 70173 Stuttgart",
    founded: 2012,
    specialties: ["Fassadengerüst", "Arbeitsgerüst", "Schutzgerüst"],
  },
]

export function getCompanyBySlug(citySlug: string, categorySlug: string, companySlug: string): Company | undefined {
  const allCompanies = getAllCompanies()

  const found = allCompanies.find(
    (c) => c.citySlug === citySlug && c.categorySlug === categorySlug && c.slug === companySlug,
  )

  return found
}

export function getAllCompanies(): Company[] {
  const storedCompanies = loadCompaniesFromStorage()
  // Kombiniere mit den Standard-Mock-Daten
  return [...storedCompanies, ...companies]
}

export function getLatestCompanies(limit = 6): Company[] {
  const allCompanies = getAllCompanies()
  return allCompanies.slice(0, limit)
}
