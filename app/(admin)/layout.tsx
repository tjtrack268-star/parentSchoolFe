"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getRole } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth/login")
    } else if (getRole() !== "ADMIN") {
      router.replace("/dashboard")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ef]">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  return <>{children}</>
}
