"use client"

import { useRouter } from "next/navigation"

export type ReportTableProps = {
	id: number
	reportDate?: string
	totalLeads?: number
	totalCredits?: number
	netBillable?: number
	activeClients?: number
	totalRevenue?: number
}

export default function ReportTableRow({
	id,
	reportDate,
	totalLeads,
	totalCredits,
	netBillable,
	activeClients,
	totalRevenue,
}: ReportTableProps) {
	const router = useRouter()

	const handleReportClick = () => {
		router.push(`/admin/reports/${id}`)
	}

	// Format date helper
	function formatDate(dateString?: string) {
		if (!dateString) return "--"
		const date = new Date(dateString)

		const month = date.toLocaleDateString("en-US", { month: "long" })
		const day = date.getDate()
		const year = date.getFullYear()

		const getOrdinal = (n: number) => {
			const s = ["th", "st", "nd", "rd"]
			const v = n % 100
			return s[(v - 20) % 10] || s[v] || s[0]
		}

		return `${month} ${day}${getOrdinal(day)}, ${year}`
	}

	const formattedDate = formatDate(reportDate)

	return (
		<div
			onClick={handleReportClick}
			className="grid grid-cols-6 border-y border-gray-100 bg-white p-3 px-5 items-center hover:bg-gray-100 hover:cursor-pointer transition-colors"
		>
			<p className="text-sm font-sans font-semibold text-gray-800 truncate whitespace-nowrap">
				{formattedDate}
			</p>
			<p className="text-sm font-sans font-medium text-gray-700 ml-5">{totalLeads ?? 0}</p>
			<p className="text-sm font-sans font-medium text-gray-700">{totalCredits ?? 0}</p>
			<p className="text-sm font-sans font-medium text-gray-700">{netBillable ?? 0}</p>
			<p className="text-sm font-sans font-medium text-gray-700">{activeClients ?? 0}</p>
			<p className={`text-sm font-sans font-semibold`}>
				${totalRevenue?.toLocaleString() ?? 0}
			</p>
		</div>
	)
}
