"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"
import AdminHeader from "@/components/AdminHeader"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { getClientById } from "@/lib/supabase/clients"
import type { Client } from "../../dashboard/page"

interface ClientPageProps {
	params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
	const { id } = React.use(params)
	const clientId = parseInt(id)
	const [client, setClient] = useState<Client | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		async function fetchClient() {
			try {
				setIsLoading(true)
				const data = await getClientById(clientId)
				setClient(data)
			} catch (error) {
				console.error("Error fetching client:", error)
				router.push("/admin/clients")
			} finally {
				setIsLoading(false)
			}
		}

		if (clientId) {
			fetchClient()
		}
	}, [clientId, router])

	if (isLoading) return <p className="text-center p-10">Loading client...</p>

	if (!client) return null

	const netBillable = client.leads_paid_today
	const credited = client.leads_received_today - client.leads_paid_today

	const editClient = () => {
		console.log("editing client")
	}

	return (
		<AdminHeader
			header={
				<div className="flex flex-col justify-center gap-1 h-full">
					<div className="flex items-center text-sm">
						<button
							onClick={() => router.push(`/admin/dashboard`)}
							className="hover:cursor-pointer text-slate-600"
						>
							Dashboard
						</button>
						<ChevronRightIcon className="h-4 w-4 mx-1 text-slate-600" />
						<button
							onClick={() => router.push(`/admin/clients`)}
							className="hover:cursor-pointer font-medium text-gray-900"
						>
							Clients
						</button>
						<ChevronRightIcon className="h-4 w-4 mx-1 text-slate-600" />
						<button
							onClick={() => router.push(`/admin/clients/${client.id}`)}
							className="hover:cursor-pointer font-medium text-gray-900"
						>
							{client.name}
						</button>
					</div>
					<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">
						{client.name}
					</h1>
					<h1 className="text-sm text-gray-700">Client Details & Lead Management</h1>
				</div>
			}
			rightAction={
				<button
					onClick={editClient}
					className="flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
				>
					Edit Client Info +
				</button>
			}
		>
			<div className="p-10">
				<h1 className="text-2xl font-bold mb-2">{client.name}</h1>
				<p className="text-gray-700">Leads Received Today: {client.leads_received_today}</p>
				<p className="text-gray-700">Net Billable Today: {netBillable}</p>
				<p className="text-gray-700">Credited Today: {credited}</p>
				<p className="text-gray-700">Credit Balance: {client.credit_balance}</p>
				<p className="text-gray-700">Credits Issued Today: {client.credits_issued_today}</p>
				<p className="text-gray-700">Email: {client.email || "N/A"}</p>
				<p className="text-gray-700">Phone: {client.phone || "N/A"}</p>
				<p className="text-gray-700">Status: {client.active ? "Active" : "Inactive"}</p>
			</div>
		</AdminHeader>
	)
}
