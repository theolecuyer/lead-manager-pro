// lib/supabase/settings.ts
import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type SystemSettings = Database["public"]["Tables"]["system_settings"]["Row"]
type SystemSettingsUpdate = Database["public"]["Tables"]["system_settings"]["Update"]

// Get system settings (always id=1)
export async function getSystemSettings() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("id", 1)
    .single()

  if (error) {
    console.error("Error fetching system settings:", error)
    throw new Error(error.message)
  }

  return data as SystemSettings
}

// Update system settings (always id=1)
export async function updateSystemSettings(settings: {
  auto_pause_inactive_days?: number | null
  auto_suspend_inactive_days?: number | null
}) {
  const supabase = createClient()

  const updateData: SystemSettingsUpdate = {
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("system_settings")
    .update(updateData)
    .eq("id", 1)
    .select()
    .single()

  if (error) {
    console.error("Error updating system settings:", error)
    throw new Error(error.message)
  }

  return data as SystemSettings
}