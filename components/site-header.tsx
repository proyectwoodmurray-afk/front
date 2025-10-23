"use client"

import { useState } from "react"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { JobApplicationForm } from "@/components/job-application-form"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { GeneralQuoteForm } from "@/components/general-quote-form"
import type { CompanyInfo } from "@/hooks/useApi" // Importa la interfaz

interface SiteHeaderProps {
  companyInfo: CompanyInfo | null
}

export function SiteHeader({ companyInfo }: SiteHeaderProps) {
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [generalQuoteModalOpen, setGeneralQuoteModalOpen] = useState(false)
  const [quoteCategory, setQuoteCategory] = useState("houses")
  const [quoteType, setQuoteType] = useState("")
  const [generalQuoteCategory, setGeneralQuoteCategory] = useState("renovation")

  const handleQuoteRequest = (category: string, type = "") => {
    if (category === "houses" || ["luxury", "better", "basic"].includes(type)) {
      setQuoteCategory("houses")
      setQuoteType(type)
      setQuoteModalOpen(true)
    } else {
      setGeneralQuoteCategory(category)
      setGeneralQuoteModalOpen(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex flex-col min-[450px]:flex-row min-[450px]:items-center min-[450px]:h-16 justify-between py-0 min-[450px]:py-0">
        <Link
          href="/"
          className="flex items-center justify-center min-[450px]:justify-start space-x-3 py-2 min-[450px]:py-0 border-b min-[450px]:border-b-0 border-amber-100"
        >
          <div className="relative h-10 w-10 min-[450px]:h-12 min-[450px]:w-12">
            <Image src="/murrayandson-logo.jpeg" alt="Murray & Son Logo" fill className="object-contain" priority />
          </div>
          <span className="text-xl font-bold">{companyInfo?.name || "Murray & Son"}</span>
        </Link>

        <nav className="flex flex-col min-[450px]:flex-row items-center min-[450px]:items-center gap-2 min-[450px]:gap-6">
          <div className="flex flex-row justify-center w-full min-[450px]:w-auto gap-2 py-2 min-[450px]:py-0">
            <Link
              href="/who-we-are"
              className="text-sm font-medium hover:text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-100 hover:border-amber-300 hover:bg-amber-50/30"
            >
              Who We Are
            </Link>
            <Link
              href="/gallery"
              className="text-sm font-medium hover:text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-100 hover:border-amber-300 hover:bg-amber-50/30"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-100 hover:border-amber-300 hover:bg-amber-50/30"
            >
              Contact
            </Link>
          </div>

          <div className="flex flex-row justify-center w-full min-[450px]:w-auto gap-4 pb-2 min-[450px]:pb-0">
            <Button
              onClick={() => setJobModalOpen(true)}
              className="text-sm font-medium bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors text-center shadow-sm hover:shadow"
            >
              Work With Us
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center text-sm font-medium bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors shadow-sm hover:shadow">
                Get a Quote <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Houses</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleQuoteRequest("houses", "luxury")}>Luxury</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuoteRequest("houses", "better")}>Better</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuoteRequest("houses", "basic")}>Basic</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => handleQuoteRequest("renovation")}>Renovation</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuoteRequest("decks")}>Decks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuoteRequest("outdoor")}>Outdoor</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuoteRequest("demolition")}>Demolition</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>

      {/* Modals (should be rendered once per page, not in header) */}
      <JobApplicationForm open={jobModalOpen} onOpenChange={setJobModalOpen} />
      <QuoteRequestForm
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        initialCategory={quoteCategory}
        initialType={quoteType}
      />
      <GeneralQuoteForm
        open={generalQuoteModalOpen}
        onOpenChange={setGeneralQuoteModalOpen}
        initialCategory={generalQuoteCategory}
      />
    </header>
  )
}
