"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Mail, Phone, Clock, CheckCircle, Loader2 } from "lucide-react"
import { JobApplicationForm } from "@/components/job-application-form"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { GeneralQuoteForm } from "@/components/general-quote-form"

// Importar el nuevo hook useContact y CompanyInfo
import { useContact, type CreateContactMessage, useCompanyInfo } from "@/hooks/useApi"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const { createContactMessage } = useContact() // Usar el hook useContact
  const { companyInfo } = useCompanyInfo() // Obtener la información de la empresa desde el hook

  useEffect(() => {
    // Forzar el scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0)
  }, [])

  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [generalQuoteModalOpen, setGeneralQuoteModalOpen] = useState(false)
  const [generalQuoteCategory, setGeneralQuoteCategory] = useState("renovation")

  // Añadir las variables de estado necesarias
  const [quoteCategory, setQuoteCategory] = useState("houses")
  const [quoteType, setQuoteType] = useState("")

  // Actualizar la función handleQuoteRequest para aceptar el parámetro type
  const handleQuoteRequest = (category = "renovation", type = "") => {
    if (category === "houses") {
      setQuoteCategory(category)
      setQuoteType(type)
      setQuoteModalOpen(true)
    } else {
      setGeneralQuoteCategory(category)
      setGeneralQuoteModalOpen(true)
    }
  }

  // Estado para el formulario
  const [formData, setFormData] = useState<CreateContactMessage>({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  })

  // Estado para el envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en el select
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reason: value }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Usar el hook createContactMessage para enviar los datos al backend
      await createContactMessage(formData)

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "",
        message: "",
      })
    } catch (err: any) {
      console.error("Error al enviar el formulario de contacto:", err)
      setError(err.message || "Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header is now handled by app/layout.tsx */}

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="Murray & Son contact"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">We're here to answer your questions and help with your project</p>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        {companyInfo?.address || "123 Woodworking Lane, Toronto, ON M5V 2K7, Canada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{companyInfo?.phone || "(123) 456-7890"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{companyInfo?.email || "info@murrayandsonconstruction.ca"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-amber-700 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Hours</p>
                      {companyInfo?.hours ? (
                        Object.entries(companyInfo.hours).map(([day, time]) => (
                          <p key={day} className="text-gray-600">
                            {day.charAt(0).toUpperCase() + day.slice(1)}: {time}
                          </p>
                        ))
                      ) : (
                        <>
                          <p className="text-gray-600">Monday - Friday: 8am - 6pm</p>
                          <p className="text-gray-600">Saturday: 9am - 4pm</p>
                          <p className="text-gray-600">Sunday: Closed</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md">
                {/* Placeholder for map - client can replace with actual map embed */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4">
                    [Client to provide Google Maps embed or location image]
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-6">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} className="bg-green-600 hover:bg-green-700">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason for Contact</Label>
                      <Select value={formData.reason} onValueChange={handleSelectChange}>
                        <SelectTrigger id="reason" className="mt-1">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quote">Request a Quote</SelectItem>
                          <SelectItem value="information">General Information</SelectItem>
                          <SelectItem value="project">Discuss a Project</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project or question..."
                        required
                        className="mt-1 h-32"
                      />
                    </div>

                    {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                    <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is now handled by app/layout.tsx */}

      {/* Modals (still here as they are page-specific) */}
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
    </div>
  )
}

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We primarily serve the Greater Toronto Area and surrounding regions in Ontario. For larger projects, we may be willing to travel further. Please contact us to discuss your specific location.",
  },
  {
    question: "How do I get a quote for my project?",
    answer:
      "You can request a quote by filling out our contact form, calling us directly, or using the 'Get a Quote' button on our website. We'll arrange a consultation to discuss your specific project needs and provide a detailed estimate.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary greatly depending on the scope and complexity. A small renovation might take 2-4 weeks, while a custom home build could take 6-12 months. We'll provide a detailed timeline during the quoting process.",
  },
  {
    question: "Do you provide warranties on your work?",
    answer:
      "Yes, we stand behind our craftsmanship. All our projects come with a standard 1-year warranty on workmanship. Our luxury tier projects include an extended warranty. Materials typically carry manufacturer warranties as well.",
  },
]
