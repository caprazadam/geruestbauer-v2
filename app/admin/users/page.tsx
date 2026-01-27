"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: 1,
      name: "Thomas Müller",
      email: "thomas.mueller@email.de",
      phone: "+49 171 1234567",
      role: "owner",
      status: "active",
      joined: "12.01.2024",
    },
    {
      id: 2,
      name: "Anna Schmidt",
      email: "anna.schmidt@email.de",
      phone: "+49 172 2345678",
      role: "customer",
      status: "active",
      joined: "15.01.2024",
    },
    {
      id: 3,
      name: "Michael Weber",
      email: "michael.weber@email.de",
      phone: "+49 173 3456789",
      role: "owner",
      status: "active",
      joined: "18.01.2024",
    },
    {
      id: 4,
      name: "Sarah Becker",
      email: "sarah.becker@email.de",
      phone: "+49 174 4567890",
      role: "customer",
      status: "inactive",
      joined: "20.01.2024",
    },
  ]

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: "bg-purple-100 text-purple-700",
      customer: "bg-blue-100 text-blue-700",
      admin: "bg-red-100 text-red-700",
    }
    const labels = {
      owner: "Firmeninhaber",
      customer: "Kunde",
      admin: "Administrator",
    }
    return { color: colors[role as keyof typeof colors], label: labels[role as keyof typeof labels] }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Benutzerverwaltung</h1>
            <p className="text-slate-600 mt-1">Verwalten Sie alle Benutzerkonten</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Neuer Benutzer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Benutzer suchen..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beitritt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const roleBadge = getRoleBadge(user.role)
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={roleBadge.color}>
                          {roleBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                          }
                        >
                          {user.status === "active" ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
