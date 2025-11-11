import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomerList } from "@/components/customers/customer-list"
import { CustomerActions } from "@/components/customers/customer-actions"

export default async function CustomersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("organization_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout title="Customers">
      <div className="space-y-6">
        <CustomerActions userId={user.id} />
        <CustomerList customers={customers || []} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
