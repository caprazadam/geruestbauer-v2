"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Check, X, Eye, Star } from "lucide-react"

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const reviews = [
    {
      id: 1,
      company: "Müller Gerüstbau GmbH",
      user: "Thomas Schmidt",
      rating: 5,
      comment: "Sehr professionelle Arbeit, pünktlich und zuverlässig!",
      status: "pending",
      date: "22.01.2024",
    },
    {
      id: 2,
      company: "Schmidt Baugerüste",
      user: "Anna Weber",
      rating: 4,
      comment: "Gute Qualität, freundliches Team.",
      status: "approved",
      date: "21.01.2024",
    },
    {
      id: 3,
      company: "Weber Gerüsttechnik",
      user: "Michael Becker",
      rating: 5,
      comment: "Hervorragend! Kann ich nur weiterempfehlen.",
      status: "pending",
      date: "20.01.2024",
    },
    {
      id: 4,
      company: "Becker Gerüstbau",
      user: "Sarah Müller",
      rating: 3,
      comment: "Solide Arbeit, aber etwas teuer.",
      status: "approved",
      date: "19.01.2024",
    },
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bewertungsverwaltung</h1>
            <p className="text-slate-600 mt-1">Moderieren und verwalten Sie Kundenbewertungen</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Bewertung suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma</TableHead>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Bewertung</TableHead>
                  <TableHead>Kommentar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.company}</TableCell>
                    <TableCell>{review.user}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                    <TableCell>
                      <Badge
                        variant={review.status === "approved" ? "default" : "secondary"}
                        className={
                          review.status === "approved"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {review.status === "approved" ? "Genehmigt" : "Ausstehend"}
                      </Badge>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Details anzeigen
                          </DropdownMenuItem>
                          {review.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <Check className="h-4 w-4 mr-2" />
                                Genehmigen
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <X className="h-4 w-4 mr-2" />
                                Ablehnen
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
