"use client"

import type React from "react"

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
import { cn, GetUserId,  } from "@/lib/utils"
import { getCoops } from "@/lib/actions/auth"
import axiosInstance from "@/axiosInstance"


interface Coop {
  id: string
  coop_name: string
}

interface EggUpdateData {
  coopId: string
  collection_date: Date
  // crates_collected: number
  remainder_eggs: number
  broken_eggs: number
  notes: string
  status: string
  total_dead_fowls: number
  total_feed: number
  total_fowls: number
  coop_name: string
  user_id: number
  crates_collected: number
  egg_count: number
  efficiency: number
}

export default function EggUpdatePage() {
  const router = useRouter()
  const [coops, setCoops] = useState<Coop[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EggUpdateData>({
    coopId: "",
    collection_date: new Date(),
    egg_count: 0,
    crates_collected: 0,
    remainder_eggs: 0,
    broken_eggs: 0,
    total_feed: 0,
    notes: "",
    status: "",
    total_dead_fowls: 0,
    total_fowls: 0,
    coop_name: "",
    user_id: 0,
    efficiency: 0,
  })
  const userId = GetUserId();

 



  // Calculate efficiency (eggs collected vs broken)
  const calculateEfficiency = (collected: number, broken: number) => {
    if (collected === 0) return 0
    return ((collected - broken) / collected) * 100
  }

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchCoops() {
      try {

        setLoading(true);
        const mockCoops: Coop[] = await getCoops();
        if (!Array.isArray(mockCoops)) {
          console.error("Error: getCoops() did not return an array", mockCoops);
          setCoops([]);
          return;
        }
  
        console.log(mockCoops, "this is my coops from database");
  
        setCoops(mockCoops);
      } catch (error) {
        console.error("Error fetching coops:", error)

        toast.error('Failed to load coops. Please try again.', {
          description: 'Please try again.',
        });
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

    if (!formData.collection_date) {
      newErrors.collection_date = "Please select a collection_date"
    }

    if (formData.egg_count < 0) {
      newErrors.egg_count = "Eggs collected cannot be negative"
    }

    if (formData.broken_eggs < 0) {
      newErrors.broken_eggs = "Broken eggs cannot be negative"
    }

    if (formData.total_feed < 0) {
      newErrors.total_feed = "Feed consumed cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submitting to backend: ", formData);
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axiosInstance.patch(
        
        '/coops/${formData.coopId}',
        {
          coopId: formData.coopId,
          collection_date: formData.collection_date,
          egg_count: formData.egg_count,
          crates_collected: formData.crates_collected,
          remainder_eggs: formData.remainder_eggs,
          broken_eggs: formData.broken_eggs,
          total_feed: formData.total_feed,
          notes: formData.notes,
          status: "active",
          total_dead_fowls: formData.total_dead_fowls,
          total_fowls: formData.total_fowls,
          coop_name: formData.coop_name,
          user_id: userId,
          efficiency: calculateEfficiency(formData.egg_count, formData.broken_eggs)
        }
      );
      // console.log('full api order response', response);
      // console.log("Submittin to coop id:", coopId)
      
      const data = await response
      if (!response) {
        throw new Error(data.statusText || 'Failed to create order');
      }
      if (response.status !== 200) {
        throw new Error (response.statusText || 'sorry something went wrong. try again');
      }
      // setStatus({ type: 'Success', message: 'Order created successfully'});
      router.push('/dashboard/eggs')


      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Egg collection data saved successfully");


      // Reset form after successful submission
      setFormData({
        coopId: "",
        collection_date: new Date(),
        egg_count: 0,
        crates_collected: 0,
        remainder_eggs: 0,
        broken_eggs: 0,
        total_feed: 0,
        notes: "",
        status: "",
        total_dead_fowls: 0,
        total_fowls: 0,
        coop_name: "",
        user_id: 0,
        efficiency: 0,
      })

      // Optionally redirect to a dashboard or egg records page
      // router.push("/dashboard/eggs")
    } catch (error) {
      console.error("Error saving egg data:", error)

      toast.error('Failed to load update. Please try again.', {
        description: 'Please try again.',
      });
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
          <CardDescription>Enter the egg collection data for today or a specific collection_date.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coop">Coop</Label>
                <Select
                  value={formData.coopId}
                    onValueChange={(value) => {
                      console.log("Selected coopId, ", value);
                      const selectedCoop = coops.find((coop) => String(coop.id) === value);
                      setFormData({
                        ...formData,
                        coopId: value,
                        coop_name: selectedCoop?.coop_name || "",
                      });
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
                    ) : coops.length > 0 ? (
                      coops.map((coop) => (
                        <SelectItem key={coop.id} value={String(coop.id)}>
                          {coop.coop_name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 text-center">No coops available</div>
                    )}
                  </SelectContent>
                </Select>
                {errors.coopId && <p className="text-sm text-red-500">{errors.coopId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection_date">Collection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.collection_date && "text-muted-foreground",
                        errors.collection_date && "border-red-500",
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.collection_date ? format(formData.collection_date, "PPP") : <span>Pick a collection_date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.collection_date}
                      onSelect={(collection_date) => {
                        setFormData({ ...formData, collection_date: collection_date || new Date() })
                        if (errors.collection_date) {
                          setErrors({ ...errors, collection_date: "" })
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.collection_date && <p className="text-sm text-red-500">{errors.collection_date}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crates_collected">Crates Collected</Label>
                  <Input
                    id="crates_collected"
                    type="number"
                    min="0"
                    value={formData.crates_collected || 0}
                    onChange={(e) => {
                      const crates_collected = Number.parseInt(e.target.value) || 0
                      const remainder_eggs = formData.remainder_eggs || 0
                      setFormData({
                        ...formData,
                        crates_collected: crates_collected,
                        egg_count: crates_collected * 30 + remainder_eggs,
                      })
                      if (errors.crates_collected) {
                        setErrors({ ...errors, crates_collected: "" })
                      }
                    }}
                    className={errors.crates_collected ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.crates_collected && <p className="text-sm text-red-500">{errors.crates_collected}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remainder_eggs">Remainder Eggs</Label>
                  <Input
                    id="remainder_eggs"
                    type="number"
                    min="0"
                    max="29"
                    value={formData.remainder_eggs || 0}
                    onChange={(e) => {
                      const remainder_eggs = Number.parseInt(e.target.value) || 0
                      const crates_collected = formData.crates_collected || 0
                      setFormData({
                        ...formData,
                        remainder_eggs: remainder_eggs,
                        egg_count: crates_collected * 30 + remainder_eggs,
                      })
                      if (errors.remainder_eggs) {
                        setErrors({ ...errors, remainder_eggs: "" })
                      }
                    }}
                    className={errors.remainder_eggs ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.remainder_eggs && <p className="text-sm text-red-500">{errors.remainder_eggs}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="egg_count">Total Eggs Collected</Label>
                  <Input
                    id="egg_count"
                    type="number"
                    min="0"
                    value={formData.egg_count}
                    readOnly
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Automatically calculated from crates_collected and remainder_eggs</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="broken_eggs">Broken Eggs</Label>
                <Input
                  id="broken_eggs"
                  type="number"
                  min="0"
                  value={formData.broken_eggs}
                  onChange={(e) => {
                    setFormData({ ...formData, broken_eggs: Number.parseInt(e.target.value) || 0 })
                    if (errors.broken_eggs) {
                      setErrors({ ...errors, broken_eggs: "" })
                    }
                  }}
                  className={errors.broken_eggs ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.broken_eggs && <p className="text-sm text-red-500">{errors.broken_eggs}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_feed">Feed Consumed (kg)</Label>
                <Input
                  id="total_feed"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.total_feed}
                  onChange={(e) => {
                    setFormData({ ...formData, total_feed: Number.parseFloat(e.target.value) || 0 })
                    if (errors.total_feed) {
                      setErrors({ ...errors, total_feed: "" })
                    }
                  }}
                  className={errors.total_feed ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.total_feed && <p className="text-sm text-red-500">{errors.total_feed}</p>}
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

