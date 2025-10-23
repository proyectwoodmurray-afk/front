"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Clock, ChevronDown } from "lucide-react" // Elimina ChevronLeft, ChevronRight
import { JobApplicationForm } from "@/components/job-application-form"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { GeneralQuoteForm } from "@/components/general-quote-form"
import { TestimonialForm } from "@/components/testimonial-form"
import { OurServices } from "@/components/our-services" // Importa el nuevo componente

// Importar los componentes necesarios para el dropdown
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

export default function WhoWeArePage() {
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [generalQuoteModalOpen, setGeneralQuoteModalOpen] = useState(false)
  const [generalQuoteCategory, setGeneralQuoteCategory] = useState("renovation")
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)

  // Actualizar la función handleQuoteRequest para aceptar el parámetro type
  const handleQuoteRequest = (category = "renovation", type = "") => {
    if (category === "houses") {
      setQuoteModalOpen(true)
    } else {
      setGeneralQuoteCategory(category)
      setGeneralQuoteModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
            alt="Who We Are hero"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Who We Are</h1>
          <p className="text-xl max-w-2xl mx-auto">Meet the team behind Murray & Son and our story</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-[#faf6f1]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="max-w-3xl mx-auto text-center text-gray-700 text-lg leading-relaxed">
            <p>
              Murray & Son is a family-owned woodworking and restoration business based in Toronto, Canada. With decades of experience, we combine traditional craftsmanship with modern techniques to deliver exceptional results for every project.
            </p>
            <p className="mt-6">
              Our team is passionate about quality, detail, and customer satisfaction. Whether it's a custom build, a restoration, or a renovation, we treat every project as if it were our own home.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Aquí podrías mapear miembros del equipo si tienes datos */}
            <div className="rounded-lg border bg-white p-8 shadow-md text-center">
              <Image src="/murrayandson-logo.jpeg" alt="Founder" width={120} height={120} className="mx-auto rounded-full mb-4" />
              <h3 className="text-xl font-bold mb-2">John Murray</h3>
              <p className="text-gray-600 mb-2">Founder & Master Carpenter</p>
              <p className="text-gray-500">Over 30 years of experience in woodworking and restoration.</p>
            </div>
            <div className="rounded-lg border bg-white p-8 shadow-md text-center">
              <Image src="/murrayandson-logo.jpeg" alt="Co-Founder" width={120} height={120} className="mx-auto rounded-full mb-4" />
              <h3 className="text-xl font-bold mb-2">Michael Murray</h3>
              <p className="text-gray-600 mb-2">Co-Founder & Designer</p>
              <p className="text-gray-500">Specializes in modern design and project management.</p>
            </div>
            <div className="rounded-lg border bg-white p-8 shadow-md text-center">
              <Image src="/murrayandson-logo.jpeg" alt="Lead Builder" width={120} height={120} className="mx-auto rounded-full mb-4" />
              <h3 className="text-xl font-bold mb-2">Sarah Lee</h3>
              <p className="text-gray-600 mb-2">Lead Builder</p>
              <p className="text-gray-500">Expert in custom builds and finishing touches.</p>
            </div>
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
