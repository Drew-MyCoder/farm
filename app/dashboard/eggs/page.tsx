"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Edit, Plus } from "lucide-react"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"

interface EggRecord {
  id: string
  coopId: string
  coopName: string
  date: string
  eggsCollected: number
  brokenEggs: number
  feedConsumed: number
  notes: string
}

export default function EggsPage() {
  const [eggRecords, setEggRecords] = useState<EggRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchEggRecords() {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch("/api/eggs")

        // For demo purposes, create mock data
        const mockEggRecords: EggRecord[] = [
          {
            id: "1",
            coopId: "1",
            coopName: "Coop A",
            date: "2025-03-11T08:00:00",
            eggsCollected: 120,
            brokenEggs: 3,
            feedConsumed: 25.5,
            notes: "Normal collection day",
          },
          {
            id: "2",
            coopId: "2",
            coopName: "Coop B",
            date: "2025-03-11T08:30:00",
            eggsCollected: 95,
            brokenEggs: 2,
            feedConsumed: 20.0,
            notes: "Some hens seemed less active today",
          },
          {
            id: "3",
            coopId: "3",
            coopName: "Coop C",
            date: "2025-03-11T09:00:00",
            eggsCollected: 150,
            brokenEggs: 5,
            feedConsumed: 30.2,
            notes: "Excellent production today",
          },
          {
            id: "4",
            coopId: "1",
            coopName: "Coop A",
            date: "2025-03-10T08:15:00",
            eggsCollected: 115,
            brokenEggs: 4,
            feedConsumed: 24.8,
            notes: "Routine collection",
          },
          {
            id: "5",
            coopId: "2",
            coopName: "Coop B",
            date: "2025-03-10T08:45:00",
            eggsCollected: 90,
            brokenEggs: 1,
            feedConsumed: 19.5,
            notes: "",
          },
        ]

        // Simulate API call
        setTimeout(() => {
          setEggRecords(mockEggRecords)
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching egg records:", err)
        setError("Failed to load egg collection records. Please try again.")
        setLoading(false)
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Egg Collections</CardTitle>
            <CardDescription>Showing the most recent egg collection records across all coops.</CardDescription>
          </CardHeader>
          <CardContent>
            {eggRecords.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No egg collection records found. Start by recording your first collection.
              </p>
            ) : (
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eggRecords.map((record) => {
                    const efficiency = calculateEfficiency(record.eggsCollected, record.brokenEggs)
                    let efficiencyColor = "bg-green-500/10 text-green-500"

                    if (efficiency < 90) {
                      efficiencyColor = "bg-yellow-500/10 text-yellow-500"
                    }
                    if (efficiency < 80) {
                      efficiencyColor = "bg-red-500/10 text-red-500"
                    }

                    return (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{record.coopName}</TableCell>
                        <TableCell className="text-right">{record.eggsCollected}</TableCell>
                        <TableCell className="text-right">{record.brokenEggs}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={efficiencyColor}>
                            {efficiency.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{record.feedConsumed}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.notes || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/eggs/${record.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
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
              ) : (
                eggRecords
                  .filter((record) => new Date(record.date).toDateString() === new Date().toDateString())
                  .reduce((sum, record) => sum + record.eggsCollected, 0)
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
              ) : (
                (() => {
                  const totalEggs = eggRecords.reduce((sum, record) => sum + record.eggsCollected, 0)
                  const totalBroken = eggRecords.reduce((sum, record) => sum + record.brokenEggs, 0)
                  return totalEggs ? (((totalEggs - totalBroken) / totalEggs) * 100).toFixed(1) + "%" : "0%"
                })()
              )}
            </div>
            <p className="text-xs text-muted-foreground">Eggs collected vs broken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Coop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                (() => {
                  const coopPerformance = eggRecords.reduce(
                    (acc, record) => {
                      if (!acc[record.coopName]) {
                        acc[record.coopName] = { eggs: 0, count: 0 }
                      }
                      acc[record.coopName].eggs += record.eggsCollected
                      acc[record.coopName].count += 1
                      return acc
                    },
                    {} as Record<string, { eggs: number; count: number }>,
                  )

                  let topCoop = { name: "None", average: 0 }

                  Object.entries(coopPerformance).forEach(([name, data]) => {
                    const average = data.eggs / data.count
                    if (average > topCoop.average) {
                      topCoop = { name, average }
                    }
                  })

                  return topCoop.name
                })()
              )}
            </div>
            <p className="text-xs text-muted-foreground">Based on average egg production</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

