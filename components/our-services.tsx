"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-config"

interface Service {
  _id: string
  title: string
  description: string
  category: string
  type: string
  featured: boolean
  image: string // Usar 'image' en lugar de 'imageUrl'
}

interface OurServicesProps {
  handleQuoteRequest: (category: string, type?: string) => void
}

export function OurServices({ handleQuoteRequest }: OurServicesProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await fetchApi<Service[]>("/services")
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Imagen+no+disponible';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-amber-700 text-white px-3 py-1 rounded-full text-sm">
                      {service.category}
                    </span>
                    {service.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                        Destacado
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                    onClick={() => handleQuoteRequest(service.category, service.type)}
                  >
                    Request Quote
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No hay servicios disponibles</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}