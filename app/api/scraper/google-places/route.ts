import { NextRequest, NextResponse } from "next/server"

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface PlaceResult {
  name: string
  rating?: number
  user_ratings_total?: number
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  place_id: string
}

export async function POST(request: NextRequest) {
  try {
    const { query, city } = await request.json()

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API-Schlüssel nicht konfiguriert" },
        { status: 500 }
      )
    }

    if (!query || !city) {
      return NextResponse.json(
        { error: "Suchbegriff und Stadt sind erforderlich" },
        { status: 400 }
      )
    }

    const searchQuery = `${query} ${city} Deutschland`
    
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&language=de&key=${GOOGLE_PLACES_API_KEY}`
    
    const searchResponse = await fetch(textSearchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("[Google Places] Search error:", searchData)
      return NextResponse.json(
        { error: `Google API Fehler: ${searchData.status}` },
        { status: 500 }
      )
    }

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({
        companies: [],
        count: 0
      })
    }

    const companies = await Promise.all(
      searchData.results.slice(0, 20).map(async (place: any) => {
        let details: any = {}
        
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,formatted_address,formatted_phone_number,website,opening_hours&language=de&key=${GOOGLE_PLACES_API_KEY}`
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()
          
          if (detailsData.status === "OK") {
            details = detailsData.result
          }
        } catch (e) {
          console.error("[Google Places] Details error:", e)
        }

        return {
          name: details.name || place.name,
          address: details.formatted_address || place.formatted_address || "",
          city: city,
          rating: details.rating || place.rating || null,
          reviewCount: details.user_ratings_total || place.user_ratings_total || 0,
          phone: details.formatted_phone_number || "",
          website: details.website || "",
          placeId: place.place_id,
          isOpen: details.opening_hours?.open_now ?? null
        }
      })
    )

    const validCompanies = companies.filter(c => c.name && c.name.length > 0)

    return NextResponse.json({
      companies: validCompanies,
      count: validCompanies.length
    })

  } catch (error: any) {
    console.error("[Google Places] Error:", error)
    return NextResponse.json(
      { error: error.message || "Ein Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}
