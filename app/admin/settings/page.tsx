"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Save, 
  Settings as SettingsIcon, 
  Shield, 
  Globe, 
  Mail, 
  Code, 
  Lock, 
  Search,
  CheckCircle2,
  CreditCard
} from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Stripe Settings
  const [stripeSettings, setStripeSettings] = useState({
    publicKey: "",
    secretKey: "",
    webhookSecret: "",
    isTestMode: true
  })

  // Site Metadata & SEO
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: "Gerüstbauer-Verzeichnis",
    siteDescription: "Finden Sie die besten Gerüstbauer in Ihrer Nähe.",
    keywords: "Gerüstbau, Gerüstmiete, Deutschland, Scaffolding",
    googleAnalyticsId: "G-XXXXXXXXXX",
    customHeadCode: ""
  })

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    contactEmail: "admin@geruestbauer-verzeichnis.de"
  })

  // Password Settings
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const savedSeo = localStorage.getItem("seoSettings")
    const savedGeneral = localStorage.getItem("generalSettings")
    const savedStripe = localStorage.getItem("stripeSettings")
    if (savedSeo) setSeoSettings(JSON.parse(savedSeo))
    if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral))
    if (savedStripe) setStripeSettings(JSON.parse(savedStripe))
  }, [])

  const handleSaveStripe = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("stripeSettings", JSON.stringify(stripeSettings))
      setLoading(false)
      toast({
        title: "Stripe-Einstellungen gespeichert",
        description: "Die API-Konfiguration wurde erfolgreich aktualisiert.",
      })
    }, 800)
  }

  const handleSaveSeo = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("seoSettings", JSON.stringify(seoSettings))
      setLoading(false)
      toast({
        title: "SEO-Einstellungen gespeichert",
        description: "Die Metadaten und der Analytics-Code wurden aktualisiert.",
      })
    }, 800)
  }

  const handleSaveGeneral = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("generalSettings", JSON.stringify(generalSettings))
      setLoading(false)
      toast({
        title: "Allgemeine Einstellungen gespeichert",
        description: "Ihre Änderungen wurden erfolgreich übernommen.",
      })
    }, 800)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die neuen Passwörter stimmen nicht überein.",
      })
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      // Robust retrieval of admin data
      const storedAdmin = localStorage.getItem("adminUser")
      let adminUser
      
      try {
        adminUser = storedAdmin ? JSON.parse(storedAdmin) : null
      } catch (e) {
        adminUser = null
      }

      // If for some reason it's still missing or malformed, fallback to default
      if (!adminUser || !adminUser.password) {
        adminUser = {
          email: "admin@admin.com",
          password: "admin123",
          name: "Administrator"
        }
        // Save it back to ensure it exists for next time
        localStorage.setItem("adminUser", JSON.stringify(adminUser))
      }
      
      if (adminUser.password === passwordSettings.currentPassword) {
        adminUser.password = passwordSettings.newPassword
        localStorage.setItem("adminUser", JSON.stringify(adminUser))
        setPasswordSettings({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast({
          title: "Passwort geändert",
          description: "Ihr Admin-Passwort wurde erfolgreich aktualisiert.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: `Das aktuelle Passwort ist falsch.`,
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System-Einstellungen</h1>
          <p className="text-slate-500 mt-1 text-lg">Konfigurieren Sie SEO, Analytik und Sicherheit</p>
        </div>

        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="seo" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe className="h-4 w-4 mr-2" />
              SEO & Metadata
            </TabsTrigger>
            <TabsTrigger value="general" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Sicherheit
            </TabsTrigger>
            <TabsTrigger value="payment" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Code className="h-4 w-4 mr-2" />
              Zahlung (Stripe)
            </TabsTrigger>
          </TabsList>

          {/* SEO & Analytics Content */}
          <TabsContent value="seo">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Suchmaschinen-Optimierung (SEO)
                </CardTitle>
                <CardDescription>Verwalten Sie Titel, Keywords und Tracking-Codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Website-Titel</Label>
                    <Input 
                      value={seoSettings.siteTitle}
                      onChange={(e) => setSeoSettings({...seoSettings, siteTitle: e.target.value})}
                      placeholder="z.B. Gerüstbauer-Verzeichnis Deutschland" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Analytics ID (GTAG)</Label>
                    <Input 
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) => setSeoSettings({...seoSettings, googleAnalyticsId: e.target.value})}
                      placeholder="G-XXXXXXXXXX" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Keywords (kommagetrennt)</Label>
                  <Input 
                    value={seoSettings.keywords}
                    onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
                    placeholder="Gerüstbau, Fassadengerüst, Rollgerüst..." 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Website-Beschreibung (Description Meta-Tag)</Label>
                  <Textarea 
                    value={seoSettings.siteDescription}
                    onChange={(e) => setSeoSettings({...seoSettings, siteDescription: e.target.value})}
                    placeholder="Beschreiben Sie Ihre Website für Suchergebnisse..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    Benutzerdefinierter Head-Code
                  </Label>
                  <Textarea 
                    value={seoSettings.customHeadCode}
                    onChange={(e) => setSeoSettings({...seoSettings, customHeadCode: e.target.value})}
                    placeholder="<script>...</script> oder <meta ... />"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSeo} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    SEO-Daten speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings Content */}
          <TabsContent value="general">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-green-600" />
                  Website-Konfiguration
                </CardTitle>
                <CardDescription>Grundlegende Funktionen und Kontaktmöglichkeiten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Wartungsmodus</Label>
                      <p className="text-sm text-slate-500">Website für Besucher vorübergehend sperren</p>
                    </div>
                    <Switch 
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(val: boolean) => setGeneralSettings({...generalSettings, maintenanceMode: val})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Benutzerregistrierung</Label>
                      <p className="text-sm text-slate-500">Besuchern erlauben, neue Konten zu erstellen</p>
                    </div>
                    <Switch 
                      checked={generalSettings.allowRegistration}
                      onCheckedChange={(val: boolean) => setGeneralSettings({...generalSettings, allowRegistration: val})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>System-Kontakt-Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-10"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveGeneral} disabled={loading} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Einstellungen speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Content */}
          <TabsContent value="security">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Admin-Sicherheit
                </CardTitle>
                <CardDescription>Aktualisieren Sie Ihre Zugangsberechtigungen</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label>Aktuelles Passwort</Label>
                    <Input 
                      type="password" 
                      required
                      value={passwordSettings.currentPassword}
                      onChange={(e) => setPasswordSettings({...passwordSettings, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Neues Passwort</Label>
                    <Input 
                      type="password" 
                      required
                      value={passwordSettings.newPassword}
                      onChange={(e) => setPasswordSettings({...passwordSettings, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Neues Passwort bestätigen</Label>
                    <Input 
                      type="password" 
                      required
                      value={passwordSettings.confirmPassword}
                      onChange={(e) => setPasswordSettings({...passwordSettings, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800">
                    Passwort jetzt ändern
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stripe Payment Content */}
          <TabsContent value="payment">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Stripe-Konfiguration
                </CardTitle>
                <CardDescription>Verwalten Sie Ihre Stripe API-Schlüssel für Zahlungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-blue-900">Testmodus</Label>
                    <p className="text-sm text-blue-600">Verwenden Sie Stripe-Testschlüssel (Sandbox)</p>
                  </div>
                  <Switch 
                    checked={stripeSettings.isTestMode}
                    onCheckedChange={(val: boolean) => setStripeSettings({...stripeSettings, isTestMode: val})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stripe Public Key (Veröffentlichbarer Schlüssel)</Label>
                  <Input 
                    value={stripeSettings.publicKey}
                    onChange={(e) => setStripeSettings({...stripeSettings, publicKey: e.target.value})}
                    placeholder="pk_test_..."
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stripe Secret Key (Geheimer Schlüssel)</Label>
                  <Input 
                    value={stripeSettings.secretKey}
                    onChange={(e) => setStripeSettings({...stripeSettings, secretKey: e.target.value})}
                    placeholder="sk_test_..."
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stripe Webhook Secret</Label>
                  <Input 
                    value={stripeSettings.webhookSecret}
                    onChange={(e) => setStripeSettings({...stripeSettings, webhookSecret: e.target.value})}
                    placeholder="whsec_..."
                    type="password"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm">
                  <p className="font-bold mb-1">Hinweis:</p>
                  <p>Bitte stellen Sie sicher, dass Ihre API-Schlüssel korrekt sind. Diese Schlüssel werden für die Abwicklung von Firmen-Abonnements und Zahlungen verwendet.</p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveStripe} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Stripe-Daten speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
