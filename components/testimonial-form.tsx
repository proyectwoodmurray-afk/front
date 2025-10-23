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

export function TestimonialForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    rating: "",
    testimonial: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission - in a real implementation, this would send the data
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      projectType: "",
      rating: "",
      testimonial: "",
    })
    setIsSubmitted(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset the form after a short delay to avoid visual glitches
    setTimeout(resetForm, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-4">Thank You for Your Testimonial!</DialogTitle>
            <DialogDescription className="text-base mb-8">
              We appreciate you taking the time to share your experience with Murray & Son. Your feedback helps us
              improve and showcases our work to potential clients.
            </DialogDescription>
            <Button onClick={handleClose} className="bg-amber-700 hover:bg-amber-800">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Share Your Experience</DialogTitle>
              <DialogDescription>
                We value your feedback! Please share your experience working with Murray & Son.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => handleSelectChange("projectType", value)}
                    required
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom-home">Custom Home</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="deck">Deck/Patio</SelectItem>
                      <SelectItem value="outdoor">Outdoor Structure</SelectItem>
                      <SelectItem value="restoration">Restoration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Your Rating *</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => handleSelectChange("rating", value)}
                    required
                  >
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">★★★★★ (5/5) Excellent</SelectItem>
                      <SelectItem value="4">★★★★☆ (4/5) Very Good</SelectItem>
                      <SelectItem value="3">★★★☆☆ (3/5) Good</SelectItem>
                      <SelectItem value="2">★★☆☆☆ (2/5) Fair</SelectItem>
                      <SelectItem value="1">★☆☆☆☆ (1/5) Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial">Your Testimonial *</Label>
                <Textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleChange}
                  placeholder="Please share your experience working with Murray & Son..."
                  required
                  className="h-32"
                />
              </div>

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
                    "Submit Testimonial"
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
