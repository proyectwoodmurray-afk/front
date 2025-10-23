"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobApplicationForm } from "@/components/job-application-form"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { GeneralQuoteForm } from "@/components/general-quote-form"
import { TestimonialForm } from "@/components/testimonial-form"
import { useGallery } from "@/hooks/useApi"
import type { GalleryItem } from "@/hooks/useApi"

// Importar los componentes necesarios para el dropdown
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

export default function GalleryPage() {
  const { getGalleryItems } = useGallery()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [error, setError] = useState("")
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [generalQuoteModalOpen, setGeneralQuoteModalOpen] = useState(false)
  const [generalQuoteCategory, setGeneralQuoteCategory] = useState("renovation")
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGalleryItems()
        setGalleryItems(data)
      } catch (err) {
        setError("Error al cargar la galería")
        console.error(err)
      }
    }
    loadGallery()
  }, [])

  // Actualizar la función handleQuoteRequest para aceptar el parámetro type
  const handleQuoteRequest = (category = "renovation", type = "") => {
    if (category === "houses") {
      setQuoteModalOpen(true)
    } else {
      setGeneralQuoteCategory(category)
      setGeneralQuoteModalOpen(true)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565766046621-5548ffdf30af?q=80&w=2070&auto=format&fit=crop"
            alt="Murray & Son gallery"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">Discover our latest woodworking and restoration projects</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-[#faf6f1]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No gallery items found.</div>
            ) : (
              galleryItems.map((item: any, index: number) => (
                <div key={index} className="rounded-lg border bg-white p-4 shadow-md">
                  <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Gallery item"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white" onClick={() => handleQuoteRequest("houses")}>Request a Quote</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 bg-amber-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Let's bring your vision to life with our expert craftsmanship and attention to detail.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => handleQuoteRequest("houses")} className="bg-white text-amber-800 hover:bg-gray-100">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Modals (page-specific) */}
      <JobApplicationForm open={jobModalOpen} onOpenChange={setJobModalOpen} />
      <QuoteRequestForm
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        initialCategory={"houses"}
        initialType={""}
      />
      <GeneralQuoteForm
        open={generalQuoteModalOpen}
        onOpenChange={setGeneralQuoteModalOpen}
        initialCategory={generalQuoteCategory}
      />
      <TestimonialForm open={testimonialModalOpen} onOpenChange={setTestimonialModalOpen} />
    </div>
  )
}

const testimonials = [
  {
    name: "Sarah Johnson",
    quote:
      "Murray & Son transformed our outdated kitchen into a stunning, functional space that has become the heart of our home. Their attention to detail and craftsmanship is unmatched.",
    project: "Kitchen Renovation",
  },
  {
    name: "Michael Thompson",
    quote:
      "Working with Murray & Son on our custom home was a fantastic experience from start to finish. They listened to our needs and created exactly what we envisioned.",
    project: "Custom Home Build",
  },
  {
    name: "Emily Wilson",
    quote:
      "The restoration work they did on our heritage barn exceeded all expectations. They preserved the history while making it functional for modern use.",
    project: "Barn Restoration",
  },
]
