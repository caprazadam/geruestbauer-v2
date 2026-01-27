"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Upload, Minus } from "lucide-react"

export default function CreatePropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    maxGuests: "2",
    checkIn: "14:00",
    checkOut: "11:00",
    amenities: [] as string[],
    images: [] as File[],
  })

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Check if user is authenticated and is an owner
  if (!user) {
    return null // This will be handled by the AuthProvider redirect
  }

  if (user.role !== "owner") {
    router.push("/dashboard")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenityChange = (amenity: string) => {
    setFormData((prev) => {
      const amenities = [...prev.amenities]
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter((a) => a !== amenity) }
      } else {
        return { ...prev, amenities: [...amenities, amenity] }
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5), // Limit to 5 images
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your property",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // This would be replaced with an actual API call to create the property
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Property created",
        description: "Your property has been successfully listed",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create property:", error)
      toast({
        title: "Failed to create property",
        description: "An error occurred while creating your property listing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List Your Property</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the basic details about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Luxury Villa with Mountain View"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property, its surroundings, and what makes it special"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Ooty, Nilgiris"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide more details about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleSelectChange("bedrooms", value)}>
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={formData.bathrooms}
                      onValueChange={(value) => handleSelectChange("bathrooms", value)}
                    >
                      <SelectTrigger id="bathrooms">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGuests">Max Guests</Label>
                    <Select
                      value={formData.maxGuests}
                      onValueChange={(value) => handleSelectChange("maxGuests", value)}
                    >
                      <SelectTrigger id="maxGuests">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in Time</Label>
                    <Input id="checkIn" name="checkIn" type="time" value={formData.checkIn} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out Time</Label>
                    <Input
                      id="checkOut"
                      name="checkOut"
                      type="time"
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wifi"
                        checked={formData.amenities.includes("wifi")}
                        onCheckedChange={() => handleAmenityChange("wifi")}
                      />
                      <label htmlFor="wifi" className="text-sm">
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking"
                        checked={formData.amenities.includes("parking")}
                        onCheckedChange={() => handleAmenityChange("parking")}
                      />
                      <label htmlFor="parking" className="text-sm">
                        Parking
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="breakfast"
                        checked={formData.amenities.includes("breakfast")}
                        onCheckedChange={() => handleAmenityChange("breakfast")}
                      />
                      <label htmlFor="breakfast" className="text-sm">
                        Breakfast
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tv"
                        checked={formData.amenities.includes("tv")}
                        onCheckedChange={() => handleAmenityChange("tv")}
                      />
                      <label htmlFor="tv" className="text-sm">
                        TV
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ac"
                        checked={formData.amenities.includes("ac")}
                        onCheckedChange={() => handleAmenityChange("ac")}
                      />
                      <label htmlFor="ac" className="text-sm">
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kitchen"
                        checked={formData.amenities.includes("kitchen")}
                        onCheckedChange={() => handleAmenityChange("kitchen")}
                      />
                      <label htmlFor="kitchen" className="text-sm">
                        Kitchen
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>Upload images of your property (up to 5 images)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 5 && (
                    <label className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      <Upload className="h-8 w-8 mb-2 text-gray-500" />
                      <span className="text-sm text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        multiple={formData.images.length === 0}
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  * First image will be used as the main image for your property listing
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Listing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Property Type</h3>
                  <p>Vacation Rental</p>
                </div>

                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{formData.location || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Price per Night</h3>
                  <p>{formData.price ? `₹${Number.parseInt(formData.price).toLocaleString()}` : "Not specified"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Property Size</h3>
                  <p>
                    {formData.bedrooms} bedroom(s), {formData.bathrooms} bathroom(s)
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Max Guests</h3>
                  <p>{formData.maxGuests} guest(s)</p>
                </div>

                <div>
                  <h3 className="font-medium">Check-in / Check-out</h3>
                  <p>
                    {formData.checkIn} / {formData.checkOut}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Amenities</h3>
                  {formData.amenities.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {formData.amenities.map((amenity) => (
                        <li key={amenity} className="capitalize">
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No amenities selected</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Images</h3>
                  <p>{formData.images.length} of 5 uploaded</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
