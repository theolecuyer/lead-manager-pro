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

export default function AdminDashboard() {
	const { user, profile, loading } = useAuth()
	const [search, setSearch] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const sortOptions = [
		{ value: "name", label: "Sort by Name" },
		{ value: "leads", label: "Sort by Leads" },
		{ value: "credits", label: "Sort by Credits" },
	]

	const handleSortChange = (value: string) => {
		setSortBy(value)
		setIsOpen(false)
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

	if (loading) return <p className="text-center">Loading user...</p>

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<DashboardIcon
					icon={ArrowUpTrayIcon}
					textcolor="text-black"
					color1="bg-blue-100"
					color2="text-blue-500"
					numToday={10}
					numYesterday={8}
					title="Leads Delivered Today"
				/>
				<DashboardIcon
					icon={CreditCardIcon}
					textcolor="text-black"
					color1="bg-red-100"
					color2="text-red-500"
					numToday={10}
					numYesterday={12}
					title="Credits Issued Today"
				/>
				<DashboardIcon
					icon={CurrencyDollarIcon}
					textcolor="text-green-500"
					color1="bg-green-100"
					color2="text-green-500"
					numToday={10}
					numYesterday={8}
					title="Net Billable Leads"
				/>
				<DashboardIcon
					icon={UserGroupIcon}
					textcolor="text-black"
					color1="bg-purple-100"
					color2="text-purple-500"
					numToday={10}
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
								className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between gap-2"
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
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 mt-5 gap-4">
						<ClientCardComponent
							id={1}
							name="Sarah Johnson"
							leadsToday={5}
							credits={2}
						/>
						<ClientCardComponent id={2} name="Emily Davis" leadsToday={4} credits={0} />
						<ClientCardComponent
							id={3}
							name="Lisa Thompson"
							leadsToday={2}
							credits={3}
						/>
						<ClientCardComponent
							id={4}
							name="Michael Chen"
							leadsToday={6}
							credits={0}
						/>
						<ClientCardComponent
							id={5}
							name="Christopher Perry"
							leadsToday={5}
							credits={1}
						/>
						<ClientCardComponent id={6} name="Bob Wallace" leadsToday={2} credits={1} />
					</div>
				</div>
			</div>
			<div>
				<div className="bg-white p-5 rounded shadow col-span-4">Big Box 2</div>
			</div>
		</div>
	)
}
