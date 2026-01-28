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
  const [storedCompanies, setStoredCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<Company>>({})

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
      
      const updated = [...newCompanies, ...storedCompanies]
      saveCompaniesToStorage(updated)
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

  const handleDelete = (id: string) => {
    if (confirm("Möchten Sie diese Firma wirklich löschen?")) {
      const updated = storedCompanies.filter(c => c.id !== id)
      saveCompaniesToStorage(updated)
      setStoredCompanies(updated)
      toast.success("Firma gelöscht")
    }
  }

  const handleEditSave = () => {
    if (!selectedCompany) return
    const updated = storedCompanies.map(c => 
      c.id === selectedCompany.id ? { ...c, ...editData } : c
    )
    saveCompaniesToStorage(updated)
    setStoredCompanies(updated)
    setIsEditOpen(false)
    toast.success("Änderungen gespeichert")
  }

  const mockCompanies = [
    {
      id: "mock-1",
      name: "Müller Gerüstbau GmbH",
      city: "Berlin",
      rating: 4.8,
      status: "active",
      address: "Musterstraße 1, 10115 Berlin",
      phone: "+49 30 1234567",
      email: "info@mueller-geruestbau.de",
      services: ["Fassadengerüst", "Rollgerüst"]
    },
    {
      id: "mock-2",
      name: "Schmidt Baugerüste",
      city: "München",
      rating: 4.6,
      status: "active",
      address: "Beispielweg 42, 80331 München",
      phone: "+49 89 9876543",
      email: "kontakt@schmidt-bau.de",
      services: ["Dachdeckergerüst", "Spezialgerüst"]
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedCompany(company as Company)
                            setIsViewOpen(true)
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedCompany(company as Company)
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
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
              <div className="col-span-3">{(selectedCompany as any)?.address || "Nicht angegeben"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Telefon</Label>
              <div className="col-span-3">{(selectedCompany as any)?.phone || "Nicht angegeben"}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">E-Mail</Label>
              <div className="col-span-3">{(selectedCompany as any)?.email || "Nicht angegeben"}</div>
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

      {/* Edit Dialog */}
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
                value={(editData as any).phone || ""} 
                onChange={(e) => setEditData({...editData, phone: e.target.value} as any)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input 
                id="email" 
                value={(editData as any).email || ""} 
                onChange={(e) => setEditData({...editData, email: e.target.value} as any)}
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
                    className="mb-2"
                  />
                  <div className="relative">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditData({...editData, imageUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Laden Sie eine Datei hoch oder geben Sie eine URL an.
                    </div>
                  </div>
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
