"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Calendar, Clock } from "lucide-react"

type Property = {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  checkIn: string
  checkOut: string
}

export default function NewBookingPage() {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi")
  const [upiId, setUpiId] = useState("")
  const [accountDetails, setAccountDetails] = useState({
    name: "",
    accountNumber: "",
    ifsc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const propertyId = searchParams?.get("propertyId")
  const dateParam = searchParams?.get("date")
  const nightsParam = searchParams?.get("nights")

  const checkInDate = dateParam ? new Date(dateParam) : new Date()
  const nights = nightsParam ? Number.parseInt(nightsParam) : 1

  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + nights)

  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a property",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    if (!propertyId || !dateParam || !nightsParam) {
      toast({
        title: "Invalid booking",
        description: "Missing required booking information",
        variant: "destructive",
      })
      router.push("/properties")
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
        location: "Ooty, Nilgiris",
        price: 12000,
        imageUrl: "/luxury-villa-mountain.jpg",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
      }

      setProperty(mockProperty)
      setLoading(false)
    }

    fetchProperty()
  }, [propertyId, dateParam, nightsParam, router, toast, user])

  const calculateSubtotal = () => {
    if (!property) return 0
    return property.price * nights
  }

  const calculateServiceCharge = () => {
    return calculateSubtotal() * 0.05 // 5% service charge
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateServiceCharge()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "upi" && !upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter your UPI ID",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "bank" && (!accountDetails.name || !accountDetails.accountNumber || !accountDetails.ifsc)) {
      toast({
        title: "Bank details required",
        description: "Please enter all bank account details",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Booking successful!",
      description: "Your booking has been confirmed. Check your email for details.",
    })

    router.push("/bookings")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <p className="mb-6">The property you are trying to book does not exist or has been removed.</p>
        <Button onClick={() => router.push("/properties")}>Browse Properties</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={(value: "upi" | "bank") => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "upi" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm">
                        You will be redirected to your UPI app to complete the payment of ₹
                        {calculateTotal().toLocaleString()}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Holder Name</Label>
                      <Input
                        id="account-name"
                        placeholder="Enter account holder name"
                        value={accountDetails.name}
                        onChange={(e) => setAccountDetails({ ...accountDetails, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        placeholder="Enter account number"
                        value={accountDetails.accountNumber}
                        onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        placeholder="Enter IFSC code"
                        value={accountDetails.ifsc}
                        onChange={(e) => setAccountDetails({ ...accountDetails, ifsc: e.target.value })}
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm">
                        Please transfer ₹{calculateTotal().toLocaleString()} to the following account:
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Account Name:</strong> Illam at Nilgiris 24/7
                        <br />
                        <strong>Account Number:</strong> XXXXXXXXXXXX
                        <br />
                        <strong>IFSC Code:</strong> XXXXXXXX
                        <br />
                        <strong>Bank:</strong> Example Bank
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={property.imageUrl || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar size={18} className="mt-0.5" />
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-sm">
                      {formatDate(checkInDate)} - {formatDate(checkOutDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {nights} night{nights > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={18} className="mt-0.5" />
                  <div>
                    <p className="font-medium">Check-in / Check-out</p>
                    <p className="text-sm">
                      {property.checkIn} / {property.checkOut}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    ₹{property.price.toLocaleString()} x {nights} nights
                  </span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service charge (5%)</span>
                  <span>₹{calculateServiceCharge().toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 text-sm text-gray-600">
              <p>By proceeding with this booking, you agree to our terms and conditions and cancellation policy.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
