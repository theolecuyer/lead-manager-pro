"use client"

import AdminHeader from "@/components/AdminHeader"
import React, { useEffect, useState } from "react"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import { getReportById } from "@/lib/supabase/reports"
import type { DailyReport } from "../page"
import { useRouter } from "next/navigation"

interface ReportPageProps {
	params: Promise<{ id: string }>
}

export default function ReportPage({ params }: ReportPageProps) {
	const { id } = React.use(params)
	const reportId = parseInt(id)
	const [isLoading, setIsLoading] = useState(true)
	const [report, setReport] = useState<DailyReport | null>(null)
	const router = useRouter()
	useEffect(() => {
		async function fetchClient() {
			try {
				setIsLoading(true)
				const [reportData] = await Promise.all([
					getReportById(reportId),
					//TODO: Other info here
				])
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

	if (isLoading) return <p className="text-center p-10">Loading report...</p>

	const formattedDate = formatDate(report?.report_date)
	const weekdayDate = formatDateWithWeekday(report?.report_date)

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
						Daily Report - {weekdayDate}
					</h1>
				</div>
			}
		>
			<div className="p-6 bg-white rounded-md shadow">
				<p className="text-gray-600">{report?.id}</p>
			</div>
		</AdminHeader>
	)
}
