import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

export default function ReservationsTab({
  reservations,
  setSelectedReservation,
  setNewReservationStatus,
  setIsUpdateReservationStatusModalOpen,
  handleDeleteReservation,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation: any) => (
              <TableRow key={reservation._id}>
                <TableCell className="font-medium">{reservation.fullName}</TableCell>
                <TableCell>{reservation.email}</TableCell>
                <TableCell>{reservation.phoneNumber}</TableCell>
                <TableCell>{reservation.projectType}</TableCell>
                <TableCell>${reservation.estimatedBudget.toLocaleString()}</TableCell>
                <TableCell>{reservation.desiredTimeline}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : reservation.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : reservation.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation)
                      setNewReservationStatus(reservation.status)
                      setIsUpdateReservationStatusModalOpen(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteReservation(reservation._id)}
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