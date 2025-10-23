"use client"

import Link from "next/link"
import type { CompanyInfo } from "@/hooks/useApi" // Importa la interfaz
import { Facebook, Instagram, Twitter } from "lucide-react" // Importa los iconos de Lucide React

interface SiteFooterProps {
  companyInfo: CompanyInfo | null
}

export function SiteFooter({ companyInfo }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-4">{companyInfo?.name || "Murray & Son"}</h3>
            <p className="mb-4">{companyInfo?.tagline || "Job Well Done"}</p>
            <p className="text-gray-400">
              {companyInfo?.description || "Expert woodworking, restoration, and custom builds in Canada."}
            </p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            {companyInfo?.socialMedia?.facebook && (
              <Link
                href={companyInfo.socialMedia.facebook}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
            )}
            {companyInfo?.socialMedia?.instagram && (
              <Link
                href={companyInfo.socialMedia.instagram}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
            )}
            {companyInfo?.socialMedia?.twitter && (
              <Link
                href={companyInfo.socialMedia.twitter}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {currentYear} {companyInfo?.name || "Murray & Son"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
