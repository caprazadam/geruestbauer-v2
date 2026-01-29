import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Gerüstbauer24',
  description: 'Das führende Verzeichnis für Gerüstbaufirmen in Deutschland. Finden Sie zuverlässige Gerüstbauer in Ihrer Nähe für Fassadengerüste, Baugerüste und mehr.',
  url: 'https://geruestbauer24.de',
  ogImage: '/professional-scaffolding-berlin.jpg',
  keywords: [
    'Gerüstbau',
    'Gerüstbauer',
    'Gerüstbaufirma',
    'Fassadengerüst',
    'Baugerüst',
    'Gerüstverleih',
    'Gerüstmontage',
    'Deutschland',
    'Berlin',
    'München',
    'Hamburg',
    'Köln',
    'Frankfurt'
  ]
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Gerüstbaufirmen in Deutschland finden`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteConfig.url,
    title: `${siteConfig.name} - Gerüstbaufirmen in Deutschland finden`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Gerüstbauer24 - Professioneller Gerüstbau in Deutschland'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Gerüstbaufirmen in Deutschland finden`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'de-DE': siteConfig.url,
    },
  },
  category: 'business',
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE'
    },
    sameAs: []
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/companies?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateLocalBusinessSchema(company: {
  name: string
  description?: string
  address: string
  city: string
  phone?: string
  email?: string
  website?: string
  rating?: number
  reviewCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/companies/${encodeURIComponent(company.name)}`,
    name: company.name,
    description: company.description || `${company.name} - Professioneller Gerüstbau in ${company.city}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: company.city,
      addressCountry: 'DE'
    },
    telephone: company.phone,
    email: company.email,
    url: company.website,
    ...(company.rating && company.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: company.rating,
        reviewCount: company.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    })
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}
