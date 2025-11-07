import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type Report = Database["public"]["Tables"]["daily_reports"]["Row"]

// Get all daily reports, sorted by newest
export async function getAllReports() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .order("report_date", { ascending: false })

  if (error) {
    console.error("Error fetching reports:", error)
    throw new Error(error.message)
  }

  return data as Report[]
}

// Get a single daily report by Id
export async function getReportById(reportId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .eq("id", reportId)
    .single()

  if (error) {
    console.error("Error fetching report:", error)
    throw new Error(error.message)
  }

  return data as Report
}