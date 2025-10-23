import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit2, Trash2 } from "lucide-react"

export default function ServicesTab({
  services,
  setIsAddServiceModalOpen,
  setEditingService,
  setNewService,
  setIsEditServiceModalOpen,
  handleDeleteService,
}: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services</CardTitle>
        <Button onClick={() => setIsAddServiceModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service: any) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="w-16 h-16 relative overflow-hidden rounded-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=N/A';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell>{service.featured ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingService(service)
                      setNewService((prev: any) => ({ ...prev, imageFile: null }))
                      setIsEditServiceModalOpen(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}