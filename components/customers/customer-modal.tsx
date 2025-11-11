"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  shop_name: string
  owner_name: string
  phone: string
  address: string
  outstanding_balance: number
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer | null
  userId: string
}

export function CustomerModal({ isOpen, onClose, customer, userId }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    phone: "",
    address: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (customer) {
      setFormData({
        shop_name: customer.shop_name,
        owner_name: customer.owner_name,
        phone: customer.phone,
        address: customer.address,
      })
    } else {
      setFormData({
        shop_name: "",
        owner_name: "",
        phone: "",
        address: "",
      })
    }
  }, [customer, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (customer) {
        const { error } = await supabase.from("customers").update(formData).eq("id", customer.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("customers").insert({
          ...formData,
          organization_id: userId,
          outstanding_balance: 0,
        })
        if (error) throw error
      }
      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error saving customer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">{customer ? "Edit Customer" : "Add Customer"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="shop">Shop Name *</Label>
            <Input
              id="shop"
              value={formData.shop_name}
              onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
              required
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="owner">Owner Name *</Label>
            <Input
              id="owner"
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              required
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : customer ? "Update" : "Add"} Customer
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
