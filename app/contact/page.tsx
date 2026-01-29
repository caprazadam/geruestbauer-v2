"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Kontaktieren Sie uns</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Unser Support-Team steht Ihnen rund um die Uhr zur Verfügung, um Ihnen bei Fragen oder Anliegen zu helfen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Senden Sie uns eine Nachricht</CardTitle>
              <CardDescription>Füllen Sie das untenstehende Formular aus und wir melden uns so schnell wie möglich bei Ihnen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Ihr Name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" placeholder="Ihre E-Mail-Adresse" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Betreff</Label>
                <Input id="subject" placeholder="Betreff" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nachricht</Label>
                <Textarea id="message" placeholder="Bitte beschreiben Sie Ihr Anliegen" rows={5} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Nachricht senden</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
              <CardDescription>Erreichen Sie uns über einen dieser Kanäle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Telefon</h3>
                  <p className="text-gray-600">+49 1639540595</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">E-Mail</h3>
                  <p className="text-gray-600">info@geruestbauer24.eu</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-gray-600">
                    Musterstraße 123, <br />
                    10115 Berlin, <br />
                    Deutschland
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Support-Zeiten</h3>
                  <p className="text-gray-600">24 Stunden am Tag, 7 Tage die Woche</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Häufig gestellte Fragen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Wie trage ich meine Firma ein?</h3>
                <p className="text-gray-600">
                  Registrieren Sie sich als Firmeninhaber und klicken Sie in Ihrem Dashboard auf "Firma eintragen".
                </p>
              </div>

              <div>
                <h3 className="font-medium">Ist der Eintrag kostenlos?</h3>
                <p className="text-gray-600">
                  Wir bieten sowohl kostenlose Basis-Einträge als auch Premium-Optionen für mehr Sichtbarkeit an.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
