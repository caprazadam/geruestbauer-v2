export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  isPublished: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Sicherheit auf dem Gerüst: Die wichtigsten Regeln",
    slug: "sicherheit-auf-dem-geruest",
    excerpt: "Erfahren Sie die wichtigsten Sicherheitsregeln für die Arbeit auf Gerüsten und wie Sie Unfälle vermeiden können.",
    content: `
## Sicherheit auf dem Gerüst: Ein umfassender Leitfaden

Die Arbeit auf Gerüsten gehört zu den gefährlichsten Tätigkeiten im Baugewerbe. Jedes Jahr ereignen sich zahlreiche Unfälle, die durch die Einhaltung einfacher Sicherheitsregeln hätten vermieden werden können.

### Grundlegende Sicherheitsregeln

1. **Persönliche Schutzausrüstung (PSA)**: Helm, rutschfeste Schuhe und bei Bedarf Sicherheitsgurt sind Pflicht.

2. **Regelmäßige Inspektion**: Vor Arbeitsbeginn muss das Gerüst auf Beschädigungen überprüft werden.

3. **Belastungsgrenzen beachten**: Niemals mehr Gewicht auf das Gerüst bringen als zulässig.

4. **Wetterbedingungen**: Bei Sturm, Eis oder starkem Regen sollten Gerüstarbeiten eingestellt werden.

### Aufbau und Abbau

Der Auf- und Abbau von Gerüsten darf nur von geschultem Personal durchgeführt werden. Die Montage muss nach den Herstellerangaben und den geltenden Vorschriften erfolgen.

### Schulung und Unterweisung

Alle Mitarbeiter, die auf Gerüsten arbeiten, müssen regelmäßig geschult und unterwiesen werden. Dies umfasst:

- Gefahren erkennen
- Richtiges Verhalten im Notfall
- Umgang mit der Schutzausrüstung
- Erste-Hilfe-Maßnahmen

### Fazit

Sicherheit auf dem Gerüst ist kein Zufall, sondern das Ergebnis sorgfältiger Planung und konsequenter Umsetzung von Sicherheitsmaßnahmen.
    `,
    author: "Max Müller",
    publishedAt: "2026-01-15",
    category: "Sicherheit",
    tags: ["Sicherheit", "Arbeitsschutz", "Gerüstbau"],
    imageUrl: "/placeholder.svg?height=400&width=600&query=scaffolding+safety+construction",
    isPublished: true
  },
  {
    id: "2",
    title: "Die verschiedenen Gerüstarten im Überblick",
    slug: "geruestarten-im-ueberblick",
    excerpt: "Von Rahmengerüsten bis Hängegerüste - welche Gerüstarten gibt es und wann werden sie eingesetzt?",
    content: `
## Die verschiedenen Gerüstarten im Überblick

Je nach Einsatzzweck und baulichen Gegebenheiten kommen unterschiedliche Gerüstarten zum Einsatz. Hier ein Überblick über die wichtigsten Typen.

### Rahmengerüste (Fassadengerüste)

Das am häufigsten verwendete Gerüstsystem für Fassadenarbeiten. Es besteht aus vorgefertigten Rahmen, die schnell auf- und abgebaut werden können.

**Vorteile:**
- Schneller Aufbau
- Hohe Stabilität
- Wirtschaftlich

### Modulgerüste

Flexibles System mit Einzelteilen, die in alle Richtungen verbunden werden können. Ideal für komplexe Gebäudeformen.

**Vorteile:**
- Höchste Flexibilität
- Passt sich jeder Form an
- Vielseitig einsetzbar

### Fahrgerüste (Rollgerüste)

Mobile Gerüste auf Rollen für Arbeiten in geringer Höhe. Schnell versetzbar und ideal für Innenarbeiten.

**Vorteile:**
- Mobil und flexibel
- Schneller Standortwechsel
- Kompakt und platzsparend

### Hängegerüste

Werden von oben abgehängt und eignen sich besonders für Arbeiten an hohen Gebäuden oder Brücken.

**Vorteile:**
- Kein Bodenkontakt nötig
- Ideal für hohe Gebäude
- Flexible Positionierung

### Fazit

Die Wahl des richtigen Gerüsttyps hängt von vielen Faktoren ab. Lassen Sie sich von einem Fachbetrieb beraten.
    `,
    author: "Thomas Schmidt",
    publishedAt: "2026-01-10",
    category: "Wissen",
    tags: ["Gerüstarten", "Fassadengerüst", "Modulgerüst"],
    imageUrl: "/placeholder.svg?height=400&width=600&query=scaffolding+types+construction",
    isPublished: true
  },
  {
    id: "3",
    title: "Kosten für Gerüstbau: Was Sie wissen müssen",
    slug: "kosten-fuer-geruestbau",
    excerpt: "Was kostet ein Gerüst? Erfahren Sie alles über Preisfaktoren und wie Sie Kosten sparen können.",
    content: `
## Kosten für Gerüstbau: Ein Leitfaden

Die Kosten für den Gerüstbau variieren je nach vielen Faktoren. Hier erfahren Sie, womit Sie rechnen müssen.

### Preisfaktoren

1. **Gerüstgröße und -höhe**: Je größer die zu einrüstende Fläche, desto höher die Kosten.

2. **Mietdauer**: Die meisten Gerüste werden wochenweise vermietet.

3. **Gerüstart**: Spezialgerüste kosten mehr als Standardgerüste.

4. **Zusatzleistungen**: Treppenturm, Schutzdach oder Absturzsicherung erhöhen den Preis.

### Durchschnittliche Kosten

- **Fassadengerüst**: 6-12 € pro m² und Woche
- **Rollgerüst**: 50-150 € pro Woche
- **Auf- und Abbau**: 4-8 € pro m²

### Tipps zum Sparen

- Vergleichen Sie mehrere Angebote
- Planen Sie die Arbeiten effizient
- Vermeiden Sie Standzeiten
- Fragen Sie nach Pauschalpreisen

### Fazit

Die Investition in ein professionelles Gerüst ist wichtig für Sicherheit und Effizienz. Sparen Sie nicht am falschen Ende.
    `,
    author: "Anna Weber",
    publishedAt: "2026-01-05",
    category: "Kosten",
    tags: ["Preise", "Kosten", "Budget"],
    imageUrl: "/placeholder.svg?height=400&width=600&query=scaffolding+costs+money",
    isPublished: true
  }
];

export const blogCategories = [
  "Sicherheit",
  "Wissen",
  "Kosten",
  "Tipps",
  "Neuigkeiten",
  "Technik"
];
