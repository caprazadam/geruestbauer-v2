"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"customer" | "owner">("customer")
  const [otpMethod, setOtpMethod] = useState<"email" | "phone">("email")
  const [otp, setOtp] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const { signUp, requestOtp, isLoading } = useAuth()
  const { toast } = useToast()

  const validatePhone = (phoneNumber: string) => {
    // Remove spaces and dashes
    const cleanPhone = phoneNumber.replace(/[\s-]/g, "")

    // German phone number regex
    const phoneRegex = /^(\+49|0)[1-9][0-9]{8,15}$/

    if (!phoneRegex.test(cleanPhone)) {
      return "Bitte geben Sie eine gültige Telefonnummer ein"
    }

    return ""
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    setPhoneError(validatePhone(value))
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !name || !phone) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus",
        variant: "destructive",
      })
      return
    }

    const phoneValidationError = validatePhone(phone)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }

    try {
      await requestOtp(email, otpMethod, phone)
      setStep(2)
    } catch (error) {
      console.error("Fehler beim Anfordern des OTP:", error)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
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
      await signUp({ name, email, phone, role, otpMethod }, otp)
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Konto erstellen</CardTitle>
          <CardDescription>Registrieren Sie sich, um das Verzeichnis zu nutzen</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm font-medium">
                  Vollständiger Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ihr Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium">
                  E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="block text-sm font-medium">
                  Telefonnummer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+49 123 456789"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
                {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-medium">Kontotyp</Label>
                <RadioGroup value={role} onValueChange={(value: "customer" | "owner") => setRole(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer">Kunde (Suchender)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner">Firmeninhaber</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-medium">OTP-Zustellung</Label>
                <Select value={otpMethod} onValueChange={(value: "email" | "phone") => setOtpMethod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zustellmethode wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-Mail</SelectItem>
                    <SelectItem value="phone">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !!phoneError}>
                {isLoading ? "Wird verarbeitet..." : "Weiter"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="block text-sm font-medium">
                  OTP
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
                {isLoading ? "Wird erstellt..." : "Konto erstellen"}
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setStep(1)} type="button">
                  Zurück
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Bereits ein Konto?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Anmelden
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
