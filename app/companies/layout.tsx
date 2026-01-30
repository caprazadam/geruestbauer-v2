import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gerüstbaufirmen in Deutschland | Gerüstbauer24',
  description: 'Durchsuchen Sie unser Verzeichnis geprüfter Gerüstbaufirmen. Finden Sie Fassadengerüst, Baugerüst und Gerüstverleih in Ihrer Stadt.',
  keywords: ['Gerüstbaufirmen', 'Gerüstbauer Verzeichnis', 'Fassadengerüst', 'Baugerüst', 'Gerüstverleih'],
  alternates: {
    canonical: 'https://geruestbauer24.eu/companies',
  },
}

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
