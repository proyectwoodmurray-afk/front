"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Cuando cambia la ruta o los parámetros de búsqueda, hacer scroll al inicio de la página
    window.scrollTo(0, 0)
  }, [pathname, searchParams])

  return null
}
