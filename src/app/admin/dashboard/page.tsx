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
import { clients, ClientData } from "@/data/testData"
import ClientCardComponent from "@/components/ClientIcon"
import Pagination from "@/components/Pagination"
import AdminHeader from "@/components/AdminHeader"

export default function AdminDashboard() {
	const { user, profile, loading } = useAuth()
	const [search, setSearch] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const [isOpen, setIsOpen] = useState(false)
	const [currentClientPage, setCurrentClientPage] = useState(1)
	const [itemsPerClientPage, setItemsPerClientPage] = useState(8)
	const dropdownRef = useRef<HTMLDivElement>(null)

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
		.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name)
				case "leads":
					return b.leadsToday - a.leadsToday
				case "credits":
					return b.credits - a.credits
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

	// Data points to use
	const totalClients = clients.length
	const leadsToday = clients.reduce((sum, client) => sum + client.leadsToday, 0)
	const creditsToday = clients.reduce((sum, client) => sum + client.creditsToday, 0)
	const billedToday = clients.reduce((sum, client) => sum + client.billedToday, 0)

	if (loading) return <p className="text-center">Loading user...</p>

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
							{paginatedClients.map((client: ClientData) => (
								<ClientCardComponent
									key={client.id}
									id={client.id}
									name={client.name}
									leadsToday={client.leadsToday}
									billedToday={client.billedToday}
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
					<div className="bg-white p-5 rounded shadow col-span-4">Big Box 2</div>
				</div>
			</div>
		</AdminHeader>
	)
}
