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

      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Geprüfte Unternehmen</h3>
              <p className="text-slate-600 leading-relaxed">Alle Gerüstbauer sind zertifiziert und erfüllen höchste Sicherheitsstandards für Ihr Projekt.</p>
            </div>
          </div>

          <div className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Award className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Echte Bewertungen</h3>
              <p className="text-slate-600 leading-relaxed">Transparente Kundenbewertungen von verifizierten Projekten helfen Ihnen bei der richtigen Entscheidung.</p>
            </div>
          </div>

          <div className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Clock className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Schnelle Anfragen</h3>
              <p className="text-slate-600 leading-relaxed">Kontaktieren Sie Firmen direkt und erhalten Sie zeitnah ein unverbindliches Angebot für Ihr Vorhaben.</p>
            </div>
          </div>
        </div>
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
