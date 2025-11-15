"use client"

import AdminHeader from "@/components/AdminHeader"
import { redirect } from "next/navigation"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import { Database } from "@/lib/supabase/database.types"
import { useAuth } from "@/providers/AuthProvider"
import { useState, useEffect, useRef } from "react"
import { getAllReports } from "@/lib/supabase/reports"
import Pagination from "@/components/Pagination"
import ReportTableRow from "@/components/ReportTableRow"
import { Spinner } from "@heroui/react"

export type DailyReport = Database["public"]["Tables"]["daily_reports"]["Row"]

export default function AdminReports() {
	const { user, loading } = useAuth()
	const [reports, setReports] = useState<DailyReport[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const hasFetched = useRef(false)

	useEffect(() => {
		if (!loading && !user) redirect("/login")
	}, [user, loading])

	useEffect(() => {
		if (hasFetched.current) return

		async function fetchReports() {
			try {
				setIsLoading(true)
				const data = await getAllReports()
				setReports(data)
				hasFetched.current = true
			} catch (error) {
				console.error("Error fetching reports:", error)
			} finally {
				setIsLoading(false)
			}
		}
		if (user) fetchReports()
	}, [user])

	const totalPages = Math.ceil(reports.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedReports = reports.slice(startIndex, startIndex + itemsPerPage)

	return (
		<AdminHeader
			header={
				<div className="flex flex-col justify-center gap-1 h-full">
					<BreadcrumbHeader
						crumbs={[
							{ content: "Dashboard", href: "/admin/dashboard" },
							{ content: "Reports", href: "/admin/reports" },
						]}
					/>
					<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">
						Daily Reports
					</h1>
					<h1 className="text-sm text-gray-700">
						Automated daily summaries generated at 7pm EST
					</h1>
				</div>
			}
		>
			<div className="relative">
				{isLoading && (
					<div className="absolute inset-0 -inset-x-6 -inset-y-6 flex justify-center backdrop-blur-sm z-50 min-h-full">
						<div className="flex flex-col items-center mt-70">
							<Spinner color="primary" size="lg" />
							<p className="mt-3 text-blue-700 font-medium">Loading...</p>
						</div>
					</div>
				)}
				<div className={`${isLoading ? "blur-sm pointer-events-none select-none" : ""}`}>
					<div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
						{/* Header row */}
						<div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 p-3 px-5 items-center">
							<p className="text-xs font-medium text-gray-600">DATE</p>
							<p className="text-xs font-medium text-gray-600 ml-5">TOTAL LEADS</p>
							<p className="text-xs font-medium text-gray-600">CREDITS ISSUED</p>
							<p className="text-xs font-medium text-gray-600">NET BILLABLE</p>
							<p className="text-xs font-medium text-gray-600">ACTIVE CLIENTS</p>
							<p className="text-xs font-medium text-gray-600">TOTAL REVENUE</p>
						</div>

						{/* Report rows */}
						<div className="flex flex-col divide-y divide-gray-100">
							{paginatedReports.length > 0 ? (
								paginatedReports.map((report) => (
									<ReportTableRow
										key={report.id}
										id={report.id}
										reportDate={report.report_date}
										totalLeads={report.total_leads}
										totalCredits={report.total_credits}
										netBillable={report.net_billable}
										activeClients={report.active_clients_count}
										totalRevenue={report.total_revenue}
									/>
								))
							) : (
								<p className="text-center text-sm text-gray-500 py-10">
									No reports available.
								</p>
							)}
						</div>

						{/* Pagination footer */}
						<div className="border-t border-gray-200 bg-gray-50 p-3 px-5">
							<Pagination
								name="reports"
								currentPage={currentPage}
								totalPages={totalPages}
								itemsPerPage={itemsPerPage}
								totalItems={reports.length}
								onPageChange={setCurrentPage}
							/>
						</div>
					</div>
				</div>
			</div>
		</AdminHeader>
	)
}
