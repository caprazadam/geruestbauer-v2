import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import { defaultMetadata } from './metadata'
import ClientLayout from './client-layout'
import JsonLdScripts from './json-ld'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://geruestbauer24.de" />
        <meta name="geo.region" content="DE" />
        <meta name="geo.placename" content="Deutschland" />
      </head>
      <body className={`${inter.className} bg-gray-200 text-black min-h-screen flex flex-col`} suppressHydrationWarning>
        <JsonLdScripts />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
