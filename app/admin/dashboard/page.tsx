"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Star, TrendingUp, BarChart3, Settings, ShieldCheck, Database, LayoutDashboard, Search, Plus } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { getAllStoredCompanies } from "@/lib/company-storage"
import { companies as mockCompanies } from "@/lib/company-data"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (!user) {
      router.push("/admin/login")
      return
    }
    setAdminUser(JSON.parse(user))

    // Real-time stats calculation
    const stored = getAllStoredCompanies()
    const allCompanies = [...stored, ...mockCompanies]
    
    const totalCompanies = allCompanies.length
    const totalReviews = allCompanies.reduce((acc, c) => acc + (c.reviewCount || 0), 0)
    const avgRating = totalCompanies > 0 ? (allCompanies.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCompanies).toFixed(1) : "0.0"

    setDashboardStats({
      totalCompanies,
      totalReviews,
      avgRating,
      activeUsers: "1.234",
      recentActivities: allCompanies.slice(0, 4).map(c => ({
        company: c.name,
        action: "Firma im System aktiv",
        time: "Aktualisiert"
      }))
    })
  }, [router])

  if (!adminUser || !dashboardStats) {
    return null
  }

  const stats = [
    {
      title: "Firmen gesamt",
      value: dashboardStats.totalCompanies.toString(),
      change: "+12%",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Aktive Benutzer",
      value: dashboardStats.activeUsers,
      change: "+23%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Bewertungen",
      value: dashboardStats.totalReviews.toString(),
      change: `∅ ${dashboardStats.avgRating}`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Monatl. Anfragen",
      value: "3,456",
      change: "+18%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin-Dashboard</h1>
            <p className="text-slate-500 mt-1 text-lg">Willkommen zurück, {adminUser.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              System Online
            </span>
            <Button onClick={() => router.push("/admin/companies")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Firma hinzufügen
            </Button>
          </div>
        </div>

        {/* Statistiken */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</CardTitle>
                  <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs font-bold text-green-600 px-1.5 py-0.5 bg-green-50 rounded-md">{stat.change}</span>
                    <span className="text-xs text-slate-400">Status</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Letzte Aktivitäten */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-white">
            <CardHeader className="border-b border-slate-50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Letzte Aktivitäten
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">Überblick der systemweiten Änderungen</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold" onClick={() => router.push("/admin/companies")}>
                  Alle anzeigen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {dashboardStats.recentActivities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0 group cursor-default">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      <Building2 className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{activity.company}</p>
                        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{activity.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schnellzugriff */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <Settings className="h-5 w-5 text-blue-600" />
                Administration
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">System-Tools & Verwaltung</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <button
                  onClick={() => router.push("/admin/companies")}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left"
                >
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">Firmen verwalten</p>
                    <p className="text-sm text-slate-500 font-medium">Listen, Importe & Export</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/admin/users")}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-green-50/40 transition-all text-left"
                >
                  <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">Benutzer verwalten</p>
                    <p className="text-sm text-slate-500 font-medium">Profile & Berechtigungen</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/admin/reviews")}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-yellow-200 hover:bg-yellow-50/40 transition-all text-left"
                >
                  <div className="p-3 bg-yellow-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">Bewertungen</p>
                    <p className="text-sm text-slate-500 font-medium">Prüfung & Moderation</p>
                  </div>
                </button>

                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => router.push("/")}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Zur Website-Vorschau
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">Öffnen</span>
                    </button>
                    <button
                      onClick={() => router.push("/admin/scraper")}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-slate-400" />
                        Scraper-Tools
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">System</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
