import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, CreditCard, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Über das Gerüstbauer-Verzeichnis</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Wir verbinden seit 2023 Kunden mit erstklassigen Gerüstbau-Unternehmen in ganz Deutschland.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Unsere Geschichte</h2>
          <p className="mb-4">
            Das Gerüstbauer-Verzeichnis wurde mit der Vision gegründet, die Suche nach zuverlässigen Gerüstbau-Lösungen
            für Bauprojekte jeder Art zu vereinfachen. Unsere Plattform verbindet Bauherren, Architekten und Handwerksbetriebe
            mit qualifizierten Dienstleistern.
          </p>
          <p className="mb-4">
            Wir legen großen Wert auf Transparenz und Qualität. Alle bei uns gelisteten Unternehmen werden sorgfältig
            geprüft, um höchste Sicherheitsstandards und professionelle Ausführung zu gewährleisten.
          </p>
          <p>
            Heute bieten wir ein breites Spektrum an spezialisierten Firmen in Berlin, München, Hamburg und vielen
            weiteren Städten an, um jedem individuellen Bedarf gerecht zu werden.
          </p>
        </div>
        <div className="relative h-80 md:h-96">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="Gerüstbau Landschaft"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Unsere Werte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Vertrauen & Sicherheit</h3>
              <p>
                Wir priorisieren die Sicherheit unserer Nutzer durch robuste Verifizierungsprozesse.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Unterstützung</h3>
              <p>Unser Support-Team steht Ihnen rund um die Uhr zur Verfügung.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CreditCard className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Transparenz</h3>
              <p>Wir glauben an klare Kommunikation und transparente Preisgestaltung ohne versteckte Gebühren.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Gemeinschaft</h3>
              <p>
                Wir fördern eine Gemeinschaft von verantwortungsbewussten Unternehmen und Kunden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Werden Sie Teil unserer Gemeinschaft</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Egal, ob Sie ein Gerüst suchen oder Ihr eigenes Unternehmen listen möchten, wir laden Sie ein, Teil
          unseres wachsenden Netzwerks zu werden.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/companies">
            <Button size="lg">Firmen durchsuchen</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">
              Registrieren
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
