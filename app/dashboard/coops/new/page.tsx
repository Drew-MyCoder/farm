"use client"



import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { useState } from "react"
import axiosInstance from "@/axiosInstance"


interface CoopData {
  total_fowls: number
  total_dead_fowls: number
  total_feed: number
  coop_name: string
  user_id: number
}

export default function NewCoopPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CoopData>({
    total_fowls: 0,
    total_dead_fowls: 0,
    total_feed: 0,
    coop_name: "",
    user_id: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.total_fowls < 0) {
      newErrors.total_fowls = "Total fowls cannot be negative"
    }

    if (formData.total_dead_fowls < 0) {
      newErrors.total_dead_fowls = "Total dead fowls cannot be negative"
    }

    if (formData.total_feed < 0) {
      newErrors.total_feed = "Total feed cannot be negative"
    }

    if (!formData.coop_name.trim()) {
      newErrors.coop_name = "Coop name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "coop_name" ? value : Number(value),
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axiosInstance.post(
        
        '/coops/',
        {
          total_feed: formData.total_feed,
          status: "active",
          total_dead_fowls: formData.total_dead_fowls,
          total_fowls: formData.total_fowls,
          coop_name: formData.coop_name,
          user_id: formData.user_id,
        }
      );
      // console.log('full api order response', response);
      // console.log("Submittin to coop id:", coopId)
      
      const data = await response
      if (!response) {
        throw new Error(data.statusText || 'Failed to create coop');
      }
      if (response.status !== 200) {
        throw new Error (response.statusText || 'sorry something went wrong. try again');
      }
      // setStatus({ type: 'Success', message: 'Order created successfully'});
      // router.push('/dashboard')


      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1))

      // toast.success("Egg collection data saved successfully");


      // Reset form after successful submission
      setFormData({
        user_id: 0,
        total_feed: 0,
        total_dead_fowls: 0,
        total_fowls: 0,
        coop_name: "",
      })


      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1))

      // toast({
      //   title: "Success",
      //   description: "Coop created successfully",
      // })
      toast.success("Coop created successfully");

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating coop:", error)
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to create coop",
      //   variant: "destructive",
      // })
      toast.error('Failed to create coop. Please try again.', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Coop" text="Add a new coop to your farm." />

      <Card>
        <CardHeader>
          <CardTitle>Coop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coop_name">Coop Name</Label>
              <Input
                id="coop_name"
                name="coop_name"
                value={formData.coop_name}
                onChange={handleChange}
                className={errors.coop_name ? "border-red-500" : ""}
                aria-invalid={!!errors.coop_name}
                aria-describedby={errors.coop_name ? "coop_name-error" : undefined}
              />
              {errors.coop_name && (
                <p id="coop_name-error" className="text-sm text-red-500">
                  {errors.coop_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_fowls">Total Fowls</Label>
              <Input
                id="total_fowls"
                name="total_fowls"
                type="number"
                min="0"
                value={formData.total_fowls}
                onChange={handleChange}
                className={errors.total_fowls ? "border-red-500" : ""}
                aria-invalid={!!errors.total_fowls}
                aria-describedby={errors.total_fowls ? "total_fowls-error" : undefined}
              />
              {errors.total_fowls && (
                <p id="total_fowls-error" className="text-sm text-red-500">
                  {errors.total_fowls}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_dead_fowls">Total Dead Fowls</Label>
              <Input
                id="total_dead_fowls"
                name="total_dead_fowls"
                type="number"
                min="0"
                value={formData.total_dead_fowls}
                onChange={handleChange}
                className={errors.total_dead_fowls ? "border-red-500" : ""}
                aria-invalid={!!errors.total_dead_fowls}
                aria-describedby={errors.total_dead_fowls ? "total_dead_fowls-error" : undefined}
              />
              {errors.total_dead_fowls && (
                <p id="total_dead_fowls-error" className="text-sm text-red-500">
                  {errors.total_dead_fowls}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_feed">Total Feed</Label>
              <Input
                id="total_feed"
                name="total_feed"
                type="number"
                min="0"
                step="0.01"
                value={formData.total_feed}
                onChange={handleChange}
                className={errors.total_feed ? "border-red-500" : ""}
                aria-invalid={!!errors.total_feed}
                aria-describedby={errors.total_feed ? "total_feed-error" : undefined}
              />
              {errors.total_feed && (
                <p id="total_feed-error" className="text-sm text-red-500">
                  {errors.total_feed}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/coops")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Coop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

