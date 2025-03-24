"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getCoops } from "@/lib/actions/auth"

interface Coop {
  id: string
  total_fowls: number
  total_dead_fowls: number
  total_feed: number
  coop_name: string
}

export default function CoopsPage() {
  const [coops, setCoops] = useState<Coop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [coopToDelete, setCoopToDelete] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCoops() {
      try {
        setLoading(true)

        const response = await getCoops();

        // Ensure response is an array, default to an empty array if not
        const mockCoops: Coop[] = Array.isArray(response) ? response : [];
  
        setCoops(mockCoops);
  
        // Simulate API call
        setTimeout(() => {
          setCoops(mockCoops);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Error fetching coops:", err);
        setError("Failed to load coops. Please try again.");
        setCoops([]); // Ensure it's an empty array on error
        setLoading(false);
      }
    }

    fetchCoops()
  }, [])

  const handleDeleteCoop = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/coops/${id}`, {
      //   method: "DELETE",
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setCoops(coops.filter((coop) => coop.id !== id))

      toast.success("Coop deleted successfully");
    } catch (error) {
      console.error("Error deleting coop:", error)

      toast.error('Failed to delete coop. Please try again.', {
        description: 'Please try again.',
      });
    } finally {
      setCoopToDelete(null)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Coops" text="Manage your coops and monitor fowl statistics.">
        <Link href="/dashboard/coops/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Coop
          </Button>
        </Link>
      </DashboardHeader>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
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
            <CardTitle>All Coops</CardTitle>
          </CardHeader>
          <CardContent>
            {coops.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No coops found. Create your first coop to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coop Name</TableHead>
                    <TableHead className="text-right">Total Fowls</TableHead>
                    <TableHead className="text-right">Dead Fowls</TableHead>
                    <TableHead className="text-right">Total Feed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coops.map((coop) => (
                    <TableRow key={coop.id}>
                      <TableCell className="font-medium">{coop.coop_name}</TableCell>
                      <TableCell className="text-right">{coop.total_fowls}</TableCell>
                      <TableCell className="text-right">{coop.total_dead_fowls}</TableCell>
                      <TableCell className="text-right">{coop.total_feed}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/coops/${coop.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>

                          <AlertDialog
                            open={coopToDelete === coop.id}
                            onOpenChange={(open) => !open && setCoopToDelete(null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                onClick={() => setCoopToDelete(coop.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the coop &quot{coop.coop_name}&quot. This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteCoop(coop.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}

