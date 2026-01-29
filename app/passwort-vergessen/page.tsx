"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "E-Mail erforderlich",
        description: "Bitte geben Sie Ihre E-Mail-Adresse ein",
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

      if (response.ok) {
        setEmailSent(true)
        toast({
          title: "E-Mail gesendet",
          description: "Prüfen Sie Ihren Posteingang für den Anmeldecode.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Fehler",
          description: data.error || "Die E-Mail konnte nicht gesendet werden.",
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

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-full max-w-md">
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Anmeldung
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Passwort vergessen?</CardTitle>
            <CardDescription>
              {!emailSent 
                ? "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Anmeldecode."
                : "Prüfen Sie Ihren Posteingang"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <span>Wir senden Ihnen einen Anmeldecode per E-Mail.</span>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Wird gesendet..." : "Code anfordern"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-600 mb-2">
                    Wir haben einen Anmeldecode an <strong>{email}</strong> gesendet.
                  </p>
                  <p className="text-sm text-slate-500">
                    Nutzen Sie diesen Code auf der Anmeldeseite, um sich anzumelden.
                  </p>
                </div>
                <Link href="/auth/signin">
                  <Button className="w-full">
                    Zur Anmeldung
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
          {!emailSent && (
            <CardFooter className="flex justify-center">
              <p className="text-sm text-slate-500">
                Erinnern Sie sich an Ihr Konto?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Anmelden
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
