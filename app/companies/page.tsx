"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/search-bar"
import { MapPin, Star, Users, Award, HardHat, Truck } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { getAllCompanies, type Company } from "@/lib/company-data"
import Link from "next/link"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const location = searchParams?.get("location") || ""
  const service = searchParams?.get("service") || ""

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      // Small delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 300))

      let allCompaniesList = getAllCompanies()

      // Apply location filter from URL
      if (location) {
        allCompaniesList = allCompaniesList.filter((company) => 
          company.location.toLowerCase().includes(location.toLowerCase()) ||
          company.city.toLowerCase().includes(location.toLowerCase())
        )
      }

      // Apply service filter from URL
      if (service) {
        allCompaniesList = allCompaniesList.filter((company) => 
          company.services.includes(service)
        )
      }

      setCompanies(allCompaniesList)
      setLoading(false)
    }

    fetchCompanies()
  }, [location, service])

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((s) => s !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const filteredCompanies = companies.filter((company) => {
    // Service filtering from checkboxes (AND logic)
    if (selectedServices.length > 0) {
      const hasAllServices = selectedServices.every((s) => company.services.includes(s))
      if (!hasAllServices) return false
    }
    return true
  })

  const handleCompanyClick = (id: string) => {
    router.push(`/companies/${id}`)
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "fassadengerust":
        return <HardHat size={16} />
      case "arbeitsgerust":
        return <Award size={16} />
      case "schutzgerust":
        return <Award size={16} />
      case "rollgerust":
        return <Truck size={16} />
      default:
        return <HardHat size={16} />
    }
  }

  const getServiceLabel = (service: string) => {
    switch (service) {
      case "fassadengerust":
        return "Fassadengerüst"
      case "arbeitsgerust":
        return "Arbeitsgerüst"
      case "schutzgerust":
        return "Schutzgerüst"
      case "dachfanggerust":
        return "Dachfanggerüst"
      case "rollgerust":
        return "Rollgerüst"
      case "gerust-vermietung":
        return "Vermietung"
      default:
        return service
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gerüstbau-Unternehmen in Deutschland</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Filter</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Leistungen</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fassadengerust"
                      checked={selectedServices.includes("fassadengerust")}
                      onCheckedChange={() => handleServiceChange("fassadengerust")}
                    />
                    <label htmlFor="fassadengerust" className="text-sm flex items-center gap-1">
                      <HardHat size={16} /> Fassadengerüst
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="arbeitsgerust"
                      checked={selectedServices.includes("arbeitsgerust")}
                      onCheckedChange={() => handleServiceChange("arbeitsgerust")}
                    />
                    <label htmlFor="arbeitsgerust" className="text-sm flex items-center gap-1">
                      <Award size={16} /> Arbeitsgerüst
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="schutzgerust"
                      checked={selectedServices.includes("schutzgerust")}
                      onCheckedChange={() => handleServiceChange("schutzgerust")}
                    />
                    <label htmlFor="schutzgerust" className="text-sm flex items-center gap-1">
                      <Award size={16} /> Schutzgerüst
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rollgerust"
                      checked={selectedServices.includes("rollgerust")}
                      onCheckedChange={() => handleServiceChange("rollgerust")}
                    />
                    <label htmlFor="rollgerust" className="text-sm flex items-center gap-1">
                      <Truck size={16} /> Rollgerüst
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedServices([])}>
                  Filter zurücksetzen
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompanies.map((company) => (
                <Link
                  href={`/${company.citySlug}/${company.categorySlug}/${company.slug}`}
                  key={company.id}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={
                          company.imageUrl ||
                          "/placeholder.svg?height=300&width=400&query=scaffolding+construction+site"
                        }
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <Star size={16} className="text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="font-semibold">{company.rating}</span>
                        <span className="text-sm text-gray-600 ml-1">({company.reviewCount})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {company.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline" className="flex items-center gap-1 text-xs">
                            {getServiceIcon(service)}
                            {getServiceLabel(service)}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {company.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{company.employees} Mitarbeiter</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Keine Firmen gefunden</h3>
              <p className="text-gray-600 mb-6">Versuchen Sie, Ihre Filter oder Suchkriterien anzupassen</p>
              <Button onClick={() => setSelectedServices([])}>Filter zurücksetzen</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
