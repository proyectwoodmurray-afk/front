import type { CompanyInfo } from "@/hooks/useApi" // Reutilizamos la interfaz existente

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

export async function getCompanyInfoServer(): Promise<CompanyInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/company`, {
      next: { revalidate: 3600 }, // Revalidar cada hora, o según tu necesidad
    })

    if (!response.ok) {
      console.error(`Error fetching company info: ${response.statusText}`)
      return null
    }

    const data: CompanyInfo = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch company information:", error)
    return null
  }
}