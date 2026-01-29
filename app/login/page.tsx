"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { authenticateUser, setCurrentUser } from "@/lib/user-storage"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = authenticateUser(formData.email, formData.password)
    
    if (user) {
      setCurrentUser(user)
      toast.success(`Willkommen zurück, ${user.name}!`)
      router.push("/")
    } else {
      toast.error("E-Mail oder Passwort ist falsch")
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
            <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
            <CardDescription>Melden Sie sich mit Ihrer E-Mail an</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Passwort</Label>
                  <Link href="/passwort-vergessen" className="text-xs text-blue-600 hover:underline">
                    Passwort vergessen?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ihr Passwort"
                    required
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Wird angemeldet..." : (
                  <>
                    Anmelden
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              Noch kein Konto?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
                Jetzt registrieren
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/admin/login" className="underline hover:text-slate-600">
            Administrator-Login
          </Link>
        </p>
      </div>
    </div>
  )
}
