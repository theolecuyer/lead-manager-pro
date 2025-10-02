import { redirect } from "next/navigation"
import { createClient } from "../../../../utils/supabase/server"
import LoginPage from "./login"

export default async function Login() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		redirect("/admin/dashboard")
	}

	return <LoginPage />
}
