import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type Lead = Database["public"]["Tables"]["leads"]["Row"]
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]

// Create

export interface CreateLeadInput {
  client_id: number
  lead_name: string
  lead_phone?: string
  lead_address?: string
  additional_info?: string
}

export async function createNewLead(input: CreateLeadInput) {
  const supabase = createClient()

  const leadData: LeadInsert = {
    client_id: input.client_id,
    lead_name: input.lead_name,
    lead_phone: input.lead_phone || null,
    lead_address: input.lead_address || null,
    additional_info: input.additional_info || null,
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(leadData)
    .select()
    .single()

  if (error) {
    console.error("Error creating lead:", error)
    throw new Error(error.message)
  }

  return data as Lead
}

// Read

export async function getAllLeads() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name, email, phone)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getLeadById(leadId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name, email, phone),
      credited_by_profile:profiles(id, full_name, username)
    `)
    .eq("id", leadId)
    .single()

  if (error) {
    console.error("Error fetching lead:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getLeadsByClient(clientId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads for client:", error)
    throw new Error(error.message)
  }

  return data as Lead[]
}

export async function getTodaysLeads() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name)
    `)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching today's leads:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getLeadsByStatus(status: 'billable' | 'credited' | 'paid') {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name)
    `)
    .eq("payment_status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads by status:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getLeadsByDateRange(startDate: string, endDate: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name)
    `)
    .gte("created_at", `${startDate}T00:00:00`)
    .lte("created_at", `${endDate}T23:59:59`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads by date range:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getTodaysBillableLeads() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name)
    `)
    .eq("payment_status", "billable")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching today's billable leads:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getTodaysCreditedLeads() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      client:clients(id, name)
    `)
    .eq("payment_status", "credited")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching today's credited leads:", error)
    throw new Error(error.message)
  }

  return data
}