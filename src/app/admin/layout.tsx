import { redirect } from "next/navigation"
import { createClient as createServerClient } from "../../../utils/supabase/server"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createServerClient()

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()
	if (!user || error) {
		redirect("/login")
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("username, full_name")
		.eq("id", user.id)
		.single()

	return (
		<AdminLayoutClient initialUser={user} initialProfile={profile ?? null}>
			{children}
		</AdminLayoutClient>
	)
}
