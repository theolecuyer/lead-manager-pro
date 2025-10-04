"use client"

import { redirect } from "next/navigation"
import { createClient } from "../../../../utils/supabase/client"
import { type User } from "@supabase/supabase-js"
import DashboardIcon from "../components/DashboardIcon"
import {
	ArrowUpTrayIcon,
	CreditCardIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import { useState, useCallback, useEffect } from "react"

export default function AdminDashboard() {
	const [search, setSearch] = useState("")
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [username, setUsername] = useState("")
	const supabase = createClient()

	// if (!user) {
	// 	redirect("/login")
	// }

	useEffect(() => {
		async function fetchUser() {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser()

			if (error) {
				console.error("Error fetching user:", error)
			} else {
				setUser(user)
			}
		}

		fetchUser()
	}, [supabase])

	const getProfile = useCallback(async () => {
		if (!user) return
		try {
			setLoading(true)
			const { data, error, status } = await supabase
				.from("profiles")
				.select(`full_name, username`)
				.eq("id", user.id)
				.single()

			if (error && status !== 406) {
				console.error("Supabase query error:", { error, status })
				throw error
			}
			if (data) {
				setUsername(data.username)
			}
		} catch (err) {
			console.error("Error loading user data:", err)
		} finally {
			setLoading(false)
		}
	}, [user, supabase])

	useEffect(() => {
		getProfile()
	}, [user, getProfile])

	if (!user) {
		return <p className="text-center">Loading user...</p>
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
				<div className="bg-white p-5 rounded shadow col-span-4">
					<h1 className="font-bold font-sans">Client Overview</h1>
					<form className="relative max-w-md mb-4" onSubmit={(e) => e.preventDefault()}>
						<input
							type="text"
							placeholder="Search clients..."
							className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-sans"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
					</form>
				</div>
			</div>
			<div>
				<div className="bg-white p-5 rounded shadow col-span-4">Big Box 2</div>
			</div>
			<h1>Welcome, {username}</h1>

			<form method="POST" action="/signout">
				<button type="submit" className="px-4 py-2 mt-4 bg-red-500 text-white rounded">
					Sign Out
				</button>
			</form>
		</div>
	)
}
