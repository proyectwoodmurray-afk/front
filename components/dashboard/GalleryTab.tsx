import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { PlusCircle, Trash2 } from "lucide-react"

export default function GalleryTab({
  galleryItems,
  isAddGalleryModalOpen,
  setIsAddGalleryModalOpen,
  newGalleryItem,
  setNewGalleryItem,
  handleAddGalleryItem,
  handleDeleteGalleryItem,
}: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gallery Items</CardTitle>
        <Button onClick={() => setIsAddGalleryModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryItems.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Image
                    src={item.imageUrl || "/placeholder.svg?height=50&width=50"}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGalleryItem(item._id)}>
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