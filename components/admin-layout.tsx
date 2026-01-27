"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Database,
  Search,
  Globe,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (!user) {
      router.push("/admin/login")
      return
    }
    setAdminUser(JSON.parse(user))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "Firmen",
      icon: Building2,
      href: "/admin/companies",
    },
    {
      title: "Benutzer",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Bewertungen",
      icon: Star,
      href: "/admin/reviews",
    },
    {
      title: "Scraper",
      icon: Database,
      href: "/admin/scraper",
    },
    {
      title: "Statistiken",
      icon: BarChart3,
      href: "/admin/statistics",
    },
    {
      title: "Einstellungen",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  if (!adminUser) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Admin-Panel</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-50">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-blue-200 shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg leading-tight">Admin-Panel</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Scaffolding</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Hauptmenü</p>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
                    <span className="font-bold text-sm">{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
                </Link>
              )
            })}

            <div className="pt-8">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Extern</p>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all font-bold text-sm"
              >
                <Globe className="h-5 w-5 text-slate-400" />
                Zur Website
              </Link>
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {adminUser.name?.charAt(0) || "A"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 truncate">{adminUser.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{adminUser.role || "Administrator"}</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-2 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold text-xs h-10 transition-all rounded-xl"
              >
                <LogOut className="h-3.5 w-3.5" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  )
}
