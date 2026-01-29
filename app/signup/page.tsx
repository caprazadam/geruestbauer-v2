"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createUser, setCurrentUser } from "@/lib/user-storage"
import { Mail, Lock, User, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react"

type Step = "form" | "verify"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("form")
  const [otpCode, setOtpCode] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Die Passwörter stimmen nicht überein")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Das Passwort muss mindestens 6 Zeichen lang sein")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Verifizierungscode wurde an Ihre E-Mail gesendet")
        setStep("verify")
      } else {
        toast.error(data.error || "Fehler beim Senden des Codes")
      }
    } catch (error) {
      toast.error("Verbindungsfehler. Bitte versuchen Sie es erneut.")
    }
    
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otpCode.length !== 6) {
      toast.error("Bitte geben Sie den 6-stelligen Code ein")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpCode })
      })
      
      const data = await response.json()
      
      if (response.ok && data.verified) {
        // Create user after verification
        const newUser = createUser(formData.email, formData.password, formData.name)
        
        if (newUser) {
          newUser.isVerified = true
          setCurrentUser(newUser)
          toast.success("Registrierung erfolgreich! Willkommen bei Gerüstbauer24")
          router.push("/")
        } else {
          toast.error("Diese E-Mail-Adresse ist bereits registriert")
        }
      } else {
        toast.error(data.error || "Ungültiger Code")
      }
    } catch (error) {
      toast.error("Verbindungsfehler. Bitte versuchen Sie es erneut.")
    }
    
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      })
      
      if (response.ok) {
        toast.success("Neuer Verifizierungscode wurde gesendet")
      } else {
        const data = await response.json()
        toast.error(data.error || "Fehler beim Senden des Codes")
      }
    } catch (error) {
      toast.error("Verbindungsfehler")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-slate-900">Gerüstbauer<span className="text-blue-600">24</span></h1>
          </Link>
          <p className="text-slate-500 mt-2">Das Verzeichnis für Gerüstbau-Profis</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">
              {step === "form" ? "Konto erstellen" : "E-Mail bestätigen"}
            </CardTitle>
            <CardDescription>
              {step === "form" 
                ? "Registrieren Sie sich kostenlos mit Ihrer E-Mail" 
                : `Wir haben einen Code an ${formData.email} gesendet`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {step === "form" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vollständiger Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Max Mustermann"
                      required
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre@email.de"
                      required
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mindestens 6 Zeichen"
                      required
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Passwort wiederholen"
                      required
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? "Wird gesendet..." : (
                    <>
                      Weiter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verifizierungscode</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="6-stelliger Code"
                    required
                    className="text-center text-2xl tracking-widest h-14"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? "Wird verifiziert..." : (
                    <>
                      Bestätigen & Registrieren
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Code erneut senden
                  </button>
                </div>
              </form>
            )}

            {step === "form" && (
              <>
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Vorteile</span>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Kostenlose Firmenprofile erstellen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Direkte Kundenanfragen erhalten</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Bewertungen sammeln & präsentieren</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-600 mt-6">
                  Bereits registriert?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                    Jetzt anmelden
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          Mit der Registrierung akzeptieren Sie unsere{" "}
          <Link href="/agb" className="underline hover:text-slate-600">AGB</Link>
          {" "}und{" "}
          <Link href="/datenschutz" className="underline hover:text-slate-600">Datenschutzerklärung</Link>
        </p>
      </div>
    </div>
  )
}
