"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, Search, MoreVertical, Plus, Edit, Trash2, Eye, Upload, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 10
import { toast } from "sonner"
import { parseCompanyCSV, transformCSVToCompany } from "@/lib/csv-parser"
import { 
  loadCompaniesFromSupabase, 
  saveMultipleCompaniesToSupabase, 
  deleteCompanyFromSupabase,
  updateCompanyInSupabase
} from "@/lib/company-storage"
import type { Company } from "@/lib/company-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<Company>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const loadCompanies = async () => {
    setIsLoading(true)
    try {
      const data = await loadCompaniesFromSupabase()
      console.log("[Admin Companies] Loaded companies count:", data.length)
      setCompanies(data)
    } catch (error) {
      console.error("Error loading companies:", error)
      toast.error("Fehler beim Laden der Firmen")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const text = await file.text()
      const csvData = parseCompanyCSV(text)
      const newCompanies = csvData.map(transformCSVToCompany)
      
      const success = await saveMultipleCompaniesToSupabase(newCompanies)
      if (success) {
        await loadCompanies()
        toast.success(`${newCompanies.length} Firmen erfolgreich importiert`)
      } else {
        toast.error("Import fehlgeschlagen")
      }
    } catch (error) {
      console.error("Import fehlgeschlagen:", error)
      toast.error("CSV-Import fehlgeschlagen")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diese Firma wirklich löschen?")) {
      const success = await deleteCompanyFromSupabase(id)
      if (success) {
        setCompanies(companies.filter(c => c.id !== id))
        toast.success("Firma gelöscht")
      } else {
        toast.error("Fehler beim Löschen")
      }
    }
  }

  const handleEditSave = async () => {
    if (!selectedCompany) return
    
    const updatedCompany = { ...selectedCompany, ...editData } as Company
    const success = await updateCompanyInSupabase(updatedCompany)
    
    if (success) {
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id ? updatedCompany : c
      ))
      setIsEditOpen(false)
      toast.success("Änderungen gespeichert")
    } else {
      toast.error("Fehler beim Speichern")
    }
  }

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
              <Badge variant="outline" className="text-slate-600">
                {companies.length} Firmen in Datenbank
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Lade Firmen...</span>
              </div>
            ) : (
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
                  {paginatedCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Keine Firmen gefunden. Importieren Sie Daten oder fügen Sie eine neue Firma hinzu.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCompanies.map((company) => (
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
                            <span className="font-medium">{company.rating || 0}</span>
                            <span className="text-yellow-500">★</span>
                            <span className="text-xs text-slate-400">({company.reviewCount || 0})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Aktiv
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedCompany(company)
                                setIsViewOpen(true)
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Anzeigen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedCompany(company)
                                setEditData(company)
                                setIsEditOpen(true)
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(company.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-slate-500">
                  Zeige {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} von {filteredCompanies.length} Firmen
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.name}</DialogTitle>
            <DialogDescription>Details der Gerüstbau-Firma</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Stadt</Label>
              <div className="col-span-3">{selectedCompany?.city}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Adresse</Label>
              <div className="col-span-3">{selectedCompany?.address || "Nicht angegeben"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Telefon</Label>
              <div className="col-span-3">{selectedCompany?.phone || "Nicht angegeben"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">E-Mail</Label>
              <div className="col-span-3">{selectedCompany?.email || "Nicht angegeben"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Webseite</Label>
              <div className="col-span-3">
                {selectedCompany?.website ? (
                  <a href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedCompany.website}
                  </a>
                ) : "Nicht angegeben"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Bewertung</Label>
              <div className="col-span-3">
                {selectedCompany?.rating || 0} ★ ({selectedCompany?.reviewCount || 0} Bewertungen)
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Leistungen</Label>
              <div className="col-span-3 flex flex-wrap gap-1">
                {selectedCompany?.services?.map((s, i) => (
                  <Badge key={i} variant="outline">{s}</Badge>
                )) || "Keine"}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Firma bearbeiten</DialogTitle>
            <DialogDescription>Aktualisieren Sie die Firmendaten</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={editData.name || ""} 
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Stadt</Label>
              <Input 
                id="city" 
                value={editData.city || ""} 
                onChange={(e) => setEditData({...editData, city: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input 
                id="phone" 
                value={editData.phone || ""} 
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input 
                id="email" 
                value={editData.email || ""} 
                onChange={(e) => setEditData({...editData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Webseite</Label>
              <Input 
                id="website" 
                value={editData.website || ""} 
                onChange={(e) => setEditData({...editData, website: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Firmenbild / Logo</Label>
              <div className="flex items-center gap-4">
                {editData.imageUrl && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img src={editData.imageUrl} alt="Vorschau" className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="flex-1">
                  <Input 
                    id="image-url" 
                    placeholder="Bild-URL eingeben..." 
                    value={editData.imageUrl || ""} 
                    onChange={(e) => setEditData({...editData, imageUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Abbrechen</Button>
            <Button onClick={handleEditSave} className="bg-blue-600 hover:bg-blue-700">Speichern</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
