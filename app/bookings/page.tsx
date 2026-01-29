"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Booking = {
  id: string
  propertyId: string
  propertyTitle: string
  propertyLocation: string
  propertyImage: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: "upcoming" | "completed" | "cancelled"
  bookingDate: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your bookings",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    // This would be replaced with an actual API call
    const fetchBookings = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockBookings: Booking[] = [
        {
          id: "booking-1",
          propertyId: "1",
          propertyTitle: "Luxury Villa with Mountain View",
          propertyLocation: "Ooty, Nilgiris",
          propertyImage: "/luxury-villa-mountain.jpg",
          checkIn: "2023-12-15",
          checkOut: "2023-12-18",
          guests: 4,
          totalAmount: 38000,
          status: "upcoming",
          bookingDate: "2023-11-20",
        },
        {
          id: "booking-2",
          propertyId: "3",
          propertyTitle: "Modern Apartment with Scenic Views",
          propertyLocation: "Kotagiri, Nilgiris",
          propertyImage: "/modern-apartment-scenic.jpg",
          checkIn: "2023-10-05",
          checkOut: "2023-10-08",
          guests: 2,
          totalAmount: 19000,
          status: "completed",
          bookingDate: "2023-09-15",
        },
        {
          id: "booking-3",
          propertyId: "2",
          propertyTitle: "Cozy Cottage near Tea Gardens",
          propertyLocation: "Coonoor, Nilgiris",
          propertyImage: "/cozy-cottage-tea-garden.jpg",
          checkIn: "2023-08-12",
          checkOut: "2023-08-15",
          guests: 3,
          totalAmount: 27000,
          status: "cancelled",
          bookingDate: "2023-07-25",
        },
      ]

      setBookings(mockBookings)
      setLoading(false)
    }

    fetchBookings()
  }, [router, toast, user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-500">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredBookings = (status: string) => {
    return bookings.filter((booking) => booking.status === status)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-32 w-32 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="space-y-2 w-32">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length > 0 ? (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            {filteredBookings("upcoming").length > 0 ? (
              filteredBookings("upcoming").map((booking) => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <EmptyState message="You don't have any upcoming bookings" />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {filteredBookings("completed").length > 0 ? (
              filteredBookings("completed").map((booking) => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <EmptyState message="You don't have any completed bookings" />
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {filteredBookings("cancelled").length > 0 ? (
              filteredBookings("cancelled").map((booking) => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <EmptyState message="You don't have any cancelled bookings" />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div
            className="relative h-48 md:h-auto md:w-48 cursor-pointer"
            onClick={() => router.push(`/properties/${booking.propertyId}`)}
          >
            <Image
              src={booking.propertyImage || "/placeholder.svg"}
              alt={booking.propertyTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(booking.status)}
                  <h3 className="font-bold text-lg">{booking.propertyTitle}</h3>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>{booking.propertyLocation}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>Booked on {formatDate(booking.bookingDate)}</span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                {getStatusBadge(booking.status)}
                <div className="font-bold text-lg">₹{booking.totalAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">
                  {calculateNights(booking.checkIn, booking.checkOut)} nights, {booking.guests} guests
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-gray-50">
        <Button
          variant="outline"
          onClick={() => window.open(`mailto:support@illamnilgiris.com?subject=Booking%20${booking.id}`)}
        >
          Contact Support
        </Button>
        <Button onClick={() => window.open(`/bookings/${booking.id}`)}>View Details</Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-gray-600 mb-6">Browse our properties to make a booking</p>
      <Link href="/properties">
        <Button>Browse Properties</Button>
      </Link>
    </div>
  )
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
