import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type Client = Database["public"]["Tables"]["clients"]["Row"]
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"]

// Create

export interface CreateClientInput {
  name: string
  email?: string
  phone?: string
  active?: boolean
}

export async function createNewClient(input: CreateClientInput) {
  const supabase = createClient()

  const clientData: ClientInsert = {
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    active: input.active ?? true,
  }

  const { data, error } = await supabase
    .from("clients")
    .insert(clientData)
    .select()
    .single()

  if (error) {
    console.error("Error creating client:", error)
    throw new Error(error.message)
  }

  return data as Client
}

// Read

export async function getAllClients() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    throw new Error(error.message)
  }

  return data as Client[]
}

export async function getActiveClients() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching active clients:", error)
    throw new Error(error.message)
  }

  return data as Client[]
}

export async function getClientById(clientId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single()

  if (error) {
    console.error("Error fetching client:", error)
    throw new Error(error.message)
  }

  return data as Client
}

export async function searchClientsByName(searchTerm: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .ilike("name", `%${searchTerm}%`)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error searching clients:", error)
    throw new Error(error.message)
  }

  return data as Client[]
}

// Get clients with lead counts for dashboard
export async function getClientsWithStats() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select(`
      *,
      leads:leads(count)
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients with stats:", error)
    throw new Error(error.message)
  }

  return data
}

// Get clients who received leads today
export async function getClientsWithLeadsToday() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .gt("leads_received_today", 0)
    .order("leads_received_today", { ascending: false })

  if (error) {
    console.error("Error fetching clients with leads today:", error)
    throw new Error(error.message)
  }

  return data as Client[]
}