"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "../../../utils/supabase/server"

export async function login(formData: FormData) {
	const supabase = await createClient()

	const email = formData.get("email") as string
	const password = formData.get("password") as string

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error || !data?.user) {
		console.error("Login error:", error)
		redirect("/error")
	}

	revalidatePath("/", "layout")
	redirect("/admin/dashboard")
}

export async function signup(formData: FormData) {
	const supabase = await createClient()

	const email = formData.get("email") as string
	const password = formData.get("password") as string
	const full_name = (formData.get("full_name") as string) ?? "test"
	const username = (formData.get("username") as string) ?? ""
	const user_role = (formData.get("user_role") as "admin" | "client") ?? "admin" // current defailt

	console.log("signup payload:", { email, password, full_name, username, user_role })

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				full_name,
				email,
				user_role,
			},
		},
	})

	if (error) {
		console.error("Signup error:", error)
		redirect("/error")
	}

	revalidatePath("/", "layout")
	redirect("/login")
}
