// lib/supabase/auth.ts
import { createClient } from "../../../utils/supabase/client"

// Send password reset email
export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    console.error("Error sending password reset email:", error)
    throw new Error(error.message)
  }

  return { success: true }
}

// Login function (client-side version for error handling)
export async function loginUser(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error)
    throw new Error(error.message)
  }

  if (!data?.user) {
    throw new Error("Login failed. Please try again.")
  }

  return data
}