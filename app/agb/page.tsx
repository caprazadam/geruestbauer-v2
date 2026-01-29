"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function AGBPage() {
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
          <CardTitle className="text-3xl">Allgemeine Geschäftsbedingungen</CardTitle>
          <p className="text-slate-500">Stand: Januar 2026</p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Geltungsbereich</h2>
          <p className="text-slate-600 mb-4">
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Nutzer der Plattform Gerüstbauer24. 
            Mit der Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. Leistungsbeschreibung</h2>
          <p className="text-slate-600 mb-4">
            Gerüstbauer24 ist ein Online-Verzeichnis für Gerüstbauunternehmen in Deutschland. 
            Wir vermitteln den Kontakt zwischen Suchenden und Gerüstbaufirmen.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. Registrierung und Nutzerkonto</h2>
          <p className="text-slate-600 mb-4">
            Für bestimmte Funktionen ist eine Registrierung erforderlich. Sie sind verpflichtet, 
            wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten vertraulich zu behandeln.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. Pflichten der Nutzer</h2>
          <p className="text-slate-600 mb-4">
            Nutzer verpflichten sich, keine rechtswidrigen Inhalte zu veröffentlichen und 
            die Plattform nicht missbräuchlich zu nutzen.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. Haftungsausschluss</h2>
          <p className="text-slate-600 mb-4">
            Gerüstbauer24 übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder 
            Aktualität der bereitgestellten Informationen. Die Haftung für leichte Fahrlässigkeit 
            ist ausgeschlossen, soweit gesetzlich zulässig.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. Urheberrecht</h2>
          <p className="text-slate-600 mb-4">
            Alle Inhalte auf dieser Plattform sind urheberrechtlich geschützt. Eine Vervielfältigung 
            oder Verwendung ohne Genehmigung ist nicht gestattet.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. Änderungen der AGB</h2>
          <p className="text-slate-600 mb-4">
            Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden auf der 
            Plattform bekannt gegeben.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. Schlussbestimmungen</h2>
          <p className="text-slate-600 mb-4">
            Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, bleibt 
            die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm">
              Bei Fragen zu unseren AGB kontaktieren Sie uns bitte unter{" "}
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
