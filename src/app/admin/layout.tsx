import { redirect } from "next/navigation"
import { createClient } from "../../../utils/supabase/server"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (!user || error) {
		redirect("/login")
	}

	return <AdminLayoutClient>{children}</AdminLayoutClient>
}
