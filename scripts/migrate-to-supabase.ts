import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const mockCompanies = [
  {
    id: "1",
    name: "Gerüstbau München GmbH",
    slug: "geruestbau-muenchen-gmbh",
    city: "München",
    city_slug: "muenchen",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "München, Bayern",
    employees: 45,
    rating: 4.9,
    review_count: 127,
    image_url: "/scaffolding-construction-munich.jpg",
    services: ["fassadengerust", "arbeitsgerust", "dachfanggerust"],
    certifications: ["ISO 9001", "TÜV", "DGUV"],
    description: "Seit über 25 Jahren Ihr zuverlässiger Partner für Gerüstbau in München und Umgebung.",
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
    city_slug: "hamburg",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "Hamburg",
    employees: 32,
    rating: 4.7,
    review_count: 89,
    image_url: "/scaffolding-rental-hamburg.jpg",
    services: ["rollgerust", "schutzgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "TÜV"],
    description: "Nord Gerüstbau Hamburg ist Ihr Spezialist für Rollgerüste und Schutzgerüste im Raum Hamburg.",
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
    city_slug: "berlin",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "Berlin",
    employees: 58,
    rating: 4.8,
    review_count: 156,
    image_url: "/professional-scaffolding-berlin.jpg",
    services: ["fassadengerust", "arbeitsgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "TÜV", "DGUV"],
    description: "Als eines der größten Gerüstbau-Unternehmen in Berlin bieten wir komplette Systemlösungen.",
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
    city_slug: "koeln",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "Köln, NRW",
    employees: 38,
    rating: 4.6,
    review_count: 73,
    image_url: "/scaffolding-installation-cologne.jpg",
    services: ["fassadengerust", "schutzgerust", "dachfanggerust"],
    certifications: ["ISO 9001", "TÜV"],
    description: "Köln Gerüstbau Profis steht für Qualität und Zuverlässigkeit im Raum Köln und NRW.",
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
    city_slug: "frankfurt",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "Frankfurt am Main, Hessen",
    employees: 42,
    rating: 4.7,
    review_count: 94,
    image_url: "/scaffolding-systems-frankfurt.jpg",
    services: ["arbeitsgerust", "rollgerust", "gerust-vermietung"],
    certifications: ["ISO 9001", "DGUV"],
    description: "Frankfurt Gerüsttechnik bietet innovative Gerüstlösungen für die Metropolregion Frankfurt.",
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
    city_slug: "stuttgart",
    category: "Gerüstbau",
    category_slug: "geruestbau",
    location: "Stuttgart, Baden-Württemberg",
    employees: 35,
    rating: 4.5,
    review_count: 68,
    image_url: "/scaffolding-construction-stuttgart.jpg",
    services: ["fassadengerust", "arbeitsgerust", "schutzgerust"],
    certifications: ["ISO 9001", "TÜV"],
    description: "Stuttgart Scaffold GmbH ist Ihr Partner für sicheres Arbeiten in der Höhe.",
    phone: "+49 711 567890",
    email: "info@stuttgart-scaffold.de",
    website: "www.stuttgart-scaffold.de",
    address: "Königstraße 34, 70173 Stuttgart",
    founded: 2012,
    specialties: ["Fassadengerüst", "Arbeitsgerüst", "Schutzgerüst"],
  },
]

async function migrateToSupabase() {
  console.log('Starting migration to Supabase...')
  console.log(`Migrating ${mockCompanies.length} companies...`)

  const { data, error } = await supabase
    .from('companies')
    .upsert(mockCompanies, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }

  console.log(`Successfully migrated ${data?.length || 0} companies to Supabase!`)
  
  const { count } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
  
  console.log(`Total companies in Supabase: ${count}`)
}

migrateToSupabase()
