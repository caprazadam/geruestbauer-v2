"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Calendar, Home, User, CreditCard, Plus } from "lucide-react"

type Booking = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyLocation: string
  propertyImage: string
  checkIn: string
  checkOut: string
  totalAmount: number
  status: "upcoming" | "completed" | "cancelled"
}

type Property = {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  status: "active" | "inactive"
  bookings: number
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um auf Ihr Dashboard zuzugreifen",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    const fetchDashboardData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockBookings: Booking[] = []
      const mockProperties: Property[] = []

      setBookings(mockBookings)
      setProperties(mockProperties)
      setLoading(false)
    }

    fetchDashboardData()
  }, [router, toast, user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user?.role === "owner" && (
          <Link href="/companies/create">
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Neue Firma eintragen
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anfragen Gesamt</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profil</p>
                <p className="text-lg font-medium truncate">{user?.name || "Benutzer"}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="requests">Meine Anfragen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Willkommen im Dashboard</CardTitle>
              <CardDescription>
                Hier können Sie Ihre Firmenprofile und Anfragen verwalten.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Keine Anfragen</CardTitle>
              <CardDescription>
                Sie haben aktuell keine aktiven Anfragen.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
