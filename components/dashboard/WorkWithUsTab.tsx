import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

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

interface WorkWithUsTabProps {
  applications: WorkWithUsItem[]
  applicationsLoading: boolean
  applicationsError: string | null
}

export default function WorkWithUsTab({ applications, applicationsLoading, applicationsError }: WorkWithUsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Applications (Work With Us)</CardTitle>
      </CardHeader>
      <CardContent>
        {applicationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : applicationsError ? (
          <div className="text-red-500">{applicationsError}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Cover Letter</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>{app.experience}</TableCell>
                  <TableCell>
                    {app.resume ? (
                      <a
                        href={`/uploads/resumes/${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {app.coverLetter ? (
                      <span title={app.coverLetter}>
                        {app.coverLetter.length > 30
                          ? app.coverLetter.slice(0, 30) + "..."
                          : app.coverLetter}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}