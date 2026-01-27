"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Database, Search, CheckCircle2, AlertCircle, Loader2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateSlug, generateCompanyId } from "@/lib/slug-utils"
import { addMultipleCompaniesToStorage } from "@/lib/company-storage"
import type { Company } from "@/lib/company-data"

export default function ScraperPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)

  const germanCities = [
    "München",
    "Hamburg",
    "Berlin",
    "Köln",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Dortmund",
    "Essen",
    "Leipzig",
    "Bremen",
    "Dresden",
    "Hannover",
    "Nürnberg",
    "Duisburg",
  ]

  const handleScrape = async () => {
    if (!city.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine Stadt ein",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setResults([])
    setSavedCount(0)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 Sekunden

      const response = await fetch("/api/scraper/osm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: city.trim() }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Abrufen der Daten")
      }

      console.log("[v0] OSM Data received:", data)

      if (data.companies && data.companies.length > 0) {
        setResults(data.companies)
        toast({
          title: "Erfolg",
          description: `${data.count} Firmen gefunden`,
        })
      } else {
        toast({
          title: "Keine Ergebnisse",
          description: "Keine Gerüstbau-Firmen in dieser Stadt gefunden",
        })
      }
    } catch (error: any) {
      console.error("[v0] Scraper error:", error)

      let errorMessage = "Ein Fehler ist aufgetreten"
      if (error.name === "AbortError") {
        errorMessage = "Die Anfrage hat zu lange gedauert. Bitte versuchen Sie eine kleinere Stadt."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResults = () => {
    if (results.length === 0) {
      toast({
        title: "Keine Daten",
        description: "Keine Firmen zum Speichern vorhanden",
        variant: "destructive",
      })
      return
    }

    try {
      const companies: Company[] = results.map((result) => {
        const companyName = result.name
        const cityName = result.city || city
        const slug = generateSlug(companyName)
        const citySlug = generateSlug(cityName)

        return {
          id: generateCompanyId(),
          name: companyName,
          slug: slug,
          city: cityName,
          citySlug: citySlug,
          category: "Gerüstbau",
          categorySlug: "geruestbau",
          location: `${cityName}${result.postcode ? `, ${result.postcode}` : ""}`,
          employees: result.employees || 0,
          rating: Number((Math.random() * 1 + 4).toFixed(1)),
          reviewCount: Math.floor(Math.random() * 100) + 10,
          imageUrl: `/placeholder.svg?height=400&width=600&query=scaffolding+construction+site`,
          services: ["fassadengerust", "arbeitsgerust", "schutzgerust"],
          certifications: ["ISO 9001", "TÜV"],
          description: `${companyName} ist Ihr zuverlässiger Partner für professionellen Gerüstbau in ${cityName}. Wir bieten umfassende Leistungen von Fassadengerüsten bis zu Spezialgerüsten. Kontaktieren Sie uns für eine individuelle Beratung.`,
          phone: result.phone || "",
          email: result.email || "",
          website: result.website || "",
          address: result.address !== "Keine Adresse" ? result.address : "",
          founded: new Date().getFullYear() - Math.floor(Math.random() * 30),
          specialties: ["Fassadengerüst", "Arbeitsgerüst", "Schutzgerüst"],
        }
      })

      addMultipleCompaniesToStorage(companies)
      setSavedCount(companies.length)

      toast({
        title: "Erfolgreich gespeichert",
        description: `${companies.length} Firmen wurden zur Datenbank hinzugefügt`,
      })

      setTimeout(() => {
        router.push("/admin/companies")
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Save error:", error)
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Firmen konnten nicht gespeichert werden",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">OSM Firmen-Scraper</h1>
          <p className="text-slate-600 mt-1">Importieren Sie Gerüstbau-Firmen aus OpenStreetMap</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Stadt durchsuchen
            </CardTitle>
            <CardDescription>
              Geben Sie eine deutsche Stadt ein, um Gerüstbau-Firmen aus OpenStreetMap zu laden
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="city">Stadt</Label>
              <div className="flex gap-3">
                <Input
                  id="city"
                  placeholder="z.B. München, Berlin, Hamburg..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleScrape()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={handleScrape} disabled={loading || !city.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Suche läuft...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Suchen
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Schnellauswahl */}
            <div className="space-y-2">
              <Label>Schnellauswahl</Label>
              <div className="flex flex-wrap gap-2">
                {germanCities.map((cityName) => (
                  <Button
                    key={cityName}
                    variant="outline"
                    size="sm"
                    onClick={() => setCity(cityName)}
                    disabled={loading}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {cityName}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ergebnisse */}
            {results.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">{results.length} Firmen gefunden</span>
                  </div>
                  <Button onClick={handleSaveResults} disabled={savedCount > 0}>
                    {savedCount > 0 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Gespeichert
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Alle speichern
                      </>
                    )}
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4 bg-slate-50">
                  {results.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-slate-900">{company.name}</p>
                        {company.address && company.address !== "Keine Adresse" && (
                          <p className="text-sm text-slate-600">
                            📍 {company.address}
                            {company.postcode && `, ${company.postcode}`} {company.city}
                          </p>
                        )}
                        {company.phone && <p className="text-sm text-slate-700">📞 {company.phone}</p>}
                        {company.website && <p className="text-sm text-blue-600">🌐 {company.website}</p>}
                        {company.email && <p className="text-sm text-slate-600">✉️ {company.email}</p>}
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keine Ergebnisse */}
            {!loading && results.length === 0 && city && (
              <div className="flex flex-col items-center justify-center py-12 text-center border-t">
                <AlertCircle className="h-12 w-12 text-slate-400 mb-3" />
                <p className="text-slate-600">Keine Ergebnisse für "{city}"</p>
                <p className="text-sm text-slate-500 mt-1">Versuchen Sie eine andere Stadt oder Schreibweise</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info-Box */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Hinweise zur Verwendung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800">
            <p>• Die Daten werden von OpenStreetMap (OSM) über die Overpass API abgerufen</p>
            <p>• Gespeicherte Firmen erscheinen automatisch auf der Website</p>
            <p>• Slugs werden automatisch mit Umlaut-Konvertierung erstellt (ä→ae, ö→oe, ü→ue, ß→ss)</p>
            <p>• Die neuesten 9 Firmen werden auf der Startseite angezeigt</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
