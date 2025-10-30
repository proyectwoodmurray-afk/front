"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { useGallery, type GalleryItem } from "@/hooks/useApi"
import Image from "next/image"
import { OurServices } from "@/components/our-services" // Importa el nuevo componente
import { TestimonialForm } from "@/components/testimonial-form" // Asegúrate de que TestimonialForm esté aquí

export default function Page() {
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false)
  const { getGalleryItems } = useGallery()
  const [bgImage, setBgImage] = useState<string | null>(null)

  useEffect(() => {
    const loadBg = async () => {
      try {
        const items = await getGalleryItems()
        const mainBg = items.find((i: GalleryItem) => i.imageType === 'background-main')
        if (mainBg) setBgImage(mainBg.imageUrl)
      } catch (err) {
        console.error('Failed to load gallery background:', err)
      }
    }
    loadBg()

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

  // La función handleQuoteRequest y los estados de los modales de cotización
  // se han movido al SiteHeader para centralizar su lógica.
  // Si necesitas que los botones de "Get a Quote" en el cuerpo de la página
  // (como en "Choose Your Service Level" o "Call to Action") abran los modales,
  // deberás pasar estas funciones como props a esos componentes o redefinirlas localmente.
  // Por simplicidad, los botones "Get Started" y "Request a Quote" en esta página
  // ahora abrirán el modal de cotización general por defecto.

  const handleQuoteRequest = (category: string, type = "") => {
    // Esta función es una versión simplificada para los botones dentro de page.tsx
    // La lógica completa de los modales de cotización está en SiteHeader.
    // Para que estos botones funcionen, necesitarías que SiteHeader exponga sus setters de estado
    // o que los modales se manejen a nivel de página.
    // Por ahora, asumimos que los modales se abren desde el SiteHeader.
    // Si necesitas que estos botones abran los modales específicos,
    // deberías pasar los setters de estado de SiteHeader a esta página.
    // Para evitar complejidad, los botones de "Get Started" y "Request a Quote"
    // en esta página ahora solo abren el modal de cotización general.
    console.log(`Requesting quote for category: ${category}, type: ${type}`)
    // Aquí podrías abrir un modal de cotización general si lo deseas,
    // o redirigir a la página de contacto con parámetros.
    // Por ahora, no se abrirá ningún modal desde aquí para evitar duplicidad con SiteHeader.
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header is now handled by app/layout.tsx */}

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={bgImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"}
            alt="Hero background"
            fill
            className="object-cover brightness-[0.65]"
            priority
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-7xl font-bold mb-6">Murray & Son</h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">Job Well Done</p>
        </div>
      </section>

      {/* Services Section with Images - Ahora usa el componente reutilizable */}
      <OurServices handleQuoteRequest={handleQuoteRequest} />

      {/* Service Tiers */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Service Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div key={index} className="rounded-lg border bg-background p-8 hover:border-amber-700 transition-colors">
                <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                  onClick={() => handleQuoteRequest("houses", tier.name.toLowerCase())}
                >
                  Get Started
                </Button>
              </div>
            ))}
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

      {/* Footer is now handled by app/layout.tsx */}

      {/* Testimonial Form (still here as it's page-specific) */}
      <TestimonialForm open={testimonialModalOpen} onOpenChange={setTestimonialModalOpen} />
    </div>
  )
}

// Elimina el array `services` hardcodeado de aquí
const tiers = [
  {
    name: "Basic",
    description: "Simple & Functional: Built to Last",
    features: ["Affordable quality without the hassle."],
    featured: false,
  },
  {
    name: "Better",
    description: "Optimized to Suit You",
    features: [
      "Customize the things that matter by using classic and revolutionary technologies to create your peace.",
    ],
    featured: true,
  },
  {
    name: "Luxury",
    description: "Unleash Your Imagination",
    features: [
      "Unlimited design options fuelled with exotic materials crafted in collaboration with specialized masters.",
    ],
    featured: false,
  },
]
