import { redirect } from "next/navigation"
import { createClient } from "../../../../utils/supabase/server"
import DashboardIcon from "../components/DashboardIcon"
import {
	ArrowUpTrayIcon,
	CreditCardIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid"

export default async function AdminDashboard() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<DashboardIcon
					icon={ArrowUpTrayIcon}
					textcolor="text-black"
					color1="bg-blue-100"
					color2="text-blue-500"
					numToday={10}
					numYesterday={8}
					title="Leads Delivered Today"
				/>
				<DashboardIcon
					icon={CreditCardIcon}
					textcolor="text-black"
					color1="bg-red-100"
					color2="text-red-500"
					numToday={10}
					numYesterday={12}
					title="Credits Issued Today"
				/>
				<DashboardIcon
					icon={CurrencyDollarIcon}
					textcolor="text-green-500"
					color1="bg-green-100"
					color2="text-green-500"
					numToday={10}
					numYesterday={8}
					title="Net Billable Leads"
				/>
				<DashboardIcon
					icon={UserGroupIcon}
					textcolor="text-black"
					color1="bg-purple-100"
					color2="text-purple-500"
					numToday={10}
					numYesterday={6}
					title="Active Clients"
				/>
			</div>
			<div>
				<div className="bg-white p-6 rounded shadow col-span-4">Big Box 1</div>
			</div>
			<div>
				<div className="bg-white p-6 rounded shadow col-span-4">Big Box 2</div>
			</div>
			<h1>Welcome, {user.email}</h1>

			<form method="POST" action="/signout">
				<button type="submit" className="px-4 py-2 mt-4 bg-red-500 text-white rounded">
					Sign Out
				</button>
			</form>
		</div>
	)
}
