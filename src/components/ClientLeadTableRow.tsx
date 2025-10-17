"use client"

import { issueCreditToLead } from "@/lib/supabase/credits"
import { useRouter } from "next/navigation"

export type LeadCardProps = {
	id: number
	createdAt?: string
	leadName?: string
	phone?: string
	address?: string
	status?: string
	onLeadUpdated?: () => void
}

export default function ClientLeadTableRow({
	id,
	createdAt,
	leadName,
	phone,
	address,
	status,
	onLeadUpdated,
}: LeadCardProps) {
	const router = useRouter()

	const handleView = () => {
		console.log("view")
	}

	const handleCredit = async () => {
		console.log(id)
		try {
			const reason = "poor_lead_quality"

			await issueCreditToLead({
				leadId: id,
				creditAmount: 1,
				reason: reason,
			})

			console.log("Lead credited successfully!")
			router.refresh()
			onLeadUpdated?.()
		} catch (error) {
			console.error("Failed to credit lead:", error)
			alert("Something went wrong when crediting the lead.")
		}
	}

	const statusObject = () => {
		let bg = "bg-red-100"
		let text = "text-red-500"
		let statusText = "Credited"
		switch (status) {
			case "paid":
				bg = "bg-green-100"
				text = "text-green-500"
				statusText = "Paid"
				break
			case "billable":
				bg = "bg-blue-100"
				text = "text-blue-700"
				statusText = "Billable"
				break
			case "paid_by_credit":
				bg = "bg-purple-100"
				text = "text-purple-500"
				statusText = "Paid By Credit"
				break
		}
		return (
			<div>
				<span className={`inline-flex items-center ${bg} rounded-xl px-2.5 py-0.5 gap-1`}>
					<p className={`${text} text-small font-sans truncate`}>{statusText}</p>
				</span>
			</div>
		)
	}

	const formattedTime = createdAt
		? new Date(createdAt).toLocaleString("en-US", {
				timeZone: "America/New_York",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
		  })
		: "-"

	return (
		<div className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center">
			<p className="ml-2 flex justify-start text-small font-sans font-medium text-gray-700">
				{formattedTime}
			</p>
			<p className="text-small font-sans font-medium text-gray-700 ml-[15%]"> {leadName}</p>
			<p className="text-small font-sans font-medium text-gray-700">{phone}</p>
			<p className="text-small font-sans font-medium text-gray-600">{address}</p>
			{statusObject()}
			<div className="flex gap-10 justify-end mr-2">
				<button className="text-small text-blue-500 font-medium hover:cursor-pointer">
					View
				</button>
				{status == "credited" ? (
					<div>
						<h1 className="text-small text-gray-400 font-medium">Credited</h1>
					</div>
				) : (
					<button
						onClick={handleCredit}
						className="text-small text-red-500 font-medium hover:cursor-pointer"
					>
						Add Credit
					</button>
				)}
			</div>
		</div>
	)
}
