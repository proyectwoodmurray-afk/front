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
  const [quoteCategory, setQuoteCategory] = useState("houses") // Añade estado para quoteCategory
  const [quoteType, setQuoteType] = useState("") // Añade estado para quoteType
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)

  // Elimina todos los estados y efectos relacionados con los servicios y el carrusel
  // que ahora están en OurServices.tsx

  // Actualizar la función handleQuoteRequest para aceptar el parámetro type
  const handleQuoteRequest = (category: string, type = "") => {
    if (category === "houses" || ["luxury", "better", "basic"].includes(type)) {
      setQuoteCategory("houses") // Siempre establece la categoría a "houses" para este formulario
      setQuoteType(type)
      setQuoteModalOpen(true)
    } else {
      setGeneralQuoteCategory(category)
      setGeneralQuoteModalOpen(true)
    }
  }

  useEffect(() => {
    // Add CSS to hide scrollbar but keep functionality
    const style = document.createElement("style")
    style.textContent = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header - Reused from main page */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex flex-col min-[450px]:flex-row min-[450px]:items-center min-[450px]:h-16 justify-between py-0 min-[450px]:py-0">
          <Link
            href="/"
            className="flex items-center justify-center min-[450px]:justify-start space-x-3 py-2 min-[450px]:py-0 border-b min-[450px]:border-b-0 border-amber-100"
          >
            <div className="relative h-10 w-10 min-[450px]:h-12 min-[450px]:w-12">
              <Image src="/murrayandson-logo.jpeg" alt="Murray & Son Logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold">Murray & Son</span>
          </Link>

          {/* Responsive Navigation */}
          <nav className="flex flex-col min-[450px]:flex-row items-center min-[450px]:items-center gap-2 min-[450px]:gap-6">
            {/* First row in mobile: Who We Are, Gallery, Contact */}
            <div className="flex flex-row justify-center w-full min-[450px]:w-auto gap-2 py-2 min-[450px]:py-0">
              <Link
                href="/who-we-are"
                className="text-sm font-medium text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-300 bg-amber-50/30"
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

            {/* Second row in mobile: Work With Us, Get a Quote */}
            <div className="flex flex-row justify-center w-full min-[450px]:w-auto gap-4 pb-2 min-[450px]:pb-0">
              <Button
                onClick={() => setJobModalOpen(true)}
                className="text-sm font-medium bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition-colors text-center shadow-sm hover:shadow"
              >
                Work With Us
              </Button>

              {/* Reemplazar el botón simple de "Get a Quote" con el dropdown */}
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
      </header>

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop"
            alt="Murray & Son workshop"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Who We Are</h1>
          <p className="text-xl max-w-2xl mx-auto">Job Well Done</p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Murray & Son is a family-owned carpentry and woodworking business dedicated to preserving and creating
                Canadian heritage through exceptional craftsmanship. Founded in 2023 by master carpenter John Murray and
                his son Angus, our company combines traditional techniques with modern innovation.
              </p>
              <p className="mb-4">[Client to provide additional company background and history]</p>
              <p>
                Our commitment to quality, sustainability, and customer satisfaction has made us a trusted name in
                custom woodworking and restoration across Canada. Every project we undertake reflects our passion for
                woodworking and our dedication to creating spaces that will stand the test of time.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
              alt="Murray & Son team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Services Section - Ahora usa el componente reutilizable */}
      <OurServices handleQuoteRequest={handleQuoteRequest} />

      {/* Our Values Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">123 Woodworking Lane, Toronto, ON M5V 2K7, Canada</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@murrayandson.ca</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8am - 6pm</p>
                    <p className="text-gray-600">Saturday: 9am - 4pm</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-center px-4">
                  [Client to provide Google Maps embed or location image]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Murray & Son</h3>
              <p className="mb-4">Job Well Done</p>
              <p className="text-gray-400">Expert woodworking, restoration, and custom builds in Canada.</p>
            </div>
            <div className="flex space-x-4 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Murray & Son. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Job Application Form */}
      <JobApplicationForm open={jobModalOpen} onOpenChange={setJobModalOpen} />

      {/* Quote Request Form for Houses */}
      <QuoteRequestForm
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        initialCategory={quoteCategory} // Pasa quoteCategory
        initialType={quoteType} // Pasa quoteType
      />

      {/* General Quote Form for other services */}
      <GeneralQuoteForm
        open={generalQuoteModalOpen}
        onOpenChange={setGeneralQuoteModalOpen}
        initialCategory={generalQuoteCategory}
      />

      {/* Testimonial Form */}
      <TestimonialForm open={testimonialModalOpen} onOpenChange={setTestimonialModalOpen} />
    </div>
  )
}

// Elimina el array `services` hardcodeado de aquí
const values = [
  {
    title: "Quality Craftsmanship",
    description:
      "We take pride in our work, using the finest materials and techniques to create pieces that last generations.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Sustainability",
    description: "We source materials responsibly and implement eco-friendly practices throughout our projects.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Customer Satisfaction",
    description:
      "We work closely with our clients to ensure their vision becomes reality, exceeding expectations every time.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2"
        />
      </svg>
    ),
  },
]
