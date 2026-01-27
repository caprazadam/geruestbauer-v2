"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Users,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Shield,
  HardHat,
  Truck,
  ArrowLeft,
} from "lucide-react"
import { getCompanyBySlug } from "@/lib/company-data"
import { useEffect, useState } from "react"
import type { Company } from "@/lib/company-data"

type Props = {
  params: {
    city: string
    category: string
    company: string
  }
}

export default function CompanyDetailPage({ params }: Props) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCompany = () => {
      console.log("[v0] Looking for company with slugs:", params)
      const foundCompany = getCompanyBySlug(params.city, params.category, params.company)
      console.log("[v0] Found company:", foundCompany ? foundCompany.name : "NOT FOUND")

      setCompany(foundCompany || null)
      setLoading(false)
    }

    loadCompany()
  }, [params])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!company) {
    notFound()
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "fassadengerust":
        return <HardHat size={20} />
      case "arbeitsgerust":
        return <Award size={20} />
      case "schutzgerust":
        return <Shield size={20} />
      case "rollgerust":
        return <Truck size={20} />
      case "dachfanggerust":
        return <Shield size={20} />
      case "gerust-vermietung":
        return <Truck size={20} />
      default:
        return <HardHat size={20} />
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
        return "Gerüst-Vermietung"
      default:
        return service
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/companies" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
        <ArrowLeft size={20} />
        Zurück zur Übersicht
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={company.imageUrl || "/placeholder.svg?height=400&width=800&query=scaffolding+construction"}
              alt={company.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{company.name}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-600" size={20} />
              <span className="text-lg">{company.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <span className="text-lg font-semibold">{company.rating}</span>
              <span className="text-gray-600">({company.reviewCount} Bewertungen)</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Über uns</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{company.description}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={20} />
                <span>Gegründet {company.founded}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Unsere Leistungen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.services.map((service) => (
                  <div key={service} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-blue-600">{getServiceIcon(service)}</div>
                    <span className="font-medium">{getServiceLabel(service)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Zertifizierungen & Qualifikationen</h2>
              <div className="flex flex-wrap gap-2">
                {company.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-sm px-4 py-2">
                    <Award size={16} className="mr-2" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Kontaktinformationen</h2>

              <div className="space-y-4">
                {company.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Telefon</p>
                      <a href={`tel:${company.phone}`} className="font-medium hover:text-blue-600">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                )}

                {company.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">E-Mail</p>
                      <a href={`mailto:${company.email}`} className="font-medium hover:text-blue-600">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Website</p>
                      <a
                        href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-blue-600"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                {company.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Adresse</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  </div>
                )}

                {company.employees > 0 && (
                  <div className="flex items-start gap-3">
                    <Users className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mitarbeiter</p>
                      <p className="font-medium">{company.employees} Mitarbeiter</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full" size="lg">
                  Jetzt Anfrage senden
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Angebot anfordern
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
