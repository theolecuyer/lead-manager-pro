"use client"

import { useRouter } from "next/navigation"
export type ReportClientTableRowProps = {
	client_id: number
	client_name: string
	leads_delivered: number
	credits_issued: number
	net_billable: number
	revenue: number
}

export default function ReportClientTableRow({
	client_id,
	client_name,
	leads_delivered,
	credits_issued,
	net_billable,
	revenue,
}: ReportClientTableRowProps) {
	const formatRevenue = (amount: number) => {
		return amount.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	}

	const creditColor = credits_issued > 0 ? "text-red-500" : "text-gray-700"
	const router = useRouter()
	const handleClientClick = () => {
		router.push(`/admin/clients/${client_id}`)
	}

	return (
		<div
			onClick={handleClientClick}
			className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-x-5 border-b border-gray-100 p-3 px-5 items-center hover:bg-gray-50 hover:cursor-pointer transition-colors"
		>
			<p className="text-sm font-semibold font-sans text-start">{client_name}</p>
			<p className="text-sm font-sans font-semibold text-center">{leads_delivered}</p>
			<p className={`text-sm font-sans font-semibold text-center ${creditColor}`}>
				{credits_issued}
			</p>
			<p className="text-sm font-sans font-semibold text-center">{net_billable}</p>
			<p className="text-sm font-sans font-semibold text-end text-green-600">
				${formatRevenue(revenue)}
			</p>
		</div>
	)
}
