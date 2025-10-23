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
  const [galleryItems, setGalleryItems] = useState([])
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

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

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
      {/* Header - Reused from main page */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex flex-col min-[450px]:flex-row min-[450px]:items-center min-[450px]:h-16 justify-between py-0 min-[450px]:py-0">
          <Link
            href="/"
            className="flex items-center justify-center min-[450px]:justify-start space-x-3 py-2 min-[450px]:py-0 border-b min-[450px]:border-b-0 border-amber-100"
          >
            <div className="relative h-10 w-10 min-[450px]:h-12 min-[450px]:w-12">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/murrayandson-0iYfSaRyviS6YZRcRUKFuj4jFDQypB.jpeg"
                alt="Murray & Son Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold">Murray & Son</span>
          </Link>

          {/* Responsive Navigation */}
          <nav className="flex flex-col min-[450px]:flex-row items-center min-[450px]:items-center gap-2 min-[450px]:gap-6">
            {/* First row in mobile: Who We Are, Gallery, Contact */}
            <div className="flex flex-row justify-center w-full min-[450px]:w-auto gap-2 py-2 min-[450px]:py-0">
              <Link
                href="/who-we-are"
                className="text-sm font-medium hover:text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-100 hover:border-amber-300 hover:bg-amber-50/30"
              >
                Who We Are
              </Link>
              <Link
                href="/gallery"
                className="text-sm font-medium text-amber-700 transition-all px-3 py-1 rounded-full border border-amber-300 bg-amber-50/30"
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
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565766046621-5548ffdf30af?q=80&w=2070&auto=format&fit=crop"
            alt="Murray & Son woodworking gallery"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Work</h1>
          <p className="text-xl max-w-2xl mx-auto">Showcasing our finest craftsmanship and attention to detail</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-[#faf6f1]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item: any) => (
              <div
                key={item._id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project Spotlight */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Project Spotlight</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop"
                alt="Featured project spotlight"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Lakeside Cabin Retreat</h3>
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">
                  This custom-built vacation home showcases our commitment to traditional Canadian craftsmanship while
                  incorporating modern amenities and sustainable building practices.
                </p>
                <p className="mb-4">[Client to provide detailed project description]</p>
                <ul className="space-y-2 mb-6">
                  <li>Custom timber frame construction</li>
                  <li>Locally sourced cedar siding</li>
                  <li>Hand-crafted interior cabinetry</li>
                  <li>Integrated outdoor living spaces</li>
                  <li>Energy-efficient design</li>
                </ul>
              </div>
              <div className="flex gap-4 mt-8">
                <Button className="bg-amber-700 hover:bg-amber-800 text-white">View More Photos</Button>
                <Button className="bg-transparent border border-white hover:bg-white/10 text-white">
                  Similar Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.project}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">[Client to provide actual testimonials from satisfied customers]</p>
            <Button
              onClick={() => setTestimonialModalOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              Leave Your Testimonial
            </Button>
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
          <div className="flex flex-wrap justify-center gap-4">
            {/* También actualizar el botón en la sección "Call to Action" */}
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
              <p className="mb-4">Crafting Canadian Heritage Since 2023</p>
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
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
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

      {/* Quote Request Form */}
      <QuoteRequestForm open={quoteModalOpen} onOpenChange={setQuoteModalOpen} initialCategory="houses" />

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
