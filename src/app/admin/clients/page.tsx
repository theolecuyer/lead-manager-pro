"use client"

import AdminHeader from "@/components/AdminHeader"
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"
import type { Client } from "../dashboard/page"
import { getAllClients } from "@/lib/supabase/clients"
import ClientTableRow from "@/components/ClientTableRow"
import Pagination from "@/components/Pagination"
import { useAuth } from "@/providers/AuthProvider"
import { redirect, useRouter } from "next/navigation"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"

export default function AdminClients() {
	const { user, profile, loading } = useAuth()
	const [search, setSearch] = useState("")
	const [sortBy, setSortBy] = useState("leads_today")
	const [isSortOpen, setIsSortOpen] = useState(false)
	const [statusFilter, setStatusFilter] = useState("all")
	const [isStatusOpen, setIsStatusOpen] = useState(false)
	const [currentClientPage, setCurrentClientPage] = useState(1)
	const [isLoadingClients, setIsLoadingClients] = useState(true)
	const [itemsPerClientPage, setItemsPerClientPage] = useState(10)
	const [clients, setClients] = useState<Client[]>([])
	const router = useRouter()

	const sortOptions = [
		{ value: "name", label: "Sort by Name (A-Z)" },
		{ value: "leads_today", label: "Sort by Today's Leads" },
		{ value: "leads_total", label: "Sort by Total Leads" },
		{ value: "credits", label: "Sort by Credits" },
	]

	const statusOptions = [
		{ value: "all", label: "Any Status" },
		{ value: "active", label: "Active" },
		{ value: "paused", label: "Paused" },
		{ value: "suspended", label: "Suspended" },
	]

	const handleSortChange = (value: string) => {
		setSortBy(value)
		setIsSortOpen(false)
		setCurrentClientPage(1)
	}

	const handleStatusChange = (value: string) => {
		setStatusFilter(value)
		setIsStatusOpen(false)
		setCurrentClientPage(1)
	}

	const handleAddClient = () => {
		console.log("Adding client")
	}

	useEffect(() => {
		if (!loading && !user) redirect("/login")
	}, [user, loading])

	useEffect(() => {
		async function fetchClients() {
			setIsLoadingClients(true)
			try {
				const data = await getAllClients()
				setClients(data)
			} finally {
				setIsLoadingClients(false)
			}
		}

		fetchClients()
	}, [])

	const filteredClients = clients
		.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return (a.name || "").localeCompare(b.name || "")
				case "leads_today":
					return b.leads_received_today - a.leads_received_today
				case "leads_total":
					return b.total_leads_count - a.total_leads_count
				case "credits":
					return b.credit_balance - a.credit_balance
				default:
					return 0
			}
		})

	const totalClientPages = Math.ceil(filteredClients.length / itemsPerClientPage)
	const startClientIndex = (currentClientPage - 1) * itemsPerClientPage
	const paginatedClients = filteredClients.slice(
		startClientIndex,
		startClientIndex + itemsPerClientPage
	)

	return (
		<AdminHeader
			header={
				<div className="flex flex-col justify-center gap-1 h-full">
					<BreadcrumbHeader
						crumbs={[
							{ content: "Dashboard", href: "/admin/dashboard" },
							{ content: "Clients", href: "/admin/clients" },
						]}
					/>
					<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">Clients</h1>
					<h1 className="text-sm text-gray-700">
						{clients.length} Total Client{clients.length !== 1 && "s"}
					</h1>
				</div>
			}
			rightAction={
				<button
					onClick={handleAddClient}
					className="flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
				>
					Add New Client +
				</button>
			}
		>
			<div className="bg-white p-5 rounded-md shadow">
				<div className="flex items-center gap-3">
					<div className="relative flex-1">
						<MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
						<input
							type="text"
							placeholder="Search clients..."
							className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-sans"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="relative w-[160px]">
						<button
							onClick={() => setIsStatusOpen(!isStatusOpen)}
							className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between gap-2 hover:cursor-pointer"
						>
							<span className="text-sm text-gray-700 truncate">
								{statusOptions.find((opt) => opt.value === statusFilter)?.label}
							</span>
							<ChevronDownIcon
								className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
									isStatusOpen ? "rotate-180" : ""
								}`}
							/>
						</button>
						{isStatusOpen && (
							<div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
								{statusOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => handleStatusChange(option.value)}
										className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 first:rounded-t-md last:rounded-b-md ${
											statusFilter === option.value
												? "bg-blue-50 text-blue-600"
												: "text-gray-700"
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						)}
					</div>
					<div className="relative w-full min-w-[140px] max-w-[180px]">
						<button
							onClick={() => setIsSortOpen(!isSortOpen)}
							className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between gap-2 hover:cursor-pointer"
						>
							<span className="text-sm text-gray-700 truncate">
								{sortOptions.find((opt) => opt.value === sortBy)?.label}
							</span>
							<ChevronDownIcon
								className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
									isSortOpen ? "rotate-180" : ""
								}`}
							/>
						</button>

						{isSortOpen && (
							<div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
								{sortOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => handleSortChange(option.value)}
										className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 first:rounded-t-md last:rounded-b-md ${
											sortBy === option.value
												? "bg-blue-50 text-blue-600"
												: "text-gray-700"
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
				<div className="grid grid-cols-6 grid-rows-1 border-y border-gray-200 bg-gray-50 p-3 px-5 -mx-5 mt-5 items-center">
					<p className="text-small font-sans font-medium text-gray-600 ml-2">CLIENT</p>
					<p className="text-small font-sans font-medium text-gray-600 ml-2">STATUS</p>
					<p className="text-small font-sans font-medium text-gray-600">TOTAL LEADS</p>
					<p className="text-small font-sans font-medium text-gray-600">TODAY</p>
					<p className="text-small font-sans font-medium text-gray-600">CREDITS</p>
					<p className="text-small font-sans font-medium text-gray-600">
						LIFETIME REVENUE
					</p>
				</div>
				<div className="flex flex-col -mx-5">
					{paginatedClients.length > 0 ? (
						paginatedClients.map((client) => (
							<ClientTableRow
								key={client.id}
								id={client.id}
								clientName={client.name || "Unknown"}
								phone={client?.phone || "Unknown"}
								email={client.email || "Unknown"}
								status={client?.active || undefined}
								totalLeads={client.total_leads_count}
								today={client.leads_received_today}
								credits={client.credit_balance}
								lifetime_revenue={client.lifetime_revenue}
							/>
						))
					) : (
						<p className="text-center text-sm text-gray-500 p-5">No clients found.</p>
					)}
				</div>
				<div className="rounded-b-md border-t border-gray-200 bg-gray-50 p-3 px-5 -mx-5 -my-5 mt-auto">
					<Pagination
						name="clients"
						currentPage={currentClientPage}
						totalPages={totalClientPages}
						itemsPerPage={itemsPerClientPage}
						totalItems={paginatedClients.length}
						onPageChange={setCurrentClientPage}
					/>
				</div>
			</div>
		</AdminHeader>
	)
}
