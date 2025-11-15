"use client"

import AdminHeader from "@/components/AdminHeader"
import { ChevronDownIcon, MagnifyingGlassIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"
import type { Client } from "../dashboard/page"
import { getAllClients, createNewClient } from "@/lib/supabase/clients"
import ClientTableRow from "@/components/ClientTableRow"
import Pagination from "@/components/Pagination"
import { useAuth } from "@/providers/AuthProvider"
import { redirect, useRouter } from "next/navigation"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import {
	Spinner,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
	Select,
	SelectItem,
} from "@heroui/react"

function formatPhoneNumber(value: string): string {
	// Remove all non-numeric characters
	const cleaned = value.replace(/\D/g, "")

	// Format as (XXX) XXX-XXXX
	if (cleaned.length <= 3) {
		return cleaned
	} else if (cleaned.length <= 6) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
	} else {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
	}
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

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
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	// Create client form state
	const [newName, setNewName] = useState("")
	const [newEmail, setNewEmail] = useState("")
	const [newPhone, setNewPhone] = useState("")
	const [newActive, setNewActive] = useState<boolean>(true)
	const [isSavingClient, setIsSavingClient] = useState(false)
	const [newNameError, setNewNameError] = useState("")
	const [newEmailError, setNewEmailError] = useState("")
	const [newPhoneError, setNewPhoneError] = useState("")
	const [newStatus, setNewStatus] = useState<"active" | "paused" | "suspended">("active")

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
		onOpen()
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

	useEffect(() => {
		if (isOpen) {
			// Reset form when modal opens
			setNewName("")
			setNewEmail("")
			setNewPhone("")
			setNewActive(true)
			setNewNameError("")
			setNewEmailError("")
			setNewPhoneError("")
		}
	}, [isOpen])

	async function handleCreateClient(onClose: () => void) {
		// Reset errors
		setNewNameError("")
		setNewEmailError("")
		setNewPhoneError("")

		let hasError = false

		// Validate name
		if (!newName || newName.trim().length === 0) {
			setNewNameError("Client name is required")
			hasError = true
		}

		// Validate email if provided
		if (newEmail && newEmail.trim().length > 0 && !validateEmail(newEmail.trim())) {
			setNewEmailError("Please enter a valid email address")
			hasError = true
		}

		// Validate phone if provided (should be 10 digits)
		const phoneDigits = newPhone.replace(/\D/g, "")
		if (newPhone && newPhone.trim().length > 0 && phoneDigits.length !== 10) {
			setNewPhoneError("Phone number must be 10 digits")
			hasError = true
		}

		if (hasError) return

		setIsSavingClient(true)
		try {
			await createNewClient({
				name: newName.trim(),
				email: newEmail?.trim() || undefined,
				phone: phoneDigits || undefined,
				status: newStatus,
			})

			// Refresh clients list
			const data = await getAllClients()
			setClients(data)
			onClose()
		} catch (err) {
			console.error("Failed to create client:", err)
			alert("Failed to create client. See console for details.")
		} finally {
			setIsSavingClient(false)
		}
	}

	const filteredClients = clients
		.filter((c) => {
			const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase())
			const matchesStatus = statusFilter === "all" || c.status === statusFilter

			return matchesSearch && matchesStatus
		})
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

	const isLoading = loading || isLoadingClients

	return (
		<>
			<AdminHeader
				header={
					<div className="flex flex-col justify-center gap-1 h-full">
						<BreadcrumbHeader
							crumbs={[
								{ content: "Dashboard", href: "/admin/dashboard" },
								{ content: "Clients", href: "/admin/clients" },
							]}
						/>
						<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">
							Clients
						</h1>
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
				<div className="relative">
					{isLoading && (
						<div className="absolute inset-0 -inset-x-6 -inset-y-6 flex justify-center backdrop-blur-sm z-50 min-h-full">
							<div className="flex flex-col items-center mt-60">
								<Spinner color="primary" size="lg" />
								<p className="mt-3 text-blue-700 font-medium">Loading...</p>
							</div>
						</div>
					)}
					<div
						className={`${isLoading ? "blur-sm pointer-events-none select-none" : ""}`}
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
											{
												statusOptions.find(
													(opt) => opt.value === statusFilter
												)?.label
											}
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
								<p className="text-small font-sans font-medium text-gray-600 ml-2">
									CLIENT
								</p>
								<p className="text-small font-sans font-medium text-gray-600 ml-2">
									STATUS
								</p>
								<p className="text-small font-sans font-medium text-gray-600">
									TOTAL LEADS
								</p>
								<p className="text-small font-sans font-medium text-gray-600">
									TODAY
								</p>
								<p className="text-small font-sans font-medium text-gray-600">
									CREDITS
								</p>
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
											status={
												client?.status as
													| "active"
													| "paused"
													| "suspended"
													| undefined
											}
											totalLeads={client.total_leads_count}
											today={client.leads_received_today}
											credits={client.credit_balance}
											lifetime_revenue={client.lifetime_revenue}
										/>
									))
								) : (
									<p className="text-center text-sm text-gray-500 p-5">
										No clients found.
									</p>
								)}
							</div>
							<div className="rounded-b-md border-t border-gray-200 bg-gray-50 p-3 px-5 -mx-5 -my-5 mt-auto">
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
					</div>
				</div>
			</AdminHeader>

			{/* Create Client Modal */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add New Client
								<div className="-mx-6 w-[calc(100%+3rem)] h-px bg-gray-200 mt-3"></div>
							</ModalHeader>

							<ModalBody>
								<div className="flex flex-col gap-4">
									<Input
										label="Client Name"
										placeholder="e.g. John Doe"
										value={newName}
										onValueChange={(value) => {
											setNewName(value)
											if (value.trim().length > 0) {
												setNewNameError("")
											}
										}}
										size="sm"
										isRequired
										isInvalid={!!newNameError}
										errorMessage={newNameError}
									/>

									<Input
										label="Email"
										placeholder="client@example.com"
										value={newEmail}
										onValueChange={(value) => {
											setNewEmail(value)
											if (!value || validateEmail(value.trim())) {
												setNewEmailError("")
											}
										}}
										onBlur={() => {
											if (
												newEmail &&
												newEmail.trim().length > 0 &&
												!validateEmail(newEmail.trim())
											) {
												setNewEmailError(
													"Please enter a valid email address"
												)
											}
										}}
										size="sm"
										type="email"
										isInvalid={!!newEmailError}
										errorMessage={newEmailError}
									/>

									<Input
										label="Phone"
										placeholder="(555) 555-5555"
										value={newPhone}
										onValueChange={(value) => {
											const formatted = formatPhoneNumber(value)
											setNewPhone(formatted)
											const digits = value.replace(/\D/g, "")
											if (!value || digits.length === 10) {
												setNewPhoneError("")
											}
										}}
										onBlur={() => {
											const digits = newPhone.replace(/\D/g, "")
											if (
												newPhone &&
												newPhone.trim().length > 0 &&
												digits.length !== 10
											) {
												setNewPhoneError("Phone number must be 10 digits")
											}
										}}
										size="sm"
										type="tel"
										maxLength={14}
										isInvalid={!!newPhoneError}
										errorMessage={newPhoneError}
									/>

									<Select
										label="Account Status"
										placeholder="Select status"
										size="sm"
										selectedKeys={[newStatus]}
										onSelectionChange={(keys) => {
											const v = Array.from(keys)[0] as string
											setNewStatus(v as "active" | "paused" | "suspended")
										}}
									>
										<SelectItem key="active">Active</SelectItem>
										<SelectItem key="paused">Paused</SelectItem>
										<SelectItem key="suspended">Suspended</SelectItem>
									</Select>

									<div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
										<p>
											<span className="font-medium">Note:</span> New clients
											are set to <span className="font-semibold">Active</span>{" "}
											by default. You can change this later if needed.
										</p>
									</div>
								</div>
							</ModalBody>

							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										setNewNameError("")
										setNewEmailError("")
										setNewPhoneError("")
										onClose()
									}}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									isLoading={isSavingClient}
									isDisabled={
										isSavingClient ||
										!newName ||
										newName.trim().length === 0 ||
										!!newNameError ||
										!!newEmailError ||
										!!newPhoneError
									}
									onPress={() => handleCreateClient(onClose)}
								>
									Create Client
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
