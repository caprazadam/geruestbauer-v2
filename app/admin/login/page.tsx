"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simuliere Login-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Lese gespeicherte Admin-Daten aus localStorage oder verwende Standard-Credentials
    const storedAdmin = localStorage.getItem("adminUser");
    
    // Default credentials
    const defaultAdmin = {
      username: "admin",
      password: "admin123",
      name: "Administrator",
      role: "admin",
      id: "admin-1"
    };

    let adminData = { ...defaultAdmin };

    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        // Only use stored password if it exists
        if (parsed.password) {
          adminData.password = parsed.password;
        }
        if (parsed.username) {
          adminData.username = parsed.username;
        }
      } catch (e) {
        console.error("Error parsing admin data:", e);
      }
    }

    // Überprüfe Credentials
    if (
      credentials.username === adminData.username &&
      credentials.password === adminData.password
    ) {
      // Speichere nur Session-Info, NICHT das Passwort überschreiben
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          loggedIn: true,
          username: adminData.username,
          loginTime: new Date().toISOString()
        }),
      );
      router.push("/admin/dashboard");
    } else {
      setError("Ungültiger Benutzername oder Passwort");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Admin-Panel
          </CardTitle>
          <CardDescription className="text-slate-400">
            Gerüstbauer-Verzeichnis Verwaltung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200">
                Benutzername
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Anmeldung läuft..." : "Anmelden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
