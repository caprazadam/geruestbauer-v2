import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FeaturedCompanies } from "@/components/featured-companies"
import Link from "next/link"
import { Shield, Clock, Award } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Finden Sie zuverlässige Gerüstbauer in Ihrer Region</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Entdecken Sie geprüfte Gerüstbau-Unternehmen mit Erfahrung, Zertifizierungen und echten Kundenbewertungen.
        </p>
        <SearchBar />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top bewertete Gerüstbauer</h2>
        <FeaturedCompanies />
      </section>

      <section className="mb-12 grid md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="mx-auto h-12 w-12 mb-4 text-blue-600" />
            <h3 className="text-xl font-bold mb-2">Geprüfte Unternehmen</h3>
            <p>Alle Gerüstbauer sind zertifiziert und erfüllen höchste Sicherheitsstandards.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="mx-auto h-12 w-12 mb-4 text-blue-600" />
            <h3 className="text-xl font-bold mb-2">Echte Bewertungen</h3>
            <p>Transparente Kundenbewertungen helfen Ihnen bei der richtigen Entscheidung.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="mx-auto h-12 w-12 mb-4 text-blue-600" />
            <h3 className="text-xl font-bold mb-2">Schnelle Anfragen</h3>
            <p>Kontaktieren Sie Firmen direkt und erhalten Sie zeitnah ein unverbindliches Angebot.</p>
          </CardContent>
        </Card>
      </section>

      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Bereit, den passenden Gerüstbauer zu finden?</h2>
        <Link href="/companies">
          <Button size="lg" className="mt-2">
            Alle Firmen durchsuchen
          </Button>
        </Link>
      </section>
    </div>
  )
}
