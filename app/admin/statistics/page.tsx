"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllStoredCompanies } from "@/lib/company-storage"
import { companies as mockCompanies } from "@/lib/company-data"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { Building2, Users, Star, TrendingUp, MapPin, Activity } from "lucide-react"

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [cityData, setCityData] = useState<any[]>([])
  const [serviceData, setServiceData] = useState<any[]>([])

  useEffect(() => {
    const stored = getAllStoredCompanies()
    const allCompanies = [...stored, ...mockCompanies]
    
    // Berechne Statistiken
    const totalCompanies = allCompanies.length
    const totalReviews = allCompanies.reduce((acc, c) => acc + (c.reviewCount || 0), 0)
    const avgRating = (allCompanies.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCompanies).toFixed(1)
    
    // Daten nach Städten
    const cities: Record<string, number> = {}
    allCompanies.forEach(c => {
      const city = c.city || "Unbekannt"
      cities[city] = (cities[city] || 0) + 1
    })
    const formattedCityData = Object.entries(cities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Daten nach Leistungen
    const services: Record<string, number> = {}
    allCompanies.forEach(c => {
      c.services?.forEach(s => {
        services[s] = (services[s] || 0) + 1
      })
    })
    const formattedServiceData = Object.entries(services)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    setStats({
      totalCompanies,
      totalReviews,
      avgRating,
      activeUsers: "1.234" // Mocked for now
    })
    setCityData(formattedCityData)
    setServiceData(formattedServiceData)
  }, [])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

  if (!stats) return null

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Statistiken & Analysen</h1>
          <p className="text-slate-500 mt-1 text-lg font-medium">Echtzeit-Auswertung Ihres Verzeichnisses</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Firmen</CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalCompanies}</div>
              <p className="text-xs text-blue-600 font-bold mt-1.5">+3 heute</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-600"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Benutzer</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{stats.activeUsers}</div>
              <p className="text-xs text-green-600 font-bold mt-1.5">+12% aktiv</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bewertungen</CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalReviews}</div>
              <p className="text-xs text-yellow-600 font-bold mt-1.5">∅ {stats.avgRating} Sterne</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Wachstum</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">+18%</div>
              <p className="text-xs text-purple-600 font-bold mt-1.5">vs. Vormonat</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Firmen nach Städten Chart */}
          <Card className="border-none shadow-sm bg-white p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="h-5 w-5 text-blue-600" />
                Firmen nach Städten
              </CardTitle>
              <CardDescription className="text-slate-400">Verteilung der Top 5 Standorte</CardDescription>
            </CardHeader>
            <CardContent className="px-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leistungsverteilung Chart */}
          <Card className="border-none shadow-sm bg-white p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Activity className="h-5 w-5 text-green-600" />
                Leistungsverteilung
              </CardTitle>
              <CardDescription className="text-slate-400">Häufigkeit der angebotenen Services</CardDescription>
            </CardHeader>
            <CardContent className="px-0 h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 ml-4">
                {serviceData.slice(0, 6).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aktivitätshistorie (Area Chart) */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-white p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Anfragen-Historie
              </CardTitle>
              <CardDescription className="text-slate-400">Verlauf der Kundenanfragen über die letzten 7 Tage</CardDescription>
            </CardHeader>
            <CardContent className="px-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { day: 'Mo', value: 45 },
                  { day: 'Di', value: 52 },
                  { day: 'Mi', value: 38 },
                  { day: 'Do', value: 65 },
                  { day: 'Fr', value: 48 },
                  { day: 'Sa', value: 24 },
                  { day: 'So', value: 32 },
                ]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
