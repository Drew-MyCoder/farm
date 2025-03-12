"use client"


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Coop {
  id: string
  coop_name: string
}

interface EggUpdateData {
  coopId: string
  date: Date
  eggsCollected: number
  brokenEggs: number
  feedConsumed: number
  notes: string
}

export default function EggUpdatePage() {
  const router = useRouter()
  const [coops, setCoops] = useState<Coop[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EggUpdateData>({
    coopId: "",
    date: new Date(),
    eggsCollected: 0,
    brokenEggs: 0,
    feedConsumed: 0,
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchCoops() {
      try {
        // In a real app, this would be an API call
        // const response = await fetch("/api/coops")

        // For demo purposes, create mock data
        const mockCoops: Coop[] = [
          { id: "1", coop_name: "Coop A" },
          { id: "2", coop_name: "Coop B" },
          { id: "3", coop_name: "Coop C" },
          { id: "4", coop_name: "Coop D" },
        ]

        // Simulate API call
        setTimeout(() => {
          setCoops(mockCoops)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching coops:", error)
        toast({
          title: "Error",
          description: "Failed to load coops. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchCoops()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.coopId) {
      newErrors.coopId = "Please select a coop"
    }

    if (!formData.date) {
      newErrors.date = "Please select a date"
    }

    if (formData.eggsCollected < 0) {
      newErrors.eggsCollected = "Eggs collected cannot be negative"
    }

    if (formData.brokenEggs < 0) {
      newErrors.brokenEggs = "Broken eggs cannot be negative"
    }

    if (formData.feedConsumed < 0) {
      newErrors.feedConsumed = "Feed consumed cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/eggs/daily", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Egg collection data saved successfully",
      })

      // Reset form after successful submission
      setFormData({
        coopId: "",
        date: new Date(),
        eggsCollected: 0,
        brokenEggs: 0,
        feedConsumed: 0,
        notes: "",
      })

      // Optionally redirect to a dashboard or egg records page
      // router.push("/dashboard/eggs")
    } catch (error) {
      console.error("Error saving egg data:", error)
      toast({
        title: "Error",
        description: "Failed to save egg collection data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Daily Egg Collection"
        text="Record the number of eggs collected from each coop daily."
      />

      <Card>
        <CardHeader>
          <CardTitle>Egg Collection Form</CardTitle>
          <CardDescription>Enter the egg collection data for today or a specific date.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coop">Coop</Label>
                <Select
                  value={formData.coopId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, coopId: value })
                    if (errors.coopId) {
                      setErrors({ ...errors, coopId: "" })
                    }
                  }}
                  disabled={loading || isSubmitting}
                >
                  <SelectTrigger id="coop" className={errors.coopId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a coop" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Loading coops...</span>
                      </div>
                    ) : (
                      coops.map((coop) => (
                        <SelectItem key={coop.id} value={coop.id}>
                          {coop.coop_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.coopId && <p className="text-sm text-red-500">{errors.coopId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Collection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                        errors.date && "border-red-500",
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => {
                        setFormData({ ...formData, date: date || new Date() })
                        if (errors.date) {
                          setErrors({ ...errors, date: "" })
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eggsCollected">Eggs Collected</Label>
                <Input
                  id="eggsCollected"
                  type="number"
                  min="0"
                  value={formData.eggsCollected}
                  onChange={(e) => {
                    setFormData({ ...formData, eggsCollected: Number.parseInt(e.target.value) || 0 })
                    if (errors.eggsCollected) {
                      setErrors({ ...errors, eggsCollected: "" })
                    }
                  }}
                  className={errors.eggsCollected ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.eggsCollected && <p className="text-sm text-red-500">{errors.eggsCollected}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brokenEggs">Broken Eggs</Label>
                <Input
                  id="brokenEggs"
                  type="number"
                  min="0"
                  value={formData.brokenEggs}
                  onChange={(e) => {
                    setFormData({ ...formData, brokenEggs: Number.parseInt(e.target.value) || 0 })
                    if (errors.brokenEggs) {
                      setErrors({ ...errors, brokenEggs: "" })
                    }
                  }}
                  className={errors.brokenEggs ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.brokenEggs && <p className="text-sm text-red-500">{errors.brokenEggs}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedConsumed">Feed Consumed (kg)</Label>
                <Input
                  id="feedConsumed"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.feedConsumed}
                  onChange={(e) => {
                    setFormData({ ...formData, feedConsumed: Number.parseFloat(e.target.value) || 0 })
                    if (errors.feedConsumed) {
                      setErrors({ ...errors, feedConsumed: "" })
                    }
                  }}
                  className={errors.feedConsumed ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.feedConsumed && <p className="text-sm text-red-500">{errors.feedConsumed}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any observations or notes about today's collection"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Egg Collection Data"
            )}
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}

