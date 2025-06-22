"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CoopData {
  total_fowls: number
  total_dead_fowls: number
  total_feed: number
  coop_name: string
}

interface UpdateCoopFormProps {
  coopId: string
  initialData: CoopData
  onSuccess?: () => void
}

export function UpdateCoopForm({ coopId, initialData, onSuccess }: UpdateCoopFormProps) {
  const router = useRouter();
  console.log(coopId);
  const [formData, setFormData] = useState<CoopData>({
    total_fowls: initialData.total_fowls || 0,
    total_dead_fowls: initialData.total_dead_fowls || 0,
    total_feed: initialData.total_feed || 0,
    coop_name: initialData.coop_name || "",
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
      toast.success("Coop updated successfully");

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard/coops")
      }
    } catch (error) {
      console.error("Error updating coop:", error)
      toast.error('Failed to update coops. Please try again.', {
        description: error instanceof Error ? error.message : "Failed to update coop",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex gap-4 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/coops")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Coop"}
        </Button>
      </div>
    </form>
  )
}

