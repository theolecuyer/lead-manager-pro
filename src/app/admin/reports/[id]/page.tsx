"use client"

import AdminHeader from "@/components/AdminHeader"
import React, { useEffect, useState } from "react"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import { getReportById } from "@/lib/supabase/reports"
import type { DailyReport } from "../page"
import { useRouter } from "next/navigation"
import DashboardIcon from "@/components/DashboardIcon"
import ReportClientTableRow from "@/components/ReportClientTableRow"
import Pagination from "@/components/Pagination"
import {
	UserGroupIcon,
	MinusCircleIcon,
	CurrencyDollarIcon,
	BuildingOfficeIcon,
	BanknotesIcon,
} from "@heroicons/react/24/solid"

interface ReportPageProps {
	params: Promise<{ id: string }>
}

type ClientBreakdown = {
	client_id: number
	client_name: string
	leads_delivered: number
	credits_issued: number
	net_billable: number
	revenue: number
}

export default function ReportPage({ params }: ReportPageProps) {
	const { id } = React.use(params)
	const reportId = parseInt(id)
	const [isLoading, setIsLoading] = useState(true)
	const [report, setReport] = useState<DailyReport | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)
	const router = useRouter()

	useEffect(() => {
		async function fetchClient() {
			try {
				setIsLoading(true)
				const [reportData] = await Promise.all([getReportById(reportId)])
				setReport(reportData)
			} catch (error) {
				console.error("Error fetching report:", error)
				router.push("/admin/reports")
			} finally {
				setIsLoading(false)
			}
		}

		if (reportId) {
			fetchClient()
		}
	}, [reportId, router])

	function formatDate(dateString?: string) {
		if (!dateString) return "--"

		const [year, month, day] = dateString.split("-").map(Number)
		const date = new Date(year, month - 1, day)

		const monthName = date.toLocaleDateString("en-US", { month: "long" })
		const dayNum = date.getDate()
		const yearNum = date.getFullYear()

		const getOrdinal = (n: number) => {
			const s = ["th", "st", "nd", "rd"]
			const v = n % 100
			return s[(v - 20) % 10] || s[v] || s[0]
		}

		return `${monthName} ${dayNum}${getOrdinal(dayNum)}, ${yearNum}`
	}

	function formatDateWithWeekday(dateString?: string) {
		if (!dateString) return "--"

		const [year, month, day] = dateString.split("-").map(Number)
		const date = new Date(year, month - 1, day)

		const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
		const monthName = date.toLocaleDateString("en-US", { month: "long" })
		const dayNum = date.getDate()
		const yearNum = date.getFullYear()

		const getOrdinal = (n: number) => {
			const s = ["th", "st", "nd", "rd"]
			const v = n % 100
			return s[(v - 20) % 10] || s[v] || s[0]
		}

		return `${weekday}, ${monthName} ${dayNum}${getOrdinal(dayNum)}, ${yearNum}`
	}

	const formatRevenue = (revenue?: number) => {
		if (!revenue) return "0.00"

		const num = Number(revenue)
		if (isNaN(num)) return revenue.toString()

		return num.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	}

	if (isLoading) return <p className="text-center p-10">Loading report...</p>

	const formattedDate = formatDate(report?.report_date)
	const weekdayDate = formatDateWithWeekday(report?.report_date)
	const formattedRevenue = formatRevenue(report?.total_revenue)
	const clientAverage = formatRevenue(
		(report?.total_revenue ?? 0) / (report?.active_clients_count ?? 1)
	)
	const leadAverage = formatRevenue((report?.total_revenue ?? 0) / (report?.net_billable ?? 1))

	// Extract clients from JSONB
	const clients: ClientBreakdown[] = (report?.client_breakdown as any)?.clients || []

	// Sort by revenue descending
	const sortedClients = [...clients].sort((a, b) => b.revenue - a.revenue)

	// Pagination
	const totalPages = Math.ceil(sortedClients.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage)

	return (
		<AdminHeader
			header={
				<div className="flex flex-col justify-center gap-1 h-full">
					<BreadcrumbHeader
						crumbs={[
							{ content: "Dashboard", href: "/admin/dashboard" },
							{ content: "Reports", href: "/admin/reports" },
							{
								content: `${formattedDate}`,
								href: `/admin/reports/${report?.id}`,
							},
						]}
					/>
					<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">
						Daily Report
					</h1>
					<h1 className="text-sm text-gray-700">{weekdayDate}</h1>
				</div>
			}
		>
			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<DashboardIcon
						icon={UserGroupIcon}
						stats={false}
						statsText="leads delivered"
						textcolor="text-black"
						color1="bg-blue-100"
						color2="text-blue-600"
						borderColor="border-blue-600"
						numToday={report?.total_leads ?? 0}
						comparison={0}
						comparisonTime=""
						title="Total Leads"
					/>
					<DashboardIcon
						icon={MinusCircleIcon}
						stats={false}
						statsText="poor quality leads"
						textcolor="text-black"
						color1="bg-red-100"
						color2="text-red-600"
						borderColor="border-red-500"
						numToday={report?.total_credits ?? 0}
						comparison={0}
						comparisonTime=""
						title="Total Credits"
					/>
					<DashboardIcon
						icon={CurrencyDollarIcon}
						stats={false}
						statsText="leads billed"
						textcolor="text-green-600"
						color1="bg-green-100"
						color2="text-green-600"
						borderColor="border-green-600"
						numToday={report?.net_billable ?? 0}
						comparison={0}
						comparisonTime=""
						title="Net Billable Leads"
					/>
					<DashboardIcon
						icon={BuildingOfficeIcon}
						stats={false}
						statsText="clients recieved leads"
						textcolor="text-black"
						color1="bg-purple-100"
						color2="text-purple-600"
						borderColor="border-purple-600"
						numToday={report?.active_clients_count ?? 0}
						comparison={0}
						comparisonTime=""
						title="Active Clients"
					/>
				</div>

				<div className="grid grid-cols-2 bg-green-50 p-5 rounded-md border border-green-200">
					<div className="flex items-center justify-start gap-2">
						<div className="bg-green-100 px-3 py-5 sm:px-4 sm:py-6 lg:px-3 lg:py-3 xl:px-4 xl:py-6 rounded-lg">
							<BanknotesIcon className="h-6 w-6 xl:h-8 xl:w-8 text-green-600" />
						</div>
						<div className="flex flex-col">
							<p className="font-sans text-medium text-gray-500">Total Revenue</p>
							<p className="text-green-600 text-3xl font-sans font-semibold">
								${formattedRevenue}
							</p>
						</div>
					</div>
					<div className="flex flex-col items-end gap-2">
						<div className="flex flex-col items-end">
							<p className="font-sans text-sm text-gray-500">Avg per Client</p>
							<p className="font-sans text-lg font-semibold text-gray-700">
								${clientAverage}
							</p>
						</div>
						<div className="flex flex-col items-end">
							<p className="font-sans text-sm text-gray-500">Avg per Lead</p>
							<p className="font-sans text-lg font-semibold text-gray-700">
								${leadAverage}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-5 rounded-md shadow">
					<p className="text-lg font-bold font-sans">Client Breakdown</p>
					<p className="text-xs font-sans mt-0.5">
						Lead distribution and collected revenue by client for {weekdayDate}
					</p>
					<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-y border-gray-200 bg-gray-50 gap-x-5 p-3 px-5 -mx-5 mt-5 items-center text-gray-600 font-sans font-medium text-sm">
						<p className="text-start">CLIENT NAME</p>
						<p className="text-center">LEADS DELIVERED</p>
						<p className="text-center">CREDITS ISSUED</p>
						<p className="text-center">NET BILLABLE</p>
						<p className="text-end">REVENUE</p>
					</div>
					<div className="flex flex-col -mx-5">
						{paginatedClients.length > 0 ? (
							paginatedClients.map((client) => (
								<ReportClientTableRow
									key={client.client_id}
									client_id={client.client_id}
									client_name={client.client_name}
									leads_delivered={client.leads_delivered}
									credits_issued={client.credits_issued}
									net_billable={client.net_billable}
									revenue={client.revenue}
								/>
							))
						) : (
							<p className="text-center text-sm text-gray-500 p-5">
								No client activity on this day.
							</p>
						)}
					</div>
					<div className="rounded-b-md border-t border-gray-200 bg-gray-50 p-3 px-5 -mx-5 -my-5 mt-auto">
						<Pagination
							name="clients"
							currentPage={currentPage}
							totalPages={totalPages}
							itemsPerPage={itemsPerPage}
							totalItems={sortedClients.length}
							onPageChange={setCurrentPage}
						/>
					</div>
				</div>
			</div>
		</AdminHeader>
	)
}
