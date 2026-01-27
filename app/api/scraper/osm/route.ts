import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()

    if (!city) {
      return NextResponse.json({ error: "Stadt ist erforderlich" }, { status: 400 })
    }

    const overpassQuery = `
      [out:json][timeout:90];
      area["name"="${city}"]["boundary"="administrative"]["admin_level"~"^(4|6|8)$"]->.searchArea;
      (
        nwr["craft"="scaffolder"](area.searchArea);
        nwr["shop"="scaffolding"](area.searchArea);
        nwr["name"~"Gerüstbau|Gerüst",i](area.searchArea);
      );
      out center tags;
    `

    const overpassInstances = [
      "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://overpass-api.de/api/interpreter",
    ]

    let lastError = null
    let attemptedServers = 0

    for (const overpassUrl of overpassInstances) {
      attemptedServers++
      try {
        console.log(`[v0] Versuche Server ${attemptedServers}/${overpassInstances.length}: ${overpassUrl}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 Sekunden Timeout

        const response = await fetch(overpassUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "GeruestbauerVerzeichnis/1.0",
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[v0] Server ${overpassUrl} - Status ${response.status}`)
          lastError = `Server ${attemptedServers}: Status ${response.status}`
          continue
        }

        const data = await response.json()
        const elementCount = data.elements?.length || 0
        console.log(`[v0] ✓ Erfolgreich! ${elementCount} Firmen gefunden über ${overpassUrl}`)

        const companies = data.elements
          .filter((element: any) => element.tags && element.tags.name)
          .map((element: any) => {
            const tags = element.tags

            // Telefonnummer aus verschiedenen OSM-Tags extrahieren
            let phone = tags.phone || tags["contact:phone"] || tags["contact:mobile"] || tags.telephone || ""
            if (phone) {
              phone = phone.trim()
            }

            // Adresse zusammensetzen
            const street = tags["addr:street"] || ""
            const houseNumber = tags["addr:housenumber"] || ""
            const address = [street, houseNumber].filter(Boolean).join(" ") || "Keine Adresse"

            return {
              osmId: element.id.toString(),
              name: tags.name || "Unbekannt",
              address: address,
              postcode: tags["addr:postcode"] || "",
              city: tags["addr:city"] || city,
              phone: phone,
              website: tags.website || tags["contact:website"] || tags.url || "",
              email: tags.email || tags["contact:email"] || "",
              latitude: element.lat || (element.center && element.center.lat),
              longitude: element.lon || (element.center && element.center.lon),
              openingHours: tags.opening_hours || "",
            }
          })

        return NextResponse.json({
          success: true,
          companies,
          count: companies.length,
          server: overpassUrl,
        })
      } catch (fetchError: any) {
        console.error(`[v0] Server ${overpassUrl} - Fehler: ${fetchError.message}`)
        lastError = `Server ${attemptedServers}: ${fetchError.message}`
        continue
      }
    }

    console.error(`[v0] Alle ${attemptedServers} Server fehlgeschlagen. Letzter Fehler: ${lastError}`)

    return NextResponse.json(
      {
        success: false,
        error: "Alle Overpass API Server sind momentan nicht verfügbar",
        details: `Versucht: ${attemptedServers} Server. Letzter Fehler: ${lastError}. Bitte versuchen Sie es in 1-2 Minuten erneut.`,
        companies: [],
        count: 0,
      },
      { status: 503 },
    )
  } catch (error: any) {
    console.error("[v0] OSM Scraper Hauptfehler:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        details: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
        companies: [],
        count: 0,
      },
      { status: 500 },
    )
  }
}
