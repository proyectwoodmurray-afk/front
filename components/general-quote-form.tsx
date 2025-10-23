"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useReservation } from "@/hooks/useApi" // Import useReservation hook

export function GeneralQuoteForm({
  open,
  onOpenChange,
  initialCategory = "home-renovations",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategory?: string
}) {
  const { createReservation } = useReservation() // Use the hook

  const [formData, setFormData] = useState({
    fullName: "", // Changed from 'name'
    email: "",
    phoneNumber: "", // Changed from 'phone'
    projectAddress: "", // Changed from 'address'
    projectType: initialCategory,
    serviceLevel: "basic", // This field is not in backend schema, but kept for frontend logic
    budget: "", // This will be converted to number for backend
    timeline: "", // Changed to 'desiredTimeline' for backend
    description: "", // Changed to 'projectDescription' for backend
    dimensions: "", // This field is not in backend schema, but kept for frontend logic
    materials: "", // This field is not in backend schema, but kept for frontend logic
    preferCall: false, // This field is not in backend schema, but kept for frontend logic
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null) // State for API errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, preferCall: checked }))
  }

  const convertBudgetToNumber = (budgetString: string): number => {
    switch (budgetString) {
      case "under25k":
        return 0 // Or 25000
      case "25k-50k":
        return 25000
      case "50k-100k":
        return 50000
      case "100k-250k":
        return 100000
      case "over250k":
        return 250000
      default:
        return 0 // Default or error handling
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null) // Clear previous errors

    try {
      // Prepare data for the API, ensuring all fields match CreateReservationItem
      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        projectAddress: formData.projectAddress,
        projectType: formData.projectType,
        estimatedBudget: convertBudgetToNumber(formData.budget), // Convert to number
        desiredTimeline: formData.timeline, // Mapped to desiredTimeline
        projectDescription: formData.description, // Mapped to projectDescription
        // Removed serviceLevel, dimensions, materials, preferCall as they are not in backend schema
      }

      await createReservation(reservationData) // Call the API
      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting general quote request:", err)
      setError("Hubo un error al enviar su solicitud de cotización. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      projectAddress: "",
      projectType: initialCategory,
      serviceLevel: "basic",
      budget: "",
      timeline: "",
      description: "",
      dimensions: "",
      materials: "",
      preferCall: false,
    })
    setIsSubmitted(false)
    setError(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset the form after a short delay to avoid visual glitches
    setTimeout(resetForm, 300)
  }

  // Determinar los campos adicionales según el tipo de proyecto
  const renderAdditionalFields = () => {
    switch (formData.projectType) {
      case "home-renovations":
        return (
          <div className="space-y-2">
            <Label htmlFor="dimensions">Area to Renovate</Label>
            <Input
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="e.g. Kitchen, Bathroom, Entire House"
              className="mt-1"
            />
          </div>
        )
      case "outdoor-structures":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Project Type</Label>
              <Select value={formData.dimensions} onValueChange={(value) => handleSelectChange("dimensions", value)}>
                <SelectTrigger id="dimensions" className="mt-1">
                  <SelectValue placeholder="Select structure type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deck">Deck</SelectItem>
                  <SelectItem value="gazebo">Gazebo</SelectItem>
                  <SelectItem value="fence">Fence</SelectItem>
                  <SelectItem value="cement">Cement Work</SelectItem>
                  <SelectItem value="shed">Shed</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">Preferred Materials</Label>
              <Input
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="e.g. Cedar, Pressure Treated, Metal"
                className="mt-1"
              />
            </div>
          </>
        )
      case "custom":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Custom Type</Label>
              <Select value={formData.dimensions} onValueChange={(value) => handleSelectChange("dimensions", value)}>
                <SelectTrigger id="dimensions" className="mt-1">
                  <SelectValue placeholder="Select custom type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="finishing">Finishing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "demolition":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Structure Type</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. Garage, Shed, Interior Wall"
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Building Project</Label>
              <p className="text-sm text-muted-foreground">
                Note: Demolition services are exclusively offered in addition to building projects.
              </p>
            </div>
          </>
        )
      default:
        return null
    }
  }

  // Obtener el título según el tipo de proyecto
  const getProjectTitle = () => {
    const titleMap: Record<string, string> = {
      "home-renovations": "Home Renovations",
      "outdoor-structures": "Outdoor Structures",
      custom: "Custom Project",
      demolition: "Demolition",
    }
    return `${titleMap[formData.projectType] || "Project"} Quote Request`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-4">Quote Request Submitted!</DialogTitle>
            <DialogDescription className="text-base mb-8">
              Thank you for your interest in Murray & Son. We'll review your project details and get back to you within
              1-2 business days.
            </DialogDescription>
            <Button onClick={handleClose} className="bg-amber-700 hover:bg-amber-800">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{getProjectTitle()}</DialogTitle>
              <DialogDescription>
                Fill out the form below to get a personalized quote for your project.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Service Level Tabs */}
              <Tabs
                defaultValue={formData.serviceLevel}
                onValueChange={(value) => handleSelectChange("serviceLevel", value)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="basic">BASIC</TabsTrigger>
                  <TabsTrigger value="better">BETTER</TabsTrigger>
                  <TabsTrigger value="luxury">LUXURY</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="pt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium text-foreground">Simple & Functional: Built to Last</p>
                    <p>Affordable quality without the hassle.</p>
                  </div>
                </TabsContent>
                <TabsContent value="better" className="pt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium text-foreground">Optimized to Suit You</p>
                    <p>
                      Customize the things that matter by using classic and revolutionary technologies to create your
                      peace.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="luxury" className="pt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium text-foreground">Unleash Your Imagination</p>
                    <p>
                      Unlimited design options fuelled with exotic materials crafted in collaboration with specialized
                      masters.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectAddress">Project Address</Label>
                  <Input
                    id="projectAddress"
                    name="projectAddress"
                    value={formData.projectAddress}
                    onChange={handleChange}
                    placeholder="123 Main St, Toronto, ON"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Type *</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-renovations">Home Renovations</SelectItem>
                    <SelectItem value="outdoor-structures">Outdoor Structures</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="demolition">Demolition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos adicionales según el tipo de proyecto */}
              {renderAdditionalFields()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="over250k">Over $250,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Desired Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleSelectChange("timeline", value)}>
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6-12months">6-12 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide details about your project, including size, special requirements, or any other relevant information..."
                  required
                  className="h-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="preferCall" checked={formData.preferCall} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="preferCall" className="cursor-pointer">
                  Prefer phone call
                </Label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Quote"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
