"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Building2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

type Request = {
  id: string
  companyName: string
  serviceType: string
  location: string
  date: string
  status: "ausstehend" | "akzeptiert" | "abgelehnt"
  message?: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedRequests = localStorage.getItem("userRequests")
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests))
    } else {
      setRequests([
        {
          id: "1",
          companyName: "Gerüstbau Schmidt GmbH",
          serviceType: "Fassadengerüst",
          location: "Berlin",
          date: "2026-01-15",
          status: "ausstehend",
          message: "Anfrage für ein Fassadengerüst für ein Mehrfamilienhaus"
        },
        {
          id: "2",
          companyName: "Müller Gerüstbau",
          serviceType: "Baugerüst",
          location: "Hamburg",
          date: "2026-01-10",
          status: "akzeptiert",
          message: "Baugerüst für Renovierungsarbeiten"
        }
      ])
    }
    setIsLoading(false)
  }, [])

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "akzeptiert":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Akzeptiert
          </Badge>
        )
      case "abgelehnt":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Abgelehnt
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ausstehend
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Wird geladen...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zum Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Meine Anfragen</h1>
        <p className="text-slate-500 mt-2">Übersicht aller Ihre Anfragen an Gerüstbaufirmen</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Keine Anfragen vorhanden
            </h3>
            <p className="text-slate-500 mb-6">
              Sie haben noch keine Anfragen an Gerüstbaufirmen gestellt.
            </p>
            <Link href="/companies">
              <Button>Firmen durchsuchen</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.companyName}</CardTitle>
                    <CardDescription>{request.serviceType}</CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {request.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(request.date).toLocaleDateString("de-DE")}
                  </div>
                </div>
                {request.message && (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                    {request.message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
