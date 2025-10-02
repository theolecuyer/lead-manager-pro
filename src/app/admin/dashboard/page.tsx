import { redirect } from "next/navigation"
import { createClient } from "../../../../utils/supabase/server"

export default async function AdminDashboard() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect("/login")
	}

	return (
		<div>
			<h1>Welcome, {user.email}</h1>

			<form method="POST" action="/signout">
				<button type="submit" className="px-4 py-2 mt-4 bg-red-500 text-white rounded">
					Sign Out
				</button>
			</form>
		</div>
	)
}
