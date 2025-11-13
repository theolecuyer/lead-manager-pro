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
	lifetime_revenue?: number
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
	lifetime_revenue,
}: ClientTableProps) {
	const router = useRouter()
	const handleClientClick = () => {
		router.push(`/admin/clients/${id}`)
	}

	let creditColor
	if (credits != undefined) {
		creditColor = credits > 0 ? "text-red-500" : "text-gray-700"
	} else {
		credits = 0
		creditColor = "text-gray-700"
	}

	const handleView = () => {
		console.log("view")
	}

	const statusObject = () => {
		let bg, text, statusText
		switch (status) {
			case true:
				bg = "bg-green-100"
				text = "text-green-500"
				statusText = "Active"
				break
			case false:
				bg = "bg-red-100"
				text = "text-red-700"
				statusText = "Inactive"
				break
		}
		return (
			<div className="ml-2">
				<span className={`inline-flex items-center ${bg} rounded-xl px-2.5 py-0.5 gap-1`}>
					<p className={`${text} text-small font-sans truncate`}>{statusText}</p>
				</span>
			</div>
		)
	}

	return (
		<div
			onClick={handleClientClick}
			className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center hover:bg-gray-100 hover:cursor-pointer transition-colors"
		>
			<p className="ml-2 flex justify-start text-sm font-semibold font-sans">{clientName}</p>
			{statusObject()}
			<div>
				<p className="text-medium font-sans font-semibold">{totalLeads}</p>
				<p className="text-xs">all time</p>
			</div>
			<div>
				<p className="text-medium font-sans font-semibold">{today}</p>
				<p className="text-xs">today</p>
			</div>
			<p className={`text-medium font-sans font-semibold ${creditColor}`}>{credits}</p>
			<p className="text-sm font-sans font-semibold">${lifetime_revenue}</p>
		</div>
	)
}
