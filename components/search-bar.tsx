"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [service, setService] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (service) params.append("service", service)

    router.push(`/companies?${params.toString()}`)
  }

  return (
    <Card className="p-4 shadow-lg max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Stadt, PLZ oder Region"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue placeholder="Leistung wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fassadengerust">Fassadengerüst</SelectItem>
              <SelectItem value="arbeitsgerust">Arbeitsgerüst</SelectItem>
              <SelectItem value="schutzgerust">Schutzgerüst</SelectItem>
              <SelectItem value="dachfanggerust">Dachfanggerüst</SelectItem>
              <SelectItem value="rollgerust">Rollgerüst</SelectItem>
              <SelectItem value="gerust-vermietung">Gerüst-Vermietung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Suchen
        </Button>
      </form>
    </Card>
  )
}
