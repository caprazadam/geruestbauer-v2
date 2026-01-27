import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gerüstbauer Verzeichnis Deutschland",
  description:
    "Finden Sie qualifizierte Gerüstbau-Unternehmen in Ihrer Region - Professionelle Gerüstbauer mit Bewertungen und Referenzen",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-gray-200 text-black min-h-screen flex flex-col`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
