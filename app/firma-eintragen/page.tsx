"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Check, Building2, Mail, Phone, MapPin, CreditCard, Shield, Star, Zap, Crown, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

type PlanType = "free" | "business" | "expert" | "premium"

const plans = [
  {
    id: "free" as PlanType,
    name: "Kostenlos",
    price: "0",
    period: "",
    description: "Ideal zum Testen",
    features: [
      "Basisprofil auf Gerüstbauer24",
      "Bis zu 2 Kundenanfragen/Jahr",
      "Kontaktdaten sichtbar",
      "Standard-Profilansicht"
    ],
    color: "slate",
    popular: false
  },
  {
    id: "business" as PlanType,
    name: "Business",
    price: "49",
    period: "/Monat",
    description: "Für wachsende Unternehmen",
    features: [
      "Alles aus Kostenlos, plus:",
      "Bis zu 10 Kundenanfragen/Monat",
      "Umkreis bis 50 km wählbar",
      "Bis zu 3 Bilder hochladen",
      "Bewertungsmanagement",
      "Werbefreies Profil"
    ],
    color: "slate",
    popular: false
  },
  {
    id: "expert" as PlanType,
    name: "Expert",
    price: "99",
    period: "/Monat",
    description: "Unsere Empfehlung",
    features: [
      "Alles aus Business, plus:",
      "Bis zu 25 Kundenanfragen/Monat",
      "Umkreis bis 100 km wählbar",
      "Bis zu 10 Bilder hochladen",
      "Ausführliches Firmenprofil",
      "50 Bewertungskarten/Jahr"
    ],
    color: "yellow",
    popular: true
  },
  {
    id: "premium" as PlanType,
    name: "Premium",
    price: "199",
    period: "/Monat",
    description: "Maximale Reichweite",
    features: [
      "Alles aus Expert, plus:",
      "Bis zu 100 Kundenanfragen/Monat",
      "Umkreis bis 200 km wählbar",
      "Unbegrenzt Bilder & Videos",
      "Premium-Platzierung",
      "Persönlicher Ansprechpartner"
    ],
    color: "slate",
    popular: false
  }
]

