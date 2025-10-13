"use client"

import AdminHeader from "@/components/AdminHeader"
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"
import type { Client } from "../dashboard/page"
import { getAllClients } from "@/lib/supabase/clients"

export default function AdminClients() {
	const [search, setSearch] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const [isSortOpen, setIsSortOpen] = useState(false)
	const [statusFilter, setStatusFilter] = useState("all")
	const [isStatusOpen, setIsStatusOpen] = useState(false)
	const [currentClientPage, setCurrentClientPage] = useState(1)
	const [isLoadingClients, setIsLoadingClients] = useState(true)
	const [clients, setClients] = useState<Client[]>([])

	const sortOptions = [
		{ value: "name", label: "Sort by Name (A-Z)" },
		{ value: "leads", label: "Sort by Leads" },
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

	return (
		<AdminHeader
			header={
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-bold">Clients</h1>
					<button
						onClick={handleAddClient}
						className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white hover:cursor-pointer"
					>
						Add New Client +
					</button>
				</div>
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
					<p className="text-small font-sans font-medium text-gray-600">CONTACT</p>
					<p className="text-small font-sans font-medium text-gray-600">STATUS</p>
					<p className="text-small font-sans font-medium text-gray-600">TOTAL LEADS</p>
					<p className="text-small font-sans font-medium text-gray-600">THIS MONTH</p>
					<p className="flex justify-end text-small font-sans font-medium text-gray-600 mr-2">
						ACTIONS
					</p>
				</div>
			</div>
		</AdminHeader>
	)
}
