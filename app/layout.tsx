import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import { defaultMetadata, generateOrganizationSchema, generateWebsiteSchema } from './metadata'
import ClientLayout from './client-layout'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="de">
      <head>
        <link rel="canonical" href="https://geruestbauer24.de" />
        <meta name="geo.region" content="DE" />
        <meta name="geo.placename" content="Deutschland" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-200 text-black min-h-screen flex flex-col`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
