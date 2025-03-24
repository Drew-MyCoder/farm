"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Plus } from "lucide-react"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { getCoops } from "@/lib/actions/auth"

interface EggRecord {
  id: string
  coopId: string
  coop_name: string
  collection_date: string
  egg_count: number
  broken_eggs: number
  total_feed: number
  notes: string
}

export default function EggsPage() {
  const [eggRecords, setEggRecords] = useState<EggRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchEggRecords() {
      try {
      setLoading(true);
      const response = await getCoops();  // Ensure getCoops() returns an array
      setEggRecords(Array.isArray(response) ? response : []);  // Ensure it's an array
    } catch (err) {
      console.error("Error fetching egg records:", err);
      setError("Failed to load egg collection records. Please try again.");
      setEggRecords([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }

    fetchEggRecords()
  }, [])

  // Calculate efficiency (eggs collected vs broken)
  const calculateEfficiency = (collected: number, broken: number) => {
    if (collected === 0) return 0
    return ((collected - broken) / collected) * 100
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Egg Collection Records" text="View and manage daily egg collection data.">
        <Link href="/dashboard/eggs/update">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record New Collection
          </Button>
        </Link>
      </DashboardHeader>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : eggRecords.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nothing to show</CardTitle>
            <CardDescription>No egg collection records available.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4 text-muted-foreground">
              Start by recording your first collection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Egg Collections</CardTitle>
            <CardDescription>Showing the most recent egg collection records across all coops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Coop</TableHead>
                  <TableHead className="text-right">Eggs Collected</TableHead>
                  <TableHead className="text-right">Broken Eggs</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                  <TableHead className="text-right">Feed (kg)</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eggRecords.map((record) => {
                  const efficiency = calculateEfficiency(record.egg_count, record.broken_eggs)
                  let efficiencyColor = "bg-green-500/10 text-green-500"

                  if (efficiency < 90) efficiencyColor = "bg-yellow-500/10 text-yellow-500"
                  if (efficiency < 80) efficiencyColor = "bg-red-500/10 text-red-500"

                  return (
                    <TableRow key={record.id}>
                      <TableCell>{format(parseISO(record.collection_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{record.coop_name}</TableCell>
                      <TableCell className="text-right">{record.egg_count}</TableCell>
                      <TableCell className="text-right">{record.broken_eggs}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={efficiencyColor}>
                          {efficiency.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{record.total_feed}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{record.notes || "—"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Eggs Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : eggRecords.length === 0 ? (
                "Nothing to show"
              ) : (
                eggRecords
                  .filter((record) => parseISO(record.collection_date).toDateString() === new Date().toDateString())
                  .reduce((sum, record) => sum + record.egg_count, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all coops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : eggRecords.length === 0 ? (
                "Nothing to show"
              ) : (
                (() => {
                  const totalEggs = eggRecords.reduce((sum, record) => sum + record.egg_count, 0)
                  const totalBroken = eggRecords.reduce((sum, record) => sum + record.broken_eggs, 0)
                  return totalEggs ? (((totalEggs - totalBroken) / totalEggs) * 100).toFixed(1) + "%" : "0%"
                })()
              )}
            </div>
            <p className="text-xs text-muted-foreground">Eggs collected vs broken</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
