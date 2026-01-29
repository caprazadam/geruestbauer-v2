"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Startseite
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Datenschutzerklärung</CardTitle>
          <p className="text-slate-500">Stand: Januar 2026</p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Verantwortlicher</h2>
          <p className="text-slate-600 mb-4">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist Gerüstbauer24. 
            Kontaktdaten finden Sie im Impressum.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p className="text-slate-600 mb-4">
            Wir erheben personenbezogene Daten, wenn Sie sich registrieren, eine Anfrage stellen 
            oder unser Kontaktformular nutzen. Dies umfasst:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Name und Vorname</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer</li>
            <li>Unternehmensdaten (bei Firmenregistrierung)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. Zweck der Datenverarbeitung</h2>
          <p className="text-slate-600 mb-4">
            Ihre Daten werden verwendet für:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Die Bereitstellung unserer Dienste</li>
            <li>Die Kommunikation mit Ihnen</li>
            <li>Die Vermittlung zwischen Kunden und Gerüstbauunternehmen</li>
            <li>Die Verbesserung unserer Plattform</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. Rechtsgrundlage</h2>
          <p className="text-slate-600 mb-4">
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a, b und f DSGVO 
            (Einwilligung, Vertragserfüllung, berechtigtes Interesse).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. Weitergabe an Dritte</h2>
          <p className="text-slate-600 mb-4">
            Ihre Daten werden nur an Dritte weitergegeben, wenn dies zur Vertragserfüllung 
            erforderlich ist oder Sie ausdrücklich eingewilligt haben.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. Ihre Rechte</h2>
          <p className="text-slate-600 mb-4">
            Sie haben das Recht auf:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Auskunft über Ihre gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung Ihrer Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
            <li>Widerspruch gegen die Verarbeitung</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. Cookies</h2>
          <p className="text-slate-600 mb-4">
            Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und zu verbessern. 
            Sie können die Cookie-Einstellungen in Ihrem Browser anpassen.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. Datensicherheit</h2>
          <p className="text-slate-600 mb-4">
            Wir verwenden SSL-Verschlüsselung und andere Sicherheitsmaßnahmen, um Ihre Daten 
            vor unbefugtem Zugriff zu schützen.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">9. Kontakt</h2>
          <p className="text-slate-600 mb-4">
            Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren.
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm">
              Weitere Informationen erhalten Sie unter{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Kontakt
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
