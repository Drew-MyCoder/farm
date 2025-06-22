"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { UpdateCoopForm } from "@/app/dashboard/coops/components/update-coop-form"


interface Coop {
  id: string
  total_fowls: number
  total_dead_fowls: number
  total_feed: number
  coop_name: string
}

export default function EditCoopPage() {
  const params = useParams()
  const router = useRouter()
  const [coop, setCoop] = useState<Coop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const id = params.id as string

  useEffect(() => {
    async function fetchCoop() {
      try {
        setLoading(true)
        setTimeout(() => {
          const mockCoop = {
            id,
            total_fowls: 120,
            total_dead_fowls: 3,
            total_feed: 45.5,
            coop_name: `Coop ${id.toUpperCase()}`,
          }
          setCoop(mockCoop)
          setLoading(false)
        }, 1)
      } catch (err) {
        console.error("Error fetching coop:", err)
        setError("Failed to load coop data. Please try again.")
        setLoading(false)
      }
    }

    if (id) {
      fetchCoop()
    }
  }, [id])

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Coop" text="Update coop information and statistics." />

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Update Coops</CardTitle>
          </CardHeader>
          <CardContent>
            {coop && (
              <UpdateCoopForm coopId={id} initialData={coop} onSuccess={() => router.push("/dashboard/coops")} />
            )}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}

