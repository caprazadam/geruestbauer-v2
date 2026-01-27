"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, Search, MoreVertical, Plus, Edit, Trash2, Eye, Upload } from "lucide-react"
import { toast } from "sonner"
import { parseCompanyCSV, transformCSVToCompany } from "@/lib/csv-parser"
import { saveCompaniesToStorage, getAllStoredCompanies } from "@/lib/company-storage"
import type { Company } from "@/lib/company-data"

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [storedCompanies, setStoredCompanies] = useState<Company[]>([])

  useEffect(() => {
    setStoredCompanies(getAllStoredCompanies())
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const text = await file.text()
      const csvData = parseCompanyCSV(text)
      const newCompanies = csvData.map(transformCSVToCompany)
      
      saveCompaniesToStorage([...newCompanies, ...storedCompanies])
      setStoredCompanies(getAllStoredCompanies())
      
      toast.success(`${newCompanies.length} Firmen erfolgreich importiert`)
    } catch (error) {
      console.error("Import fehlgeschlagen:", error)
      toast.error("CSV-Import fehlgeschlagen")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const mockCompanies = [
    {
      id: "mock-1",
      name: "Müller Gerüstbau GmbH",
      city: "Berlin",
      rating: 4.8,
      status: "active",
    },
    {
      id: "mock-2",
      name: "Schmidt Baugerüste",
      city: "München",
      rating: 4.6,
      status: "active",
    }
  ]

  const allCompanies = [
    ...storedCompanies.map(c => ({ ...c, status: "active" })),
    ...mockCompanies
  ]

  const filteredCompanies = allCompanies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Firmenverwaltung</h1>
            <p className="text-slate-600 mt-1">Verwalten Sie alle registrierten Gerüstbau-Firmen</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Importieren..." : "CSV Import"}
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Neue Firma
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Firma suchen..."
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
                  <TableHead>Standort</TableHead>
                  <TableHead>Bewertung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        {company.name}
                      </div>
                    </TableCell>
                    <TableCell>{company.city}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{company.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={company.status === "active" ? "default" : "secondary"}
                        className={
                          company.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {company.status === "active" ? "Aktiv" : "Ausstehend"}
                      </Badge>
                    </TableCell>
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
                            Anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
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
