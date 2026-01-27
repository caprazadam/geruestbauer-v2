"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { User, Mail, Phone, Shield, Loader2, Bell } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    otpMethod: "email" as "email" | "phone",
  })
  const [phoneError, setPhoneError] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentOtp: "",
    newPassword: "",
    confirmPassword: "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um auf Ihr Profil zuzugreifen",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        otpMethod: user.otpMethod || "email",
      })
    }
  }, [user, authLoading, router, toast])

  const validatePhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/[\s-]/g, "")
    const phoneRegex = /^(\+49|0)[1-9][0-9]{8,15}$/

    if (!phoneRegex.test(cleanPhone)) {
      return "Bitte geben Sie eine gültige Telefonnummer ein"
    }

    return ""
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      setPhoneError(validatePhone(value))
    }

    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOtpMethodChange = (value: "email" | "phone") => {
    setProfileData((prev) => ({ ...prev, otpMethod: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileData.name || !profileData.email || !profileData.phone) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus",
        variant: "destructive",
      })
      return
    }

    if (phoneError) {
      toast({
        title: "Ungültige Telefonnummer",
        description: phoneError,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (user) {
        const updatedUser = {
          ...user,
          name: profileData.name,
          phone: profileData.phone,
          otpMethod: profileData.otpMethod,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      toast({
        title: "Profil aktualisiert",
        description: "Ihr Profil wurde erfolgreich aktualisiert",
      })
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profils:", error)
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordData.currentOtp || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Die Passwörter müssen identisch sein",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert",
      })

      setPasswordData({
        currentOtp: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Passworts:", error)
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-40 mb-8" />
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mein Profil</h1>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil-Info</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil-Informationen</CardTitle>
                <CardDescription>Aktualisieren Sie Ihre persönlichen Daten</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User size={16} />
                      Vollständiger Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Ihr Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={16} />
                      E-Mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Ihre E-Mail"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={16} />
                      Telefonnummer
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+49 123 456789"
                    />
                    {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading || !!phoneError}>
                    {isLoading ? "Wird gespeichert..." : "Änderungen speichern"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
                <CardDescription>Verwalten Sie Ihre Einstellungen</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bell size={16} />
                      OTP-Zustellung
                    </Label>
                    <RadioGroup value={profileData.otpMethod} onValueChange={handleOtpMethodChange}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="email" id="email-otp" />
                        <Label htmlFor="email-otp">E-Mail ({profileData.email})</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone-otp" disabled={!profileData.phone || !!phoneError} />
                        <Label htmlFor="phone-otp">SMS ({profileData.phone || "Keine Nummer hinterlegt"})</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Wird gespeichert..." : "Einstellungen speichern"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sicherheit</CardTitle>
                <CardDescription>Passwort ändern</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentOtp" className="flex items-center gap-2">
                      <Shield size={16} />
                      Aktuelles OTP
                    </Label>
                    <Input
                      id="currentOtp"
                      name="currentOtp"
                      type="text"
                      value={passwordData.currentOtp}
                      onChange={handlePasswordChange}
                      placeholder="Geben Sie das erhaltene OTP ein"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Neues Passwort eingeben"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Passwort erneut eingeben"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
