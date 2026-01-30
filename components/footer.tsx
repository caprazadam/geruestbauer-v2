import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Gerüstbauer-Verzeichnis</h3>
            <p className="mb-4">Das führende Verzeichnis für qualifizierte Gerüstbau-Unternehmen in Deutschland.</p>
            <div className="flex space-x-4">{/* Social media icons would go here */}</div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Schnellzugriffe</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/companies" className="hover:underline">
                  Firmen suchen
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:underline">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:underline">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+49 1639540595</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@geruestbauer24.eu</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Deutschlandweit verfügbar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Gerüstbauer-Verzeichnis. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
