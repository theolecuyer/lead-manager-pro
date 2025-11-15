// lib/supabase/profile.ts
import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

// Get current user's profile
export async function getCurrentUserProfile() {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error("Not authenticated")
  }

  // Then get their profile
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    throw new Error(error.message)
  }

  return { profile: data as Profile, email: user.email }
}

// Update profile information
export async function updateProfile(updates: {
  full_name?: string
  username?: string
}) {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error(error.message)
  }

  return data as Profile
}

// Update email (this updates both auth + profiles and requires verification)
export async function updateEmail(newEmail: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    email: newEmail
  })

  if (error) {
    console.error("Error updating email:", error)
    throw new Error(error.message)
  }

  return data
}

// Change password with current password verification
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user || !user.email) {
    throw new Error("Not authenticated")
  }
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (signInError) {
    throw new Error("Current password is incorrect")
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error("Error changing password:", error)
    throw new Error(error.message)
  }

  return data
}