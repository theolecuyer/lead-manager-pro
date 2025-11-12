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

export async function getLatestReport() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .order("report_date", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching latest report:", error)
    return null
  }

  return data as Report
}

export async function getYesterdaysReport() {
  const supabase = createClient()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })

  const { data, error } = await supabase
    .from("daily_reports")
    .select("*")
    .eq("report_date", yesterdayDate)
    .single()

  if (error) {
    console.error("Error fetching yesterday's report:", error)
    return null
  }

  return data as Report
}