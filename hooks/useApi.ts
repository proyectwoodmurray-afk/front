"use client"

import { fetchApi } from "@/lib/api-config"
import { useState, useEffect, useCallback } from "react"

// Define tipos para las respuestas de la API y los datos del usuario
export interface AuthResponse {
  access_token: string
  // Si tu endpoint de login devuelve más datos, añádelos aquí
}

export interface User {
  _id: string
  email: string
  role: string
  // Añade otras propiedades del usuario de tu esquema si son necesarias
}

// Interfaces para Galería, Servicios, Testimonios, Equipo, Información de la Empresa
export interface GalleryItem {
  _id: string
  title: string
  description: string
  imageUrl: string
}

export interface CreateGalleryItem extends Omit<GalleryItem, "_id"> {}

export interface ServiceItem {
  _id: string
  title: string
  description: string
  imageUrl: string
  featured: boolean
  category: "construction" | "update" | "demolition" // Added category
  type: "basic" | "better" | "luxury" // Added type
}

// Updated: CreateServiceItem now expects imageUrl string, not File
export interface CreateServiceItem extends Omit<ServiceItem, "_id"> {}

export interface TestimonialItem {
  _id: string
  name: string
  quote: string
  project: string
  rating: number
  approved: boolean
}

export interface TeamMember {
  _id: string
  name: string
  position: string
  bio: string
  imageUrl: string
}

// Updated: CreateTeamMember now expects imageUrl string, not File
export interface CreateTeamMember extends Omit<TeamMember, "_id"> {}

// Updated: CompanyInfo interface to match backend schema and include timestamps
export interface CompanyInfo {
  _id: string
  name: string
  tagline: string
  description: string
  address: string
  phone: string
  email: string
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  createdAt?: string // Added timestamp
  updatedAt?: string // Added timestamp
}

export interface UpdateCompanyInfo extends Partial<CompanyInfo> {}

export interface ReservationItem {
  _id: string
  fullName: string // Matches backend schema
  email: string
  phoneNumber: string // Matches backend schema
  projectAddress: string // Matches backend schema
  projectType: string
  estimatedBudget: number // Matches backend schema
  desiredTimeline: string // Matches backend schema
  projectDescription: string // Matches backend schema
  status: string // e.g., "pending", "approved", "completed", "cancelled"
  createdAt: string // Assuming your backend adds this
  updatedAt: string // Assuming your backend adds this
}

// Updated to match backend schema exactly
export interface CreateReservationItem extends Omit<ReservationItem, "_id" | "status" | "createdAt" | "updatedAt"> {}

// New: Interfaces for Contact
export interface ContactMessage {
  _id: string
  name: string
  email: string
  phone?: string
  reason: string
  message: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactMessage {
  name: string
  email: string
  phone?: string
  reason: string
  message: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("token")
    }
    return null
  }, [])

  const isAuthenticated = useCallback(() => {
    return !!getToken()
  }, [getToken])

  const login = useCallback(async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await fetchApi<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
      if (typeof window !== "undefined" && response.access_token) {
        window.localStorage.setItem("token", response.access_token)
      }
      return response
    } catch (error) {
      console.error("Fallo en el login:", error)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token")
    }
    setUser(null)
    console.log("useAuth: User logged out.")
  }, [])

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    if (!isAuthenticated()) {
      console.log("getCurrentUser: Not authenticated, returning null.")
      return null
    }
    try {
      console.log("getCurrentUser: Fetching profile...")
      // Asumiendo que la respuesta de /auth/profile es { message: string; user: User }
      const userData = await fetchApi<{ message: string; user: User }>("/auth/profile", { method: "GET" })
      setUser(userData.user) // Correctly set the nested user object
      console.log("getCurrentUser: Profile fetched successfully:", userData.user)
      return userData.user
    } catch (error) {
      console.error("getCurrentUser: Failed to get current user:", error)
      logout() // Cerrar sesión si el token es inválido o ha expirado
      throw error
    }
  }, [isAuthenticated, logout])

  useEffect(() => {
    const loadAuthStatus = async () => {
      console.log("useAuth useEffect: Starting auth status check.")
      setLoading(true) // Ensure loading is true at the start of the check
      try {
        const currentUserData = await getCurrentUser() // This will set the user state internally
        if (currentUserData) {
          console.log("useAuth useEffect: User is authenticated and data loaded:", currentUserData)
        } else {
          console.log("useAuth useEffect: User is not authenticated or profile fetch failed.")
        }
      } catch (error) {
        console.error("useAuth useEffect: Error during initial auth check:", error)
      } finally {
        setLoading(false)
        console.log("useAuth useEffect: Finished auth status check. Loading set to false.")
      }
    }
    loadAuthStatus()
  }, [getCurrentUser])

  return { user, loading, login, logout, isAuthenticated, getCurrentUser }
}

