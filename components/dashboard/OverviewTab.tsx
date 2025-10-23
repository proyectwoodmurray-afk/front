import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface OverviewTabProps {
  galleryItems: any[]
  services: any[]
  testimonials: any[]
  applications: any[]
  reservations: any[]
}

export default function OverviewTab({
  galleryItems,
  services,
  testimonials,
  reservations,
  applications
}: OverviewTabProps) {
  return (
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
          <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
          <Image src="/placeholder.svg?height=20&width=20" alt="Team Icon" width={20} height={20} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applications.length}</div>
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
  )
}