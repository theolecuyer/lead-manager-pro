"use client"

import { issueCreditToLead } from "@/lib/supabase/credits"
import { useRouter } from "next/navigation"

export type ClientTableProps = {
	id: number
	clientName?: string
	phone?: string
	email?: string
	status?: boolean
	totalLeads?: number
	today?: number
	credits?: number
}

export default function ClientTableRow({
	id,
	clientName,
	phone,
	email,
	status,
	totalLeads,
	today,
	credits,
}: ClientTableProps) {
	const router = useRouter()
	const handleClientClick = () => {
		router.push(`/admin/clients/${id}`)
	}

	const handleView = () => {
		console.log("view")
	}

	const statusObject = () => {
		let bg = "bg-red-100"
		let text = "text-red-500"
		let statusText = "Credited"
		switch (status) {
			case true:
				bg = "bg-green-100"
				text = "text-green-500"
				statusText = "Paid"
			case false:
				bg = "bg-blue-100"
				text = "text-blue-700"
				statusText = "Billable"
		}
		return (
			<div>
				<span className={`inline-flex items-center ${bg} rounded-xl px-2.5 py-0.5 gap-1`}>
					<p className={`${text} text-small font-sans truncate`}>{statusText}</p>
				</span>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center">
			<button
				onClick={handleClientClick}
				className="ml-2 flex justify-start text-small text-blue-500 font-sans font-semibold hover:cursor-pointer"
			>
				{clientName}
			</button>
			<p className="text-small font-sans font-medium text-gray-700"> {clientName}</p>
			<p className="text-small font-sans font-medium text-gray-700">{phone}</p>
			<p className="text-small font-sans font-medium text-gray-600">{status}</p>
			{statusObject()}
			<div className="flex gap-10 justify-end mr-2">
				<button className="text-small text-blue-500 font-medium hover:cursor-pointer">
					View
				</button>
			</div>
		</div>
	)
}
