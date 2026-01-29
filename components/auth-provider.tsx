"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "owner" | "admin"
  otpMethod: "email" | "phone"
  isVerified?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (identifier: string, otp: string, identifierType: "email" | "phone") => Promise<void>
  signUp: (userData: Partial<User>, otp: string) => Promise<void>
  signOut: () => void
  requestOtp: (identifier: string, method: "email" | "phone", phone?: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingUserData, setPendingUserData] = useState<Partial<User> | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentifizierungsprüfung fehlgeschlagen:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const protectedPaths = ["/dashboard", "/properties/create", "/bookings", "/profile"]

      const isProtectedPath = protectedPaths.some((path) => pathname?.startsWith(path))

      if (isProtectedPath && !user) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um auf diese Seite zuzugreifen",
          variant: "destructive",
        })
        router.push("/auth/signin")
      }

      if ((pathname === "/auth/signin" || pathname === "/auth/signup") && user) {
        router.push("/dashboard")
      }
    }
  }, [pathname, user, isLoading, router, toast])

  const requestOtp = async (identifier: string, method: "email" | "phone", phone?: string) => {
    setIsLoading(true)
    try {
      if (method === "email") {
        const response = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: identifier, 
            name: pendingUserData?.name || "Nutzer" 
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Fehler beim Senden des Codes")
        }

        toast({
          title: "Verifizierungscode gesendet",
          description: `Ein Code wurde an ${identifier} gesendet. Der Code ist 10 Minuten gültig.`,
        })
      } else {
        toast({
          title: "SMS nicht verfügbar",
          description: "SMS-Verifizierung ist derzeit nicht verfügbar. Bitte verwenden Sie E-Mail.",
          variant: "destructive",
        })
        throw new Error("SMS nicht verfügbar")
      }

      return Promise.resolve()
    } catch (error: any) {
      console.error("OTP-Anfrage fehlgeschlagen:", error)
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Der Code konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        return true
      } else {
        toast({
          title: "Ungültiger Code",
          description: data.error || "Der eingegebene Code ist ungültig oder abgelaufen.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("OTP-Verifizierung fehlgeschlagen:", error)
      toast({
        title: "Verifizierung fehlgeschlagen",
        description: "Es gab einen Fehler bei der Verifizierung. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
      return false
    }
  }

  const signIn = async (identifier: string, otp: string, identifierType: "email" | "phone") => {
    setIsLoading(true)
    try {
      if (identifierType === "email") {
        const verified = await verifyOtp(identifier, otp)
        if (!verified) {
          setIsLoading(false)
          return
        }
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const existingUser = existingUsers.find((u: User) => u.email === identifier)

      if (existingUser) {
        existingUser.isVerified = true
        setUser(existingUser)
        localStorage.setItem("user", JSON.stringify(existingUser))
      } else {
        const mockUser: User = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          name: "Nutzer",
          email: identifierType === "email" ? identifier : "",
          phone: identifierType === "phone" ? identifier : "",
          role: "customer",
          otpMethod: identifierType,
          isVerified: true
        }
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
      }

      toast({
        title: "Willkommen zurück!",
        description: "Sie haben sich erfolgreich angemeldet.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Anmeldung fehlgeschlagen:", error)
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Ungültiger Code. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: Partial<User>, otp: string) => {
    setIsLoading(true)
    try {
      const verified = await verifyOtp(userData.email || "", otp)
      if (!verified) {
        setIsLoading(false)
        return
      }

      const newUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: userData.name || "Neuer Nutzer",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "customer",
        otpMethod: userData.otpMethod || "email",
        isVerified: true
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      existingUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      toast({
        title: "Konto erstellt",
        description: "Ihr Konto wurde erfolgreich erstellt.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error)
      toast({
        title: "Registrierung fehlgeschlagen",
        description: "Ungültiger Code oder ungültige Daten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    })
    router.push("/")
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    requestOtp,
    verifyOtp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
