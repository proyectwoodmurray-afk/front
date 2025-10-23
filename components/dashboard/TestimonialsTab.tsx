import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"

export default function TestimonialsTab({
  testimonials,
  handleApproveTestimonial,
  handleDeleteTestimonial,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial: any) => (
              <TableRow key={testimonial._id}>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>{testimonial.quote}</TableCell>
                <TableCell>{testimonial.project}</TableCell>
                <TableCell>{testimonial.rating}/5</TableCell>
                <TableCell>
                  {testimonial.approved ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveTestimonial(testimonial._id, !testimonial.approved)}
                  >
                    {testimonial.approved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                  >
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