export function useGallery() {
  const getGalleryItems = useCallback(async (): Promise<GalleryItem[]> => {
    try {
      // Conectar con el endpoint GET /gallery de tu API
      const data = await fetchApi<GalleryItem[]>("/gallery", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      throw error
    }
  }, [])

  const createGalleryItem = useCallback(async (formData: FormData): Promise<GalleryItem> => {
    try {
      // Conectar con el endpoint POST /gallery de tu API
      // fetchApi se encargará de añadir el token JWT si está configurado
      const createdItem = await fetchApi<GalleryItem>("/gallery", {
        method: "POST",
        body: formData, // FormData se envía directamente, fetchApi lo manejará como multipart/form-data
      })
      return createdItem
    } catch (error) {
      console.error("Error creating gallery item:", error)
      throw error
    }
  }, [])

  // NOTA: Según tu gallery.controller.ts, no hay un endpoint para actualizar (PUT/PATCH)
  // Si necesitas esta funcionalidad, deberás añadirla en tu backend NestJS.
  // Por ahora, esta función no hará una llamada a la API real.
  const updateGalleryItem = useCallback(async (_id: string, formData: FormData): Promise<GalleryItem> => {
    console.warn(
      "updateGalleryItem: No hay un endpoint de API para actualizar la galería. Simulación de actualización.",
    )
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simular retraso
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const imageUrl = formData.get("imageUrl") as string // Asume que la URL de la imagen se pasa si no se sube una nueva
    return { _id, title, description, imageUrl } // Devuelve el item actualizado simulado
  }, [])

  const deleteGalleryItem = useCallback(async (_id: string): Promise<void> => {
    try {
      // Conectar con el endpoint DELETE /gallery/:id de tu API
      await fetchApi<void>(`/gallery/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted gallery item with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting gallery item with ID: ${_id}`, error)
      throw error
    }
  }, [])

  return { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem }
}

export function useServices() {
  const getAllServices = useCallback(async (): Promise<ServiceItem[]> => {
    try {
      const data = await fetchApi<ServiceItem[]>("/services", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching services:", error)
      throw error
    }
  }, [])

  // Cambia esto para aceptar FormData
  const createService = useCallback(async (formData: FormData): Promise<ServiceItem> => {
    try {
      const createdService = await fetchApi<ServiceItem>("/services", {
        method: "POST",
        body: formData, // ✅ Envía FormData directamente
        // NO pongas headers Content-Type aquí
      })
      return createdService
    } catch (error) {
      console.error("Error creating service:", error)
      throw error
    }
  }, [])

  // Updated: updateService now accepts Partial<ServiceItem> (JSON)
  const updateService = useCallback(async (_id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> => {
    try {
      const updatedService = await fetchApi<ServiceItem>(`/services/${_id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
      return updatedService
    } catch (error) {
      console.error("Error updating service:", error)
      throw error
    }
  }, [])

  const deleteService = useCallback(async (_id: string): Promise<void> => {
    try {
      await fetchApi<void>(`/services/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted service with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting service with ID: ${_id}`, error)
      throw error
    }
  }, [])

  return { getAllServices, createService, updateService, deleteService }
}

export function useTestimonials() {
  const getAllTestimonials = useCallback(async (): Promise<TestimonialItem[]> => {
    try {
      const data = await fetchApi<TestimonialItem[]>("/testimonials", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      throw error
    }
  }, [])

  const createTestimonial = useCallback(async (testimonial: Omit<TestimonialItem, "_id">): Promise<TestimonialItem> => {
    try {
      const createdTestimonial = await fetchApi<TestimonialItem>("/testimonials", {
        method: "POST",
        body: JSON.stringify(testimonial),
      })
      return createdTestimonial
    } catch (error) {
      console.error("Error creating testimonial:", error)
      throw error
    }
  }, [])

  const updateTestimonial = useCallback(
    async (_id: string, updates: Partial<TestimonialItem>): Promise<TestimonialItem> => {
      try {
        const updatedTestimonial = await fetchApi<TestimonialItem>(`/testimonials/${_id}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        })
        return updatedTestimonial
      } catch (error) {
        console.error("Error updating testimonial:", error)
        throw error
      }
    },
    [],
  )

  const deleteTestimonial = useCallback(async (_id: string): Promise<void> => {
    try {
      // Using the 'remove' endpoint as per your controller
      await fetchApi<void>(`/testimonials/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted testimonial with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting testimonial with ID: ${_id}`, error)
      throw error
    }
  }, [])

  const approveTestimonial = useCallback(
    async (_id: string, approved: boolean): Promise<TestimonialItem> => {
      // This function will now use the updateTestimonial API call
      return updateTestimonial(_id, { approved })
    },
    [updateTestimonial],
  )

  return { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial }
}

export function useTeam() {
  const getAllMembers = useCallback(async (): Promise<TeamMember[]> => {
    try {
      const data = await fetchApi<TeamMember[]>("/team", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching team members:", error)
      throw error
    }
  }, [])

  // Updated: createMember now accepts CreateTeamMember (JSON)
  const createMember = useCallback(async (memberData: CreateTeamMember): Promise<TeamMember> => {
    try {
      const createdMember = await fetchApi<TeamMember>("/team", {
        method: "POST",
        body: JSON.stringify(memberData), // Sending JSON
      })
      return createdMember
    } catch (error) {
      console.error("Error creating team member:", error)
      throw error
    }
  }, [])

  // Updated: updateMember now accepts Partial<TeamMember> (JSON)
  const updateMember = useCallback(async (_id: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const updatedMember = await fetchApi<TeamMember>(`/team/${_id}`, {
        method: "PUT",
        body: JSON.stringify(updates), // Sending JSON
      })
      return updatedMember
    } catch (error) {
      console.error("Error updating team member:", error)
      throw error
    }
  }, [])

  const deleteMember = useCallback(async (_id: string): Promise<void> => {
    try {
      // Using the 'remove' endpoint as per your controller
      await fetchApi<void>(`/team/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted team member with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting team member with ID: ${_id}`, error)
      throw error
    }
  }, [])

  return { getAllMembers, createMember, updateMember, deleteMember }
}

export function useCompanyInfo() {
  const getCompanyInfo = useCallback(async (): Promise<CompanyInfo> => {
    try {
      // Fetch real company info from the backend
      const data = await fetchApi<CompanyInfo>("/company", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching company info:", error)
      throw error
    }
  }, [])

  const updateCompanyInfo = useCallback(async (info: CompanyInfo): Promise<CompanyInfo> => {
    try {
      // Send updated company info to the backend
      const updatedInfo = await fetchApi<CompanyInfo>("/company", {
        method: "PUT",
        body: JSON.stringify(info),
      })
      return updatedInfo
    } catch (error) {
      console.error("Error updating company info:", error)
      throw error
    }
  }, [])

  return { getCompanyInfo, updateCompanyInfo }
}

export function useReservation() {
  const createReservation = useCallback(async (reservationData: CreateReservationItem): Promise<ReservationItem> => {
    try {
      const createdReservation = await fetchApi<ReservationItem>("/reservation", {
        method: "POST",
        body: JSON.stringify(reservationData),
      })
      return createdReservation
    } catch (error) {
      console.error("Error creating reservation:", error)
      throw error
    }
  }, [])

  const getAllReservations = useCallback(async (): Promise<ReservationItem[]> => {
    try {
      const data = await fetchApi<ReservationItem[]>("/reservation", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching reservations:", error)
      throw error
    }
  }, [])

  const updateReservationStatus = useCallback(async (_id: string, status: string): Promise<ReservationItem> => {
    try {
      const updatedReservation = await fetchApi<ReservationItem>(`/reservation/${_id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
      return updatedReservation
    } catch (error) {
      console.error("Error updating reservation status:", error)
      throw error
    }
  }, [])

  const deleteReservation = useCallback(async (_id: string): Promise<void> => {
    try {
      await fetchApi<void>(`/reservation/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted reservation with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting reservation with ID: ${_id}`, error)
      throw error
    }
  }, [])

  return { createReservation, getAllReservations, updateReservationStatus, deleteReservation }
}

// New hook for image uploads
export function useImageUpload() {
  const uploadImage = useCallback(async (file: File): Promise<{ imageUrl: string }> => {
    try {
      const formData = new FormData()
      formData.append("image", file) // Assuming backend expects 'image' field for file upload
      const data = await fetchApi<{ imageUrl: string }>("/cloudinary/upload", {
        method: "POST",
        body: formData,
      })
      return data
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }, [])
  return { uploadImage }
}

// New hook for Contact messages
export function useContact() {
  const createContactMessage = useCallback(async (messageData: CreateContactMessage): Promise<ContactMessage> => {
    try {
      const createdMessage = await fetchApi<ContactMessage>("/contact", {
        method: "POST",
        body: JSON.stringify(messageData),
      })
      return createdMessage
    } catch (error) {
      console.error("Error creating contact message:", error)
      throw error
    }
  }, [])

  const getAllContactMessages = useCallback(async (): Promise<ContactMessage[]> => {
    try {
      const data = await fetchApi<ContactMessage[]>("/contact", { method: "GET" })
      return data
    } catch (error) {
      console.error("Error fetching contact messages:", error)
      throw error
    }
  }, [])

  const deleteContactMessage = useCallback(async (_id: string): Promise<void> => {
    try {
      await fetchApi<void>(`/contact/${_id}`, {
        method: "DELETE",
      })
      console.log(`Successfully deleted contact message with ID: ${_id}`)
    } catch (error) {
      console.error(`Error deleting contact message with ID: ${_id}`, error)
      throw error
    }
  }, [])

  return { createContactMessage, getAllContactMessages, deleteContactMessage }
}
