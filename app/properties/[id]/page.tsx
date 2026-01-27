"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Star, Wifi, Car, Coffee, Tv, Users, Bed, Bath, Home, Clock } from "lucide-react"

type Property = {
  id: string
  title: string
  description: string
  location: string
  price: number
  rating: number
  images: string[]
  amenities: string[]
  maxGuests: number
  bedrooms: number
  bathrooms: number
  checkIn: string
  checkOut: string
  owner: {
    name: string
    responseRate: number
    responseTime: string
  }
}

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [nights, setNights] = useState(1)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const propertyId = params?.id as string

  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view property details",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    // This would be replaced with an actual API call
    const fetchProperty = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockProperty: Property = {
        id: propertyId,
        title: "Luxury Villa with Mountain View",
        description:
          "Experience the beauty of Nilgiris from this luxurious villa nestled in the mountains. The property offers breathtaking views, modern amenities, and a peaceful environment. Perfect for families and groups looking for a relaxing getaway in the hills.\n\nThe villa features spacious rooms, a fully equipped kitchen, and a beautiful garden where you can enjoy your morning tea while taking in the scenic beauty of the surroundings. The interiors are tastefully decorated with a blend of modern and traditional elements.",
        location: "Ooty, Nilgiris",
        price: 12000,
        rating: 4.8,
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        amenities: ["wifi", "parking", "breakfast", "tv"],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        owner: {
          name: "Property Manager",
          responseRate: 98,
          responseTime: "within an hour",
        },
      }

      setProperty(mockProperty)
      setSelectedImage(mockProperty.images[0])
      setLoading(false)
    }

    fetchProperty()
  }, [propertyId, router, toast, user])

  const handleBookNow = () => {
    if (!selectedDate) {
      toast({
        title: "Select date",
        description: "Please select a check-in date",
        variant: "destructive",
      })
      return
    }

    router.push(`/bookings/new?propertyId=${propertyId}&date=${selectedDate.toISOString()}&nights=${nights}`)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi size={20} />
      case "parking":
        return <Car size={20} />
      case "breakfast":
        return <Coffee size={20} />
      case "tv":
        return <Tv size={20} />
      default:
        return null
    }
  }

  const calculateTotal = () => {
    if (!property) return 0
    const subtotal = property.price * nights
    const serviceCharge = subtotal * 0.05 // 5% service charge
    return subtotal + serviceCharge
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-[400px] w-full" />
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-20 flex-shrink-0" />
              ))}
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <p className="mb-6">The property you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/properties")}>Browse Properties</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <MapPin size={18} className="mr-1" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center">
                <Star size={18} className="text-yellow-500 mr-1" />
                <span>{property.rating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image src={selectedImage || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === image ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <Users size={24} className="mb-2" />
                  <span className="text-sm text-gray-600">Max Guests</span>
                  <span className="font-semibold">{property.maxGuests}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <Bed size={24} className="mb-2" />
                  <span className="text-sm text-gray-600">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <Bath size={24} className="mb-2" />
                  <span className="text-sm text-gray-600">Bathrooms</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <Home size={24} className="mb-2" />
                  <span className="text-sm text-gray-600">Property Type</span>
                  <span className="font-semibold">Villa</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                    {getAmenityIcon(amenity)}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                  <Clock size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{property.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                  <Clock size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{property.checkOut}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Cancellation Policy</h3>
                <p className="text-gray-700">
                  Free cancellation up to 7 days before check-in. Cancel within 7 days of check-in and get a 50% refund.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">House Rules</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>No smoking</li>
                  <li>No parties or events</li>
                  <li>Pets not allowed</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold">₹{property.price.toLocaleString()}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-500 mr-1" />
                  <span>{property.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Number of Nights</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNights((prev) => Math.max(1, prev - 1))}
                      disabled={nights <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-4 font-medium">{nights}</span>
                    <Button variant="outline" size="icon" onClick={() => setNights((prev) => prev + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>
                    ₹{property.price.toLocaleString()} x {nights} nights
                  </span>
                  <span>₹{(property.price * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service charge (5%)</span>
                  <span>₹{Math.round(property.price * nights * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>

              <div className="text-center text-sm text-gray-600">You won't be charged yet</div>

              <div className="border-t pt-4">
                <div className="flex items-start gap-2">
                  <div className="bg-gray-200 rounded-full p-2">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Managed by {property.owner.name}</p>
                    <p className="text-sm text-gray-600">Response rate: {property.owner.responseRate}%</p>
                    <p className="text-sm text-gray-600">Responds {property.owner.responseTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
