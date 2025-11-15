import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type ReportSettings = Database["public"]["Tables"]["report_settings"]["Row"]
type ReportSettingsUpdate = Database["public"]["Tables"]["report_settings"]["Update"]

// Get report settings (always id=1)
export async function getReportSettings() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("report_settings")
    .select("*")
    .eq("id", 1)
    .single()

  if (error) {
    console.error("Error fetching report settings:", error)
    throw new Error(error.message)
  }

  return data as ReportSettings
}

// Update report settings (always id=1)
export async function updateReportSettings(settings: {
  send_reports_on_weekends?: boolean
  timezone?: string
  report_recipients?: string[]
  report_time?: string
}) {
  const supabase = createClient()

  const updateData: ReportSettingsUpdate = {
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("report_settings")
    .update(updateData)
    .eq("id", 1)
    .select()
    .single()

  if (error) {
    console.error("Error updating report settings:", error)
    throw new Error(error.message)
  }

  return data as ReportSettings
}