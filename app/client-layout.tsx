"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import DynamicSeo from "@/components/dynamic-seo"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <DynamicSeo />
        {!isAdminPage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isAdminPage && <Footer />}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}
