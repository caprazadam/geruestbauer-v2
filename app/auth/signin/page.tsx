"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Mail, RefreshCw } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "E-Mail erforderlich",
        description: "Bitte geben Sie Ihre E-Mail-Adresse ein",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Nutzer" })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Verifizierungscode gesendet",
          description: `Ein Code wurde an ${email} gesendet. Der Code ist 10 Minuten gültig.`,
        })
        setOtpSent(true)
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
        body: JSON.stringify({ email, name: "Nutzer" })
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

  const handleSignIn = async (e: React.FormEvent) => {
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
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const existingUser = existingUsers.find((u: any) => u.email === email)

        if (existingUser) {
          existingUser.isVerified = true
          localStorage.setItem("user", JSON.stringify(existingUser))
        } else {
          const newUser = {
            id: "user-" + Math.random().toString(36).substring(2, 9),
            name: "Nutzer",
            email,
            phone: "",
            role: "customer",
            otpMethod: "email",
            isVerified: true
          }
          localStorage.setItem("user", JSON.stringify(newUser))
        }

        toast({
          title: "Willkommen zurück!",
          description: "Sie haben sich erfolgreich angemeldet.",
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
      console.error("Anmeldung fehlgeschlagen:", error)
      toast({
        title: "Fehler",
        description: "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
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
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>
            {!otpSent 
              ? "Melden Sie sich an, um auf Ihr Dashboard zuzugreifen"
              : `Wir haben einen Code an ${email} gesendet`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>Ein Verifizierungscode wird an Ihre E-Mail-Adresse gesendet.</span>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird gesendet..." : "Code anfordern"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
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
                {isLoading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
              <div className="flex items-center justify-between pt-2">
                <Button variant="link" onClick={() => setOtpSent(false)} type="button" className="px-0">
                  E-Mail ändern
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
