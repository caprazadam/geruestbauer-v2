import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Gerüstbauer24',
  description: 'Kontaktieren Sie uns für Fragen zu unserem Gerüstbau-Verzeichnis. Wir helfen Ihnen gerne weiter.',
  alternates: {
    canonical: 'https://geruestbauer24.eu/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
