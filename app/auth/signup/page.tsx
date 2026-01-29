"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Mail, RefreshCw } from "lucide-react"

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"customer" | "owner">("customer")
  const [otp, setOtp] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const validatePhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/[\s-]/g, "")
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

    setIsLoading(true)

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Verifizierungscode gesendet",
          description: `Ein Code wurde an ${email} gesendet. Der Code ist 10 Minuten gültig.`,
        })
        setStep(2)
      } else {
        toast({
          title: "Fehler beim Senden",
          description: data.error || "Der Code konnte nicht gesendet werden.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Fehler beim Anfordern des OTP:", error)
      toast({
        title: "Verbindungsfehler",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      })

      if (response.ok) {
        toast({
          title: "Neuer Code gesendet",
          description: "Ein neuer Verifizierungscode wurde gesendet.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Fehler",
          description: data.error || "Der Code konnte nicht gesendet werden.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp) {
      toast({
        title: "Code erforderlich",
        description: "Bitte geben Sie den erhaltenen Verifizierungscode ein",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        const newUser = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          name,
          email,
          phone,
          role,
          otpMethod: "email",
          isVerified: true
        }

        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        existingUsers.push(newUser)
        localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))
        localStorage.setItem("user", JSON.stringify(newUser))

        toast({
          title: "Konto erstellt",
          description: "Ihr Konto wurde erfolgreich erstellt.",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Ungültiger Code",
          description: data.error || "Der eingegebene Code ist ungültig oder abgelaufen.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error)
      toast({
        title: "Fehler",
        description: "Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Konto erstellen</CardTitle>
          <CardDescription>
            {step === 1 
              ? "Registrieren Sie sich, um das Verzeichnis zu nutzen"
              : `Wir haben einen Code an ${email} gesendet`
            }
          </CardDescription>
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
                  E-Mail-Adresse
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

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>Ein Verifizierungscode wird an Ihre E-Mail-Adresse gesendet.</span>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !!phoneError}>
                {isLoading ? "Wird gesendet..." : "Weiter"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="block text-sm font-medium">
                  Verifizierungscode
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="6-stelliger Code"
                  className="text-center text-xl tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? "Wird verifiziert..." : "Konto erstellen"}
              </Button>
              <div className="flex items-center justify-between pt-2">
                <Button variant="link" onClick={() => setStep(1)} type="button" className="px-0">
                  Zurück
                </Button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Code erneut senden
                </button>
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
