"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Save, Globe, Shield, Mail, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Gerüstbauer-Verzeichnis",
    siteEmail: "info@geruestbauer-verzeichnis.de",
    itemsPerPage: "12",
    allowRegistration: true,
    maintenanceMode: false,
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem("admin_settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Fehler beim Laden der Einstellungen", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("admin_settings", JSON.stringify(settings))
    toast.success("Einstellungen erfolgreich gespeichert")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Einstellungen</h1>
            <p className="text-slate-600 mt-1">Verwalten Sie Ihre Website-Konfiguration</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white border p-1 rounded-xl mb-6">
            <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Globe className="h-4 w-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Shield className="h-4 w-4 mr-2" />
              Sicherheit
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Bell className="h-4 w-4 mr-2" />
              Benachrichtigungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
                <CardDescription>Grundlegende Informationen Ihrer Website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Name der Website</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siteEmail">Kontakt E-Mail</Label>
                  <Input
                    id="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="itemsPerPage">Einträge pro Seite (Suche)</Label>
                  <Input
                    id="itemsPerPage"
                    type="number"
                    value={settings.itemsPerPage}
                    onChange={(e) => setSettings({ ...settings, itemsPerPage: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Sicherheitseinstellungen</CardTitle>
                <CardDescription>Zugriffskontrolle und Sicherheitsoptionen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Benutzerregistrierung</Label>
                    <p className="text-sm text-slate-500 font-medium">Neuen Firmen erlauben, sich selbst zu registrieren.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                    className="h-6 w-6 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl bg-red-50/50 border-red-100">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-red-900">Wartungsmodus</Label>
                    <p className="text-sm text-red-600 font-medium">Die Website für alle Besucher außer Administratoren sperren.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="h-6 w-6 rounded border-red-300 text-red-600 focus:ring-red-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>E-Mail Benachrichtigungen</CardTitle>
                <CardDescription>Wann möchten Sie informiert werden?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center py-12">
                <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">E-Mail-Server Integration steht in Kürze zur Verfügung.</p>
                <Button variant="outline" disabled className="mt-2 rounded-xl">SMTP konfigurieren</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