export default function FirmaEintragenPage() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    website: "",
    description: "",
    services: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlanSelect = (planId: PlanType) => {
    setSelectedPlan(planId)
    if (planId === "free") {
      setStep(2)
    } else {
      setStep(2)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName || !formData.email || !formData.phone) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus")
      return
    }

    if (selectedPlan === "free") {
      setIsProcessing(true)
      setTimeout(() => {
        toast.success("Ihre Firma wurde erfolgreich registriert!")
        setStep(4)
        setIsProcessing(false)
      }, 1500)
    } else {
      setStep(3)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    const stripeSettings = localStorage.getItem("stripeSettings")
    if (!stripeSettings) {
      toast.error("Zahlungssystem nicht konfiguriert. Bitte kontaktieren Sie den Administrator.")
      setIsProcessing(false)
      return
    }

    setTimeout(() => {
      toast.success("Zahlung erfolgreich! Ihre Mitgliedschaft ist jetzt aktiv.")
      setStep(4)
      setIsProcessing(false)
    }, 2000)
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-slate-900 text-white hover:bg-slate-800">Firma eintragen</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            In 3 Schritten zu mehr Aufträgen!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Wir vermitteln Ihnen Anfragen aus Ihrer Region, bequem und einfach direkt in Ihr Postfach.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: "Paket wählen" },
              { num: 2, label: "Firmendaten" },
              { num: 3, label: "Zahlung" }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                  step >= s.num 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.num ? "bg-slate-900" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div>
            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                    billingCycle === "monthly" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Monatlich
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    billingCycle === "yearly" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Jährlich
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs">-20%</Badge>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const price = billingCycle === "yearly" 
                  ? Math.round(parseInt(plan.price) * 0.8) 
                  : plan.price
                
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                      plan.popular ? "border-2 border-yellow-400 shadow-lg bg-gradient-to-b from-yellow-50/50 to-white" : "border-slate-200"
                    } ${selectedPlan === plan.id ? "ring-2 ring-slate-900" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Empfohlen
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                        plan.id === "free" ? "bg-slate-100" :
                        plan.id === "business" ? "bg-slate-100" :
                        plan.id === "expert" ? "bg-yellow-100" : "bg-slate-900"
                      }`}>
                        {plan.id === "free" && <Building2 className="h-6 w-6 text-slate-600" />}
                        {plan.id === "business" && <Zap className="h-6 w-6 text-slate-700" />}
                        {plan.id === "expert" && <Star className="h-6 w-6 text-yellow-600" />}
                        {plan.id === "premium" && <Crown className="h-6 w-6 text-yellow-400" />}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-slate-900">{price}€</span>
                        <span className="text-slate-500">{plan.period}</span>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className={`h-5 w-5 flex-shrink-0 ${
                              plan.id === "expert" ? "text-yellow-500" : "text-slate-500"
                            }`} />
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${
                          plan.id === "expert" 
                            ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900" 
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlanSelect(plan.id)
                        }}
                      >
                        {plan.id === "free" ? "Kostenlos starten" : "Auswählen"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            {/* Legal Notice */}
            <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
              Alle Preise verstehen sich zuzüglich 19% Umsatzsteuer. Die Vertragslaufzeit beläuft sich auf 12 Monate.
              Der Vertrag verlängert sich automatisch, sofern er nicht mindestens 3 Monate vor Ablauf gekündigt wird.
            </p>
          </div>
        )}

        {/* Step 2: Company Information */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-slate-700" />
                Firmendaten eingeben
              </CardTitle>
              <CardDescription>
                Bitte füllen Sie alle erforderlichen Felder aus, um Ihr Unternehmen zu registrieren.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Firmenname *</Label>
                    <Input 
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Mustermann Gerüstbau GmbH"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Ansprechpartner</Label>
                    <Input 
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="Max Mustermann"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="email"
                        type="email"
                        required
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="info@firma.de"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="phone"
                        type="tel"
                        required
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Straße und Hausnummer</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="address"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Musterstraße 123"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postleitzahl</Label>
                    <Input 
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Berlin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Webseite</Label>
                  <Input 
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://www.ihre-firma.de"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Firmenbeschreibung</Label>
                  <Textarea 
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Beschreiben Sie Ihr Unternehmen und Ihre Dienstleistungen..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    Zurück
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-slate-900 hover:bg-slate-800"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Wird verarbeitet..." : (
                      selectedPlan === "free" ? "Kostenlos registrieren" : "Weiter zur Zahlung"
                    )}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && selectedPlanData && (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-slate-700" />
                Zahlungsinformationen
              </CardTitle>
              <CardDescription>
                Schließen Sie Ihre {selectedPlanData.name}-Mitgliedschaft ab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gewähltes Paket:</span>
                  <Badge className={`${
                    selectedPlan === "expert" 
                      ? "bg-yellow-100 text-yellow-700" 
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {selectedPlanData.name}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Abrechnungszeitraum:</span>
                  <span>{billingCycle === "monthly" ? "Monatlich" : "Jährlich"}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Gesamt:</span>
                  <span className="font-bold text-2xl text-slate-900">
                    {billingCycle === "yearly" 
                      ? Math.round(parseInt(selectedPlanData.price) * 0.8 * 12)
                      : selectedPlanData.price
                    }€
                    <span className="text-sm font-normal text-slate-500">
                      {billingCycle === "yearly" ? "/Jahr" : "/Monat"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Stripe Payment Button */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Shield className="h-4 w-4" />
                  Sichere Zahlung über Stripe
                </div>
                
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Zahlung wird verarbeitet...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Jetzt bezahlen
                    </span>
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setStep(2)}
                >
                  Zurück zu den Firmendaten
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  SSL-verschlüsselt
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Check className="h-4 w-4 text-green-500" />
                  DSGVO-konform
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Herzlichen Glückwunsch!
              </h2>
              <p className="text-slate-600 mb-6">
                Ihre Firma wurde erfolgreich registriert. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-slate-900 hover:bg-slate-800" asChild>
                  <a href="/companies">Alle Firmen ansehen</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/">Zur Startseite</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
