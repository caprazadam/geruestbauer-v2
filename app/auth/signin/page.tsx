"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function SignIn() {
  const [identifier, setIdentifier] = useState("")
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const { signIn, requestOtp, isLoading } = useAuth()
  const { toast } = useToast()

  const validateIdentifier = () => {
    if (identifierType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(identifier)
    } else {
      const phoneRegex = /^(\+49|0)[1-9][0-9]{8,15}$/
      return phoneRegex.test(identifier.replace(/[\s-]/g, ""))
    }
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier) {
      toast({
        title: `${identifierType === "email" ? "E-Mail" : "Telefonnummer"} erforderlich`,
        description: `Bitte geben Sie Ihre ${identifierType === "email" ? "E-Mail-Adresse" : "Telefonnummer"} ein`,
        variant: "destructive",
      })
      return
    }

    if (!validateIdentifier()) {
      toast({
        title: `Ungültige ${identifierType === "email" ? "E-Mail" : "Telefonnummer"}`,
        description: "Bitte geben Sie korrekte Daten ein",
        variant: "destructive",
      })
      return
    }

    try {
      await requestOtp(identifier, identifierType)
      setOtpSent(true)
      toast({
        title: "OTP gesendet",
        description: `Ein Einmalpasswort wurde an Ihre ${identifierType === "email" ? "E-Mail-Adresse" : "Telefonnummer"} gesendet`,
      })
    } catch (error) {
      console.error("Fehler beim Anfordern des OTP:", error)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp) {
      toast({
        title: "OTP erforderlich",
        description: "Bitte geben Sie das erhaltene Einmalpasswort ein",
        variant: "destructive",
      })
      return
    }

    try {
      await signIn(identifier, otp, identifierType)
    } catch (error) {
      console.error("Anmeldung fehlgeschlagen:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>Melden Sie sich an, um auf Ihr Dashboard zuzugreifen</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifierType">Anmelden mit</Label>
                <Select value={identifierType} onValueChange={(value: "email" | "phone") => setIdentifierType(value)}>
                  <SelectTrigger id="identifierType">
                    <SelectValue placeholder="Anmeldemethode wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-Mail</SelectItem>
                    <SelectItem value="phone">Telefonnummer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">{identifierType === "email" ? "E-Mail-Adresse" : "Telefonnummer"}</Label>
                <Input
                  id="identifier"
                  type={identifierType === "email" ? "email" : "tel"}
                  placeholder={
                    identifierType === "email" ? "ihre@email.de" : "+49 123 456789"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird gesendet..." : "OTP anfordern"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="block text-sm font-medium">
                  Einmalpasswort (OTP)
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="OTP eingeben"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setOtpSent(false)} type="button">
                  {identifierType === "email" ? "E-Mail" : "Nummer"} ändern
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Noch kein Konto?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Registrieren
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
