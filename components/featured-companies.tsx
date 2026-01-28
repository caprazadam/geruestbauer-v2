"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star, Users, Shield } from "lucide-react"
import { getLatestCompanies, type Company } from "@/lib/company-data"

export function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const latestCompanies = getLatestCompanies(6)
      setCompanies(latestCompanies)
      setLoading(false)
    }

    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <Link href={`/${company.citySlug}/${company.categorySlug}/${company.slug}`} key={company.id} className="group">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <div className="relative h-48">
              <Image
                src={company.imageUrl || "/placeholder.svg?height=300&width=400&query=scaffolding+construction+site"}
                alt={company.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{company.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center mb-3">
                <Star size={16} className="text-yellow-500 mr-1 fill-yellow-500" />
                <span className="font-semibold">{company.rating}</span>
                <span className="text-sm text-gray-600 ml-1">({company.reviewCount})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {company.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users size={16} />
                <span>{company.employees} Mitarbeiter</span>
              </div>
              <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-none shadow-sm flex items-center gap-1 px-3 py-1">
                <Shield size={12} className="text-yellow-400 fill-yellow-400" />
                Zertifiziert
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
