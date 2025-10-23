import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getCompanyInfoServer } from "@/lib/data" // Importa la función del servidor
import { SiteHeader } from "@/components/site-header" // Importa el nuevo encabezado
import { SiteFooter } from "@/components/site-footer" // Importa el nuevo pie de página

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Murray & Son - Canadian Woodworking & Restoration",
  description: "Expert woodworking, restoration, and custom builds in Canada since 2023",
  icons: {
    icon: [
      {
        url: "/murrayandson-logo.jpeg",
        href: "/murrayandson-logo.jpeg",
      },
    ],
  },
  generator: "v0.dev",
}

export default async function RootLayout({
  // Haz el layout asíncrono
  children,
}: {
  children: React.ReactNode
}) {
  const companyInfo = await getCompanyInfoServer() // Obtén la información de la empresa

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SiteHeader companyInfo={companyInfo} /> {/* Pasa la información al encabezado */}
        {children}
        <SiteFooter companyInfo={companyInfo} /> {/* Pasa la información al pie de página */}
      </body>
    </html>
  )
}
