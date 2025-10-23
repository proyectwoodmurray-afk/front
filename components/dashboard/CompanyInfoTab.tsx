import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"

export default function CompanyInfoTab({
  companyInfo,
  setEditingCompanyInfo,
  setIsEditCompanyInfoModalOpen,
}: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Company Information</CardTitle>
        <Button
          onClick={() => {
            setEditingCompanyInfo(companyInfo)
            setIsEditCompanyInfoModalOpen(true)
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" /> Edit Info
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <h3 className="font-semibold">Name:</h3>
          <p>{companyInfo?.name}</p>
        </div>
        <div>
          <h3 className="font-semibold">Tagline:</h3>
          <p>{companyInfo?.tagline}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description:</h3>
          <p>{companyInfo?.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Email:</h3>
          <p>{companyInfo?.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone:</h3>
          <p>{companyInfo?.phone}</p>
        </div>
        <div>
          <h3 className="font-semibold">Address:</h3>
          <p>{companyInfo?.address}</p>
        </div>
        <div>
          <h3 className="font-semibold">Social Media:</h3>
          <p>Facebook: {companyInfo?.socialMedia?.facebook}</p>
          <p>Instagram: {companyInfo?.socialMedia?.instagram}</p>
          <p>Twitter: {companyInfo?.socialMedia?.twitter}</p>
        </div>
        <div>
          <h3 className="font-semibold">Hours:</h3>
          {companyInfo &&
            Object.entries(companyInfo.hours).map(([day, hours]) => (
              <p key={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}: {hours}
              </p>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}