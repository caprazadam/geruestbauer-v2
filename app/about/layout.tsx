import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns | Gerüstbauer24',
  description: 'Erfahren Sie mehr über Gerüstbauer24 - Das führende Verzeichnis für Gerüstbaufirmen in Deutschland.',
  alternates: {
    canonical: 'https://geruestbauer24.de/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
