"use client"

import { redirect } from "next/navigation"
import DashboardIcon from "@/components/DashboardIcon"
import { useAuth } from "@/providers/AuthProvider"
import {
	ArrowUpTrayIcon,
	CreditCardIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	MagnifyingGlassIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/solid"
import { useState, useEffect, useRef } from "react"
import ClientCardComponent from "@/components/ClientIcon"
import Pagination from "@/components/Pagination"
import AdminHeader from "@/components/AdminHeader"
import { getAllClients } from "@/lib/supabase/clients"
import { Database } from "@/lib/supabase/database.types"
import { getTodaysLeads } from "@/lib/supabase/leads"
import LeadTableRow from "@/components/LeadTableRow"

export type Client = Database["public"]["Tables"]["clients"]["Row"]
export type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default function AdminDashboard() {
	const { user, profile, loading } = useAuth()
	const [search, setSearch] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const [isOpen, setIsOpen] = useState(false)
	const [currentClientPage, setCurrentClientPage] = useState(1)
	const [itemsPerClientPage, setItemsPerClientPage] = useState(8)
	const [clients, setClients] = useState<Client[]>([])
	const [isLoadingClients, setIsLoadingClients] = useState(true)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const [todaysLeads, setTodaysLeads] = useState<any[]>([])

	const sortOptions = [
		{ value: "name", label: "Sort by Name" },
		{ value: "leads", label: "Sort by Leads" },
		{ value: "credits", label: "Sort by Credits" },
	]

	const handleSortChange = (value: string) => {
		setSortBy(value)
		setIsOpen(false)
		setCurrentClientPage(1)
	}

	// Fetch Dashboard from Supabase (Clients, Leads)
	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoadingClients(true)

				// fetch both in parallel
				const [clientData, leadData] = await Promise.all([
					getAllClients(),
					getTodaysLeads(),
				])

				setClients(clientData)
				setTodaysLeads(leadData)
			} catch (error) {
				console.error("Error fetching dashboard data:", error)
			} finally {
				setIsLoadingClients(false)
			}
		}

		if (user) {
			fetchData()
		}
	}, [user])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	useEffect(() => {
		if (!loading && !user) redirect("/login")
	}, [user, loading])

	const filteredClients = clients
		.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return (a.name || "").localeCompare(b.name || "")
				case "leads":
					return b.leads_received_today - a.leads_received_today
				case "credits":
					return b.credit_balance - a.credit_balance
				default:
					return 0
			}
		})

	// Set clients per page size
	useEffect(() => {
		const updateItemsPerPage = () => {
			const width = window.innerWidth
			let columns = 2 // mobile (2 columns)

			if (width >= 1024) {
				columns = 4 // lg: 4 columns
			} else if (width >= 768) {
				columns = 3 // md: 3 columns
			}

			// 2 rows per page
			setItemsPerClientPage(columns * 2)
		}

		updateItemsPerPage()
		window.addEventListener("resize", updateItemsPerPage)
		return () => window.removeEventListener("resize", updateItemsPerPage)
	}, [])

	useEffect(() => {
		setCurrentClientPage(1)
	}, [search])

	const totalClientPages = Math.ceil(filteredClients.length / itemsPerClientPage)
	const startClientIndex = (currentClientPage - 1) * itemsPerClientPage
	const paginatedClients = filteredClients.slice(
		startClientIndex,
		startClientIndex + itemsPerClientPage
	)

	const totalClients = clients.filter((c) => c.active).length
	const leadsToday = clients.reduce((sum, client) => sum + client.leads_received_today, 0)
	const creditsToday = clients.reduce((sum, client) => sum + client.credits_issued_today, 0)
	const billedToday = clients.reduce((sum, client) => sum + client.leads_paid_today, 0)

	if (loading || isLoadingClients) return <p className="text-center">Loading...</p>

	return (
		<AdminHeader header={<h1 className="text-xl font-semibold">Dashboard Overview</h1>}>
			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<DashboardIcon
						icon={ArrowUpTrayIcon}
						textcolor="text-black"
						color1="bg-blue-100"
						color2="text-blue-500"
						numToday={leadsToday}
						numYesterday={8}
						title="Leads Delivered Today"
					/>
					<DashboardIcon
						icon={CreditCardIcon}
						textcolor="text-black"
						color1="bg-red-100"
						color2="text-red-500"
						numToday={creditsToday}
						numYesterday={12}
						title="Credits Issued Today"
					/>
					<DashboardIcon
						icon={CurrencyDollarIcon}
						textcolor="text-green-500"
						color1="bg-green-100"
						color2="text-green-500"
						numToday={billedToday}
						numYesterday={8}
						title="Net Billable Leads"
					/>
					<DashboardIcon
						icon={UserGroupIcon}
						textcolor="text-black"
						color1="bg-purple-100"
						color2="text-purple-500"
						numToday={totalClients}
						numYesterday={6}
						title="Active Clients"
					/>
				</div>
				<div>
					<div className="bg-white p-5 rounded shadow col-span-4">
						<h1 className="font-bold font-sans">Client Overview</h1>
						<div className="flex items-center gap-3 my-5">
							<div className="relative flex-1 max-w-md">
								<MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
								<input
									type="text"
									placeholder="Search clients..."
									className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-sans"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<div
								className="relative w-full min-w-[140px] max-w-[180px]"
								ref={dropdownRef}
							>
								<button
									onClick={() => setIsOpen(!isOpen)}
									className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between gap-2 hover:cursor-pointer"
								>
									<span className="text-sm text-gray-700 truncate">
										{sortOptions.find((opt) => opt.value === sortBy)?.label}
									</span>
									<ChevronDownIcon
										className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
											isOpen ? "rotate-180" : ""
										}`}
									/>
								</button>

								{isOpen && (
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
						<div className="bg-gray-200 w-[calc(100%+2.5rem)] h-px -mx-5"></div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-4">
							{paginatedClients.map((client) => (
								<ClientCardComponent
									key={client.id}
									id={client.id}
									name={client.name || "Unknown"}
									leadsToday={client.leads_received_today}
									billedToday={client.leads_paid_today}
								/>
							))}
						</div>
						<div className="bg-gray-200 w-[calc(100%+2.5rem)] h-px -mx-5 my-5"></div>
						<Pagination
							name="clients"
							currentPage={currentClientPage}
							totalPages={totalClientPages}
							itemsPerPage={itemsPerClientPage}
							totalItems={filteredClients.length}
							onPageChange={setCurrentClientPage}
						/>
					</div>
				</div>
				<div>
					<div className="bg-white p-5 rounded shadow col-span-4">
						<h1 className="font-bold font-sans">Today's Leads</h1>
						<p className="text-xs font-sans mt-0.5">
							All leads recieved today across all clients
						</p>

						<div className="grid grid-cols-6 grid-rows-1 border-y border-gray-200 bg-gray-50 p-3 px-5 -mx-5 mt-5 items-center">
							<p className="text-small font-sans font-medium text-gray-600">CLIENT</p>
							<p className="text-small font-sans font-medium text-gray-600">
								LEAD NAME
							</p>
							<p className="text-small font-sans font-medium text-gray-600">PHONE</p>
							<p className="text-small font-sans font-medium text-gray-600">TIME</p>
							<p className="text-small font-sans font-medium text-gray-600">STATUS</p>
							<p className="flex justify-end text-small font-sans font-medium text-gray-600">
								ACTIONS
							</p>
						</div>

						<div className="flex flex-col -mx-5">
							{todaysLeads.length > 0 ? (
								todaysLeads.map((lead) => (
									<LeadTableRow
										key={lead.id}
										id={lead.id}
										clientName={lead.client_name || "Unknown"}
										leadName={lead.lead_name}
										phone={lead.lead_phone}
										createdAt={lead.created_at}
										status={lead.payment_status}
									/>
								))
							) : (
								<p className="text-center text-sm text-gray-500 py-4">
									No leads received today.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</AdminHeader>
	)
}
