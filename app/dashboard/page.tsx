"use client"

import { uploadImageToGallery } from '@/lib/upload-helper'
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Loader2, PlusCircle, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react"
import {
  useAuth,
  useGallery,
  useServices,
  useTestimonials,
  useCompanyInfo,
  useReservation,
  useImageUpload,
  type GalleryItem,
  type ServiceItem,
  type TestimonialItem,
  type CompanyInfo,
  type ReservationItem,
} from "@/hooks/useApi"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
// Importa tus componentes de tabs
import GalleryTab from "@/components/dashboard/GalleryTab"
import ServicesTab from "@/components/dashboard/ServicesTab"
import CompanyInfoTab from "@/components/dashboard/CompanyInfoTab"
import ReservationsTab from "@/components/dashboard/ReservationsTab"
import TestimonialsTab from "@/components/dashboard/TestimonialsTab"
import WorkWithUsTab from "@/components/dashboard/WorkWithUsTab"

// Importa los componentes de dialogo
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const { getGalleryItems, createGalleryItem, deleteGalleryItem } = useGallery()
  const { getAllServices, createService, updateService, deleteService } = useServices()
  const { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, approveTestimonial } = useTestimonials()
  const { getCompanyInfo, updateCompanyInfo } = useCompanyInfo()
  const { getAllReservations, updateReservationStatus, deleteReservation } = useReservation()
  const { uploadImage } = useImageUpload()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("overview")
  const [dataLoading, setDataLoading] = useState(true)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [reservations, setReservations] = useState<ReservationItem[]>([])

  // Modals states
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false)
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false)
  const [isEditCompanyInfoModalOpen, setIsEditCompanyInfoModalOpen] = useState(false)
  const [isUpdateReservationStatusModalOpen, setIsUpdateReservationStatusModalOpen] = useState(false)

  // Form states for adding/editing
  const [newGalleryItem, setNewGalleryItem] = useState({ title: "", description: "", image: null as File | null })
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageFile: null as File | null,
    featured: false,
    category: "construction" as ServiceItem["category"],
    type: "basic" as ServiceItem["type"],
  })
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [editingCompanyInfo, setEditingCompanyInfo] = useState<CompanyInfo | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<ReservationItem | null>(null)
  const [newReservationStatus, setNewReservationStatus] = useState("")

  type WorkWithUsItem = {
    _id: string
    name: string
    email: string
    phone: string
    position: string
    experience: string
    resume?: string
    coverLetter?: string
    createdAt?: string
  }

  // Estado para postulaciones
  const [applications, setApplications] = useState<WorkWithUsItem[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)

  // Lógica para cargar postulaciones
  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true)
    try {
      const res = await fetch("/api/workwithus") // O usa fetchApi("/workwithus") si tienes fetchApi configurado
      const data = await res.json()
      setApplications(data)
      setApplicationsError(null)
    } catch (err: any) {
      setApplications([])
      setApplicationsError(err.message || "Error loading applications")
    } finally {
      setApplicationsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push("/auth/login")
    }
  }, [authLoading, isAuthenticated, router])

  const fetchData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [galleryData, servicesData, testimonialsData, companyInfoData, reservationsData] =
        await Promise.all([
          getGalleryItems(),
          getAllServices(),
          getAllTestimonials(),
          getCompanyInfo(),
          getAllReservations(),
        ])
      setGalleryItems(galleryData)
      setServices(servicesData)
      setTestimonials(testimonialsData)
      setCompanyInfo(companyInfoData)
      setReservations(reservationsData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setDataLoading(false)
    }
  }, [getGalleryItems, getAllServices, getAllTestimonials, getCompanyInfo, getAllReservations])

  useEffect(() => {
    if (isAuthenticated()) {
      fetchData()
    }
  }, [isAuthenticated, fetchData])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  // Gallery Handlers
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGalleryItem.image) {
      alert("Please select an image for the gallery item.")
      return
    }
    setDataLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", newGalleryItem.title)
      formData.append("description", newGalleryItem.description)
      formData.append("image", newGalleryItem.image)
      await createGalleryItem(formData)
      setNewGalleryItem({ title: "", description: "", image: null })
      setIsAddGalleryModalOpen(false)
      await fetchData()
    } catch (error) {
      console.error("Error adding gallery item:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return
    setDataLoading(true)
    try {
      await deleteGalleryItem(id)
      await fetchData()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
    } finally {
      setDataLoading(false)
    }
  }

  // Service Handlers
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newService.imageFile) {
      alert("Please select an image for the service.")
      return
    }
    setDataLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", newService.title)
      formData.append("description", newService.description)
      formData.append("image", newService.imageFile)
      formData.append("featured", String(newService.featured))
      formData.append("category", newService.category)
      formData.append("type", newService.type)
      await createService(formData)
      setNewService({
        title: "",
        description: "",
        imageUrl: "",
        imageFile: null,
        featured: false,
        category: "construction",
        type: "basic",
      })
      setIsAddServiceModalOpen(false)
      await fetchData()
    } catch (error) {
      console.error("Error adding service:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return
    setDataLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', editingService.title)
      formData.append('description', editingService.description)
      formData.append('category', editingService.category)
      formData.append('type', editingService.type)
      formData.append('featured', String(editingService.featured))
      if (newService.imageFile) {
        formData.append('image', newService.imageFile)
      }
      await updateService(editingService._id, formData)
      setEditingService(null)
      setNewService((prev) => ({ ...prev, imageFile: null }))
      setIsEditServiceModalOpen(false)
      await fetchData()
    } catch (error) {
      console.error("Error updating service:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    setDataLoading(true)
    try {
      await deleteService(id)
      await fetchData()
    } catch (error) {
      console.error("Error deleting service:", error)
    } finally {
      setDataLoading(false)
    }
  }

  // Testimonial Handlers
  const handleApproveTestimonial = async (id: string, approved: boolean) => {
    setDataLoading(true)
    try {
      await approveTestimonial(id, approved)
      await fetchData()
    } catch (error) {
      console.error("Error approving testimonial:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    setDataLoading(true)
    try {
      await deleteTestimonial(id)
      await fetchData()
    } catch (error) {
      console.error("Error deleting testimonial:", error)
    } finally {
      setDataLoading(false)
    }
  }

  // Company Info Handlers
  const handleEditCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCompanyInfo) return
    setDataLoading(true)
    try {
      const cleanCompanyInfo = {
        name: editingCompanyInfo.name,
        tagline: editingCompanyInfo.tagline,
        description: editingCompanyInfo.description,
        address: editingCompanyInfo.address,
        phone: editingCompanyInfo.phone,
        email: editingCompanyInfo.email,
        hours: editingCompanyInfo.hours,
        socialMedia: editingCompanyInfo.socialMedia
      };
      await updateCompanyInfo(cleanCompanyInfo);
      setIsEditCompanyInfoModalOpen(false)
      await fetchData()
    } catch (error) {
      console.error("Error updating company info:", error)
    } finally {
      setDataLoading(false)
    }
  }

  // Reservation Handlers
  const handleUpdateReservationStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReservation || !newReservationStatus) return
    setDataLoading(true)
    try {
      await updateReservationStatus(selectedReservation._id, newReservationStatus)
      setIsUpdateReservationStatusModalOpen(false)
      setSelectedReservation(null)
      setNewReservationStatus("")
      await fetchData()
    } catch (error) {
      console.error("Error updating reservation status:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return
    setDataLoading(true)
    try {
      await deleteReservation(id)
      await fetchData()
    } catch (error) {
      console.error("Error deleting reservation:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("overview")}>Overview</Button>
          <Button variant={activeTab === "gallery" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("gallery")}>Gallery</Button>
          <Button variant={activeTab === "services" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("services")}>Services</Button>
          <Button variant={activeTab === "testimonials" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("testimonials")}>Testimonials</Button>
          <Button variant={activeTab === "company-info" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("company-info")}>Company Info</Button>
          <Button variant={activeTab === "reservations" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("reservations")}>Reservations</Button>
          <Button variant={activeTab === "workwithus" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("workwithus")}>Work With Us</Button>
          <Button variant="outline" className="w-full justify-start mt-auto" onClick={handleLogout}>Logout</Button>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs value={activeTab}>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gallery Items</CardTitle>
                    <Image src="/placeholder.svg?height=20&width=20" alt="Gallery Icon" width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{galleryItems.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    <Image src="/placeholder.svg?height=20&width=20" alt="Services Icon" width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{services.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
                    <Image src="/placeholder.svg?height=20&width=20" alt="Testimonials Icon" width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testimonials.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                    <Image src="/placeholder.svg?height=20&width=20" alt="Reservations Icon" width={20} height={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reservations.length}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryTab
                galleryItems={galleryItems}
                isAddGalleryModalOpen={isAddGalleryModalOpen}
                setIsAddGalleryModalOpen={setIsAddGalleryModalOpen}
                newGalleryItem={newGalleryItem}
                setNewGalleryItem={setNewGalleryItem}
                handleAddGalleryItem={handleAddGalleryItem}
                handleDeleteGalleryItem={handleDeleteGalleryItem}
              />
            </TabsContent>

            <TabsContent value="services">
              <ServicesTab
                services={services}
                setIsAddServiceModalOpen={setIsAddServiceModalOpen}
                setEditingService={setEditingService}
                setNewService={setNewService}
                setIsEditServiceModalOpen={setIsEditServiceModalOpen}
                handleDeleteService={handleDeleteService}
              />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsTab
                testimonials={testimonials}
                handleApproveTestimonial={handleApproveTestimonial}
                handleDeleteTestimonial={handleDeleteTestimonial}
              />
            </TabsContent>

            <TabsContent value="company-info">
              <CompanyInfoTab
                companyInfo={companyInfo}
                setEditingCompanyInfo={setEditingCompanyInfo}
                setIsEditCompanyInfoModalOpen={setIsEditCompanyInfoModalOpen}
              />
            </TabsContent>

            <TabsContent value="reservations">
              <ReservationsTab
                reservations={reservations}
                setSelectedReservation={setSelectedReservation}
                setNewReservationStatus={setNewReservationStatus}
                setIsUpdateReservationStatusModalOpen={setIsUpdateReservationStatusModalOpen}
                handleDeleteReservation={handleDeleteReservation}
              />
            </TabsContent>

            <TabsContent value="workwithus">
              <WorkWithUsTab
                applications={applications}
                applicationsLoading={applicationsLoading}
                applicationsError={applicationsError}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Gallery Item Modal */}
      <Dialog open={isAddGalleryModalOpen} onOpenChange={setIsAddGalleryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Gallery Item</DialogTitle>
            <DialogDescription>Fill in the details for the new gallery item.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGalleryItem} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={newGalleryItem.title}
                onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={newGalleryItem.description}
                onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gallery-image">Image</Label>
              <Input
                id="gallery-image"
                type="file"
                accept="image/*"
                onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.files?.[0] || null })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddGalleryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={dataLoading}>
                {dataLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Fill in the details for the new service.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service-title">Title</Label>
              <Input
                id="service-title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-category">Category</Label>
              <Select
                value={newService.category}
                onValueChange={(value) => setNewService({ ...newService, category: value as ServiceItem["category"] })}
              >
                <SelectTrigger id="service-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="demolition">Demolition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-type">Type</Label>
              <Select
                value={newService.type}
                onValueChange={(value) => setNewService({ ...newService, type: value as ServiceItem["type"] })}
              >
                <SelectTrigger id="service-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="better">Better</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-image">Image</Label>
              <Input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={(e) => setNewService({ ...newService, imageFile: e.target.files?.[0] || null })}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="service-featured"
                checked={newService.featured}
                onChange={(e) => setNewService({ ...newService, featured: e.target.checked })}
              />
              <Label htmlFor="service-featured">Featured Service</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={dataLoading}>
                {dataLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditServiceModalOpen} onOpenChange={setIsEditServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the details for the service.</DialogDescription>
          </DialogHeader>
          {editingService && (
            <form onSubmit={handleEditService} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-service-title">Title</Label>
                <Input
                  id="edit-service-title"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-service-description">Description</Label>
                <Textarea
                  id="edit-service-description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-service-category">Category</Label>
                <Select
                  value={editingService.category}
                  onValueChange={(value) =>
                    setEditingService({ ...editingService, category: value as ServiceItem["category"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="demolition">Demolition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-service-type">Type</Label>
                <Select
                  value={editingService.type}
                  onValueChange={(value) =>
                    setEditingService({ ...editingService, type: value as ServiceItem["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="better">Better</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-service-image">Image (Leave blank to keep current)</Label>
                <Input
                  id="edit-service-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewService({ ...newService, imageFile: e.target.files?.[0] || null })}
                />
                {editingService.image && (
                  <div className="mt-2">
                    <img
                      src={editingService.image}
                      alt="Current Service Image"
                      className="w-32 h-24 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/128x96/e5e7eb/6b7280?text=Error';
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                {newService.imageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(newService.imageFile)}
                      alt="New image preview"
                      className="w-32 h-24 object-cover rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">New image selected</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-service-featured"
                  checked={Boolean(editingService.featured)}
                  onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                />
                <Label htmlFor="edit-service-featured">Featured Service</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditServiceModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={dataLoading}>
                  {dataLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Service"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      

      {/* Edit Company Info Modal */}
      <Dialog open={isEditCompanyInfoModalOpen} onOpenChange={setIsEditCompanyInfoModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company Information</DialogTitle>
            <DialogDescription>Update your company's general information.</DialogDescription>
          </DialogHeader>
          {editingCompanyInfo && (
            <form onSubmit={handleEditCompanyInfo} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={editingCompanyInfo.name}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-tagline">Tagline</Label>
                <Input
                  id="company-tagline"
                  value={editingCompanyInfo.tagline}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, tagline: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-description">Description</Label>
                <Textarea
                  id="company-description"
                  value={editingCompanyInfo.description}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={editingCompanyInfo.email}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-phone">Phone</Label>
                <Input
                  id="company-phone"
                  type="tel"
                  value={editingCompanyInfo.phone}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-address">Address</Label>
                <Input
                  id="company-address"
                  value={editingCompanyInfo.address}
                  onChange={(e) => setEditingCompanyInfo({ ...editingCompanyInfo, address: e.target.value })}
                  required
                />
              </div>
              <h3 className="font-semibold mt-4">Social Media</h3>
              <div className="grid gap-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  value={editingCompanyInfo.socialMedia?.facebook || ""}
                  onChange={(e) =>
                    setEditingCompanyInfo({
                      ...editingCompanyInfo,
                      socialMedia: { ...editingCompanyInfo.socialMedia, facebook: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  value={editingCompanyInfo.socialMedia?.instagram || ""}
                  onChange={(e) =>
                    setEditingCompanyInfo({
                      ...editingCompanyInfo,
                      socialMedia: { ...editingCompanyInfo.socialMedia, instagram: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="social-twitter">Twitter</Label>
                <Input
                  id="social-twitter"
                  value={editingCompanyInfo.socialMedia?.twitter || ""}
                  onChange={(e) =>
                    setEditingCompanyInfo({
                      ...editingCompanyInfo,
                      socialMedia: { ...editingCompanyInfo.socialMedia, twitter: e.target.value },
                    })
                  }
                />
              </div>
              <h3 className="font-semibold mt-4">Business Hours</h3>
              {Object.entries(editingCompanyInfo.hours).map(([day, hours]) => (
                <div className="grid gap-2" key={day}>
                  <Label htmlFor={`hours-${day}`}>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                  <Input
                    id={`hours-${day}`}
                    value={hours}
                    onChange={(e) =>
                      setEditingCompanyInfo({
                        ...editingCompanyInfo,
                        hours: { ...editingCompanyInfo.hours, [day]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCompanyInfoModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={dataLoading}>
                  {dataLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Reservation Status Modal */}
      <Dialog open={isUpdateReservationStatusModalOpen} onOpenChange={setIsUpdateReservationStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Reservation Status</DialogTitle>
            <DialogDescription>Change the status for the selected reservation.</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <form onSubmit={handleUpdateReservationStatus} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reservation-status">Current Status: {selectedReservation.status}</Label>
                <Select value={newReservationStatus} onValueChange={setNewReservationStatus}>
                  <SelectTrigger id="reservation-status">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUpdateReservationStatusModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={dataLoading}>
                  {dataLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Status"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
