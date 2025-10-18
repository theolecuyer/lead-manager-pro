"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"
import AdminHeader from "@/components/AdminHeader"
import { getClientById } from "@/lib/supabase/clients"
import type { Client } from "../../dashboard/page"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import {
	Tabs,
	Tab,
	RadioGroup,
	Radio,
	Input,
	Select,
	SelectItem,
	Textarea,
	Checkbox,
} from "@heroui/react"
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Alert,
} from "@heroui/react"
import {
	EnvelopeIcon,
	PhoneIcon,
	DocumentDuplicateIcon,
	ArrowTrendingUpIcon,
	MinusCircleIcon,
	CurrencyDollarIcon,
	CreditCardIcon,
	AdjustmentsVerticalIcon,
	CheckCircleIcon,
	XCircleIcon,
	MagnifyingGlassIcon,
	ChevronDownIcon,
} from "@heroicons/react/24/solid"
import { Database } from "@/lib/supabase/database.types"
import { adjustClientCredits, getCreditsByClientId } from "@/lib/supabase/credits"
import ClientLeadTableRow from "@/components/ClientLeadTableRow"
import CreditTableRow from "@/components/CreditTableRow"
import Pagination from "@/components/Pagination"
import { getLeadsByClient } from "@/lib/supabase/leads"
import ClientDashboardIcon from "@/components/ClientDashboardIcon"

export type Credit = Database["public"]["Tables"]["credits"]["Row"]

interface ClientPageProps {
	params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
	const { id } = React.use(params)
	const clientId = parseInt(id)
	const [client, setClient] = useState<Client | null>(null)
	const [credits, setCredits] = useState<any[]>([])
	const [leads, setLeads] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isAdjusting, setIsAdjusting] = useState(false)
	const [showEmailAlert, setShowEmailAlert] = useState(false)
	const [adjustmentType, setAdjustmentType] = useState("add")
	const [selectedPeriod, setSelectedPeriod] = useState<"all" | "month" | "today">("all")
	const [currentCreditPage, setCurrentCreditPage] = useState(1)
	const [currentLeadPage, setCurrentLeadPage] = useState(1)
	const [showPhoneAlert, setShowPhoneAlert] = useState(false)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [isStatusOpen, setIsStatusOpen] = useState(false)
	const [creditAmount, setCreditAmount] = useState("1")
	const [reason, setReason] = useState("")
	const [notes, setNotes] = useState("")
	const [notConfirmed, setNotConfirmed] = useState(true)

	const statusOptions = [
		{ value: "all", label: "Any Status" },
		{ value: "billable", label: "Billable" },
		{ value: "paid", label: "Paid" },
		{ value: "paid_by_credit", label: "Paid by Credit" },
		{ value: "credited", label: "Credited" },
	]

	const reasonOptions = [
		{ value: "poor_lead_quality", label: "Poor Lead Quality" },
		{ value: "duplicate", label: "Duplicate" },
		{ value: "wrong_service_area", label: "Wrong Service Area" },
		{ value: "customer_goodwill", label: "Customer Goodwill" },
		{ value: "manual_adjustment", label: "Manual Adjustment" },
		{ value: "other", label: "Other" },
	]

	function calculateStats(
		leads: any[],
		credits: any[],
		client: Client,
		period: "all" | "month" | "today"
	) {
		if (period === "today") {
			return {
				totalLeads: client.leads_received_today,
				totalCredits: client.credits_issued_today,
				netBillable: client.leads_paid_today,
			}
		}

		const now = new Date()
		let startDate: Date

		if (period === "month") {
			startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
			startDate.setHours(0, 0, 0, 0)
		} else {
			startDate = new Date(0)
		}

		const filteredLeads = leads.filter((lead) => {
			const leadDate = new Date(lead.created_at)
			return leadDate >= startDate
		})

		const totalLeads = filteredLeads.length

		const totalCredits = filteredLeads.filter(
			(lead) => lead.payment_status === "credited"
		).length

		const netBillable = filteredLeads.filter(
			(lead) =>
				lead.payment_status === "billable" ||
				lead.payment_status === "paid" ||
				lead.payment_status === "paid_by_credit"
		).length

		return {
			totalLeads,
			totalCredits,
			netBillable,
		}
	}

	const router = useRouter()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const {
		isOpen: isCreditModalOpen,
		onOpen: onCreditModalOpen,
		onOpenChange: onCreditModalOpenChange,
	} = useDisclosure()

	useEffect(() => {
		async function fetchClient() {
			try {
				setIsLoading(true)
				const [clientData, creditsData, leadsData] = await Promise.all([
					getClientById(clientId),
					getCreditsByClientId(clientId),
					getLeadsByClient(clientId),
				])
				setClient(clientData)
				setCredits(creditsData)
				setLeads(leadsData)
			} catch (error) {
				console.error("Error fetching client:", error)
				router.push("/admin/clients")
			} finally {
				setIsLoading(false)
			}
		}

		if (clientId) {
			fetchClient()
		}
	}, [clientId, router])

	async function onLeadUpdated() {
		try {
			const [clientData, creditsData, leadsData] = await Promise.all([
				getClientById(clientId),
				getCreditsByClientId(clientId),
				getLeadsByClient(clientId),
			])

			setClient(clientData)
			setCredits(creditsData)
			setLeads(leadsData)
		} catch (error) {
			console.error("Error refreshing client data:", error)
		}
	}
	const handleCopyEmail = () => {
		if (client?.email) {
			navigator.clipboard.writeText(client.email)
			setShowEmailAlert(true)
			setTimeout(() => setShowEmailAlert(false), 3000)
		}
	}

	const handleCopyPhone = () => {
		if (client?.phone) {
			navigator.clipboard.writeText(client.phone)
			setShowPhoneAlert(true)
			setTimeout(() => setShowPhoneAlert(false), 3000)
		}
	}

	if (isLoading) return <p className="text-center p-10">Loading client...</p>

	if (!client) return null

	const netBillable = client.leads_paid_today
	const credited = client.leads_received_today - client.leads_paid_today

	const lastCredit = credits.length > 0 ? credits[0] : null

	const REASON_MAP: Record<string, string> = {
		poor_lead_quality: "Poor Lead Quality",
		duplicate: "Duplicate",
		wrong_service_area: "Wrong Service Area",
		customer_goodwill: "Customer Goodwill",
		manual_adjustment: "Manual Adjustment",
		auto_applied_to_lead: "Auto Applied to Lead",
		retroactive_application: "Retroactive Application",
		other: "Other",
	}

	let formattedReason = "N/A"
	if (lastCredit) {
		formattedReason = REASON_MAP[lastCredit.reason]
	}
	const itemsPerCreditPage = 10
	const itemsPerLeadPage = 10

	const totalCreditPages = Math.ceil(credits.length / itemsPerCreditPage)
	const paginatedCredits = credits.slice(
		(currentCreditPage - 1) * itemsPerCreditPage,
		currentCreditPage * itemsPerCreditPage
	)

	const filteredLeads = leads.filter((lead) => {
		const matchesSearch =
			lead.lead_name.toLowerCase().includes(search.toLowerCase()) ||
			lead.lead_phone.includes(search)
		const matchesStatus = statusFilter === "all" || lead.payment_status === statusFilter
		return matchesSearch && matchesStatus
	})

	const totalLeadPages = Math.ceil(filteredLeads.length / itemsPerLeadPage)
	const startLeadIndex = (currentLeadPage - 1) * itemsPerLeadPage
	const paginatedLeads = filteredLeads.slice(startLeadIndex, startLeadIndex + itemsPerLeadPage)

	const handleStatusChange = (value: string) => {
		setStatusFilter(value)
		setIsStatusOpen(false)
		setCurrentLeadPage(1)
	}

	const stats = calculateStats(leads, credits, client, selectedPeriod)

	async function handleCreditAdjustmentPress(onClose: () => void) {
		if (!reason || notConfirmed || !client) return

		setIsAdjusting(true)
		try {
			await adjustClientCredits({
				clientId: client.id,
				creditAmount: parseInt(creditAmount),
				adjustmentType: adjustmentType as "add" | "remove",
				reason: reason,
				additionalNotes: notes || undefined,
			})

			const [clientData, creditsData, leadsData] = await Promise.all([
				getClientById(client.id),
				getCreditsByClientId(client.id),
				getLeadsByClient(client.id),
			])

			setClient(clientData)
			setCredits(creditsData)
			setLeads(leadsData)
			setCreditAmount("1")
			setReason("")
			setNotes("")
			setNotConfirmed(true)
			setAdjustmentType("add")

			onClose()
		} catch (error) {
			console.error("Error adjusting credits:", error)
			alert(`Failed to adjust credits. ${error}`)
		} finally {
			setIsAdjusting(false)
		}
	}

	return (
		<>
			<AdminHeader
				header={
					<div className="flex flex-col justify-center gap-1 h-full">
						<BreadcrumbHeader
							crumbs={[
								{ content: "Dashboard", href: "/admin/dashboard" },
								{ content: "Clients", href: "/admin/clients" },
								{ content: `${client.name}`, href: `/admin/clients/${client.id}` },
							]}
						/>
						<div className="flex items-center mt-2">
							<h1 className="text-xl font-bold text-gray-900 leading-none mr-2">
								{client.name}
							</h1>
							{client.active ? (
								<div className="inline-flex items-center px-2 py-1 bg-green-100 rounded-full">
									<CheckCircleIcon className="w-4 h-4 text-green-700 mr-0.5" />
									<span className="text-green-700 font-semibold text-xs leading-none">
										Active
									</span>
								</div>
							) : (
								<div className="inline-flex items-center px-2 py-1 bg-red-100 rounded-full">
									<XCircleIcon className="w-4 h-4 text-red-700 mr-0.5" />
									<span className="text-red-700 font-semibold text-xs leading-none">
										Inactive
									</span>
								</div>
							)}
						</div>
						<div className="flex items-center mt-1">
							<EnvelopeIcon className="text-gray-600 h-3 w-3 mr-1" />
							<p className="text-gray-600 text-sm">{client.email}</p>
							{client.email && (
								<DocumentDuplicateIcon
									onClick={handleCopyEmail}
									className="text-gray-400 h-4 w-4 ml-2 cursor-pointer hover:text-blue-600 transition"
									title="Copy email"
								/>
							)}
						</div>
						<div className="flex items-center">
							<PhoneIcon className="text-gray-600 h-3 w-3 mr-1" />
							<p className="text-gray-600 text-sm">{client.phone}</p>
							{client.phone && (
								<DocumentDuplicateIcon
									onClick={handleCopyPhone}
									className="text-gray-400 h-4 w-4 ml-2 cursor-pointer hover:text-blue-600 transition"
									title="Copy phone"
								/>
							)}
						</div>
					</div>
				}
				rightAction={
					<button
						onClick={onOpen}
						className="flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
					>
						Edit Client Info +
					</button>
				}
			>
				<div className="fixed bottom-5 right-5 z-50 space-y-2">
					{showEmailAlert && (
						<Alert
							color="success"
							title="Email copied!"
							description="Email address has been copied to clipboard"
							isVisible={showEmailAlert}
							onVisibleChange={setShowEmailAlert}
							isClosable
						/>
					)}

					{showPhoneAlert && (
						<Alert
							color="success"
							title="Phone copied!"
							description="Phone number has been copied to clipboard"
							isVisible={showPhoneAlert}
							onVisibleChange={setShowPhoneAlert}
							isClosable
						/>
					)}
				</div>

				<div className="inline-block bg-white border border-gray-200 rounded-lg mb-4 -my-2">
					<Tabs
						aria-label="Options"
						color="primary"
						variant="solid"
						selectedKey={selectedPeriod}
						onSelectionChange={(key) =>
							setSelectedPeriod(key as "all" | "month" | "today")
						}
						classNames={{
							tabList: "bg-white",
							tabContent:
								"group-data-[selected=true]:text-white text-black hover:text-gray-600",
						}}
					>
						<Tab key="all" title="All Time" />
						<Tab key="month" title="Last 30 Days" />
						<Tab key="today" title="Today" />
					</Tabs>
				</div>

				<div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<ClientDashboardIcon
						icon={ArrowTrendingUpIcon}
						stats={true}
						statsText=""
						textcolor="text-black"
						color1="bg-blue-100"
						color2="text-blue-500"
						numToday={stats.totalLeads}
						comparison={8}
						comparisonTime="from last month"
						title={`Leads ${
							selectedPeriod === "all"
								? "All Time"
								: selectedPeriod === "month"
								? "Last 30 Days"
								: "Today"
						}`}
					/>
					<ClientDashboardIcon
						icon={MinusCircleIcon}
						stats={false}
						statsText="quality adjustments"
						textcolor="text-red-500"
						color1="bg-red-100"
						color2="text-red-500"
						numToday={stats.totalCredits}
						comparison={12}
						comparisonTime="from last month"
						title={`Credits ${
							selectedPeriod === "all"
								? "All Time"
								: selectedPeriod === "month"
								? "Last 30 Days"
								: "Today"
						}`}
					/>
					<ClientDashboardIcon
						icon={CurrencyDollarIcon}
						stats={false}
						statsText="leads billed this month"
						textcolor="text-green-600"
						color1="bg-green-100"
						color2="text-green-500"
						numToday={stats.netBillable}
						comparison={8}
						comparisonTime="from last month"
						title={`Billable ${
							selectedPeriod === "all"
								? "All Time"
								: selectedPeriod === "month"
								? "Last 30 Days"
								: "Today"
						}`}
					/>
					<ClientDashboardIcon
						icon={CreditCardIcon}
						stats={false}
						statsText="available credits"
						textcolor="text-purple-500"
						color1="bg-purple-100"
						color2="text-purple-500"
						numToday={client.credit_balance}
						comparison={0}
						comparisonTime="from last month"
						title="Account Credit Balance"
					/>
				</div>
				<div className="bg-white p-5 rounded-md shadow">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h1 className="text-lg font-bold font-sans">Manage Account Credits</h1>
							<h1 className="text-sm font-sans text-gray-600">
								Credits will be automatically deducted from next billing cycle
							</h1>
						</div>
						<div className="flex justify-end items-start">
							<button
								onClick={onCreditModalOpen}
								className="flex items-center bg-blue-500 text-white text-sm font-medium rounded-md px-2 py-1 hover:bg-blue-600 transition-colors"
							>
								<AdjustmentsVerticalIcon className="w-4 h-4 mr-1" />
								Adjust Credits
							</button>
						</div>
						<div className="flex items-center mt-2">
							<div className="flex flex-col">
								<h1 className="text-2xl font-bold font-sans">
									{client.credit_balance} Credit
									{client.credit_balance > 1 || client.credit_balance == 0
										? "s"
										: ""}
								</h1>
								<p className="text-sm font-medium text-gray-600">
									Available for future deductions
								</p>
							</div>
							<div className="bg-gray-200 w-px h-[90%] mx-6"></div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-600">Last Adjustment</p>
								<p className="text-sm font-semibold">
									{lastCredit ? (
										<>
											{lastCredit.amount > 0 ? "+" : ""}
											{lastCredit.amount} Credit
											{lastCredit.amount > 1 ? "s" : ""} on{" "}
											{new Date(lastCredit.created_at).toLocaleDateString()}
										</>
									) : (
										"No adjustments yet"
									)}
								</p>
								<p className="text-xs font-medium text-gray-600">
									Reason: {formattedReason}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white p-5 rounded-md shadow my-5">
					<h1 className="text-lg font-bold font-sans">Credit History</h1>
					<div className="grid grid-cols-6 grid-rows-1 border-y border-gray-200 bg-gray-50 p-3 px-5 -mx-5 mt-5 items-center">
						<p className="text-small font-sans font-medium text-gray-600 ml-2">DATE</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[20%]">
							TYPE
						</p>
						<p className="text-small font-sans font-medium text-gray-600">AMOUNT</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
							BALANCE
						</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
							REASON
						</p>
						<p className="flex justify-start text-small font-sans font-medium text-gray-600 ml-[30%]">
							BY
						</p>
					</div>
					<div className="flex flex-col -mx-5">
						{paginatedCredits.length > 0 ? (
							paginatedCredits.map((credit) => (
								<CreditTableRow key={credit.id} {...credit} />
							))
						) : (
							<p className="text-center text-sm text-gray-500 p-5">
								No credits received.
							</p>
						)}
					</div>
					<div className="rounded-b-md border-t border-gray-200 bg-gray-50 p-3 px-5 -mx-5 -my-5 mt-auto">
						<Pagination
							name="credits"
							currentPage={currentCreditPage}
							totalPages={totalCreditPages}
							itemsPerPage={itemsPerCreditPage}
							totalItems={credits.length}
							onPageChange={setCurrentCreditPage}
						/>
					</div>
				</div>

				<div className="bg-white p-5 rounded-md shadow my-5">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<h1 className="text-lg font-bold font-sans">Lead History</h1>
							<span className="font-sans text-gray-500">({leads.length} total)</span>
						</div>
						<div className="flex items-center gap-4">
							<div className="relative w-64">
								<MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
								<input
									type="text"
									placeholder="Search leads..."
									className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-sans"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<div className="relative w-40">
								<button
									onClick={() => setIsStatusOpen(!isStatusOpen)}
									className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between gap-2"
								>
									<span className="text-sm text-gray-700 truncate">
										{
											statusOptions.find((opt) => opt.value === statusFilter)
												?.label
										}
									</span>
									<ChevronDownIcon
										className={`w-4 h-4 text-gray-400 transition-transform ${
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
						</div>
					</div>

					<div className="grid grid-cols-6 grid-rows-1 border-y border-gray-200 bg-gray-50 p-3 px-5 -mx-5 mt-5 items-center">
						<p className="text-small font-sans font-medium text-gray-600 ml-2">
							DATE RECIEVED
						</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[15%]">
							LEAD NAME
						</p>
						<p className="text-small font-sans font-medium text-gray-600">PHONE</p>
						<p className="text-small font-sans font-medium text-gray-600">ADDRESS</p>
						<p className="text-small font-sans font-medium text-gray-600">STATUS</p>
						<p className="flex justify-end text-small font-sans font-medium text-gray-600 mr-2">
							ACTIONS
						</p>
					</div>
					<div className="flex flex-col -mx-5">
						{paginatedLeads.length > 0 ? (
							paginatedLeads.map((lead) => (
								<ClientLeadTableRow
									key={lead.id}
									id={lead.id}
									createdAt={lead.created_at}
									leadName={lead.lead_name}
									phone={lead.lead_phone}
									address={lead.lead_address}
									status={lead.payment_status}
									onLeadUpdated={onLeadUpdated}
								/>
							))
						) : (
							<p className="text-center text-sm text-gray-500 p-5">
								No leads received today.
							</p>
						)}
					</div>
					<div className="rounded-b-md border-t border-gray-200 bg-gray-50 p-3 px-5 -mx-5 -my-5 mt-auto">
						<Pagination
							name="leads"
							currentPage={currentLeadPage}
							totalPages={totalLeadPages}
							itemsPerPage={itemsPerLeadPage}
							totalItems={leads.length}
							onPageChange={setCurrentLeadPage}
						/>
					</div>
				</div>
			</AdminHeader>

			{/* Edit Client Modal */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Edit Client Information
							</ModalHeader>
							<ModalBody>
								<p>Form fields will go here...</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" onPress={onClose}>
									Save Changes
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Adjust Credits Modal */}
			<Modal isOpen={isCreditModalOpen} onOpenChange={onCreditModalOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Adjust Account Credits
								<div className="flex gap-1 items-center mt-0.5">
									<p className="text-sm font-sans text-gray-600 font-normal items-center">
										Current Balance:{" "}
									</p>
									<p className="text-sm font-sans text-gray-600 font-semibold items-center">
										{client.credit_balance} credit
										{client.credit_balance > 1 || client.credit_balance == 0
											? "s"
											: ""}
									</p>
								</div>
								<div className="-mx-6 w-[calc(100%+3rem)] h-px bg-gray-200 mt-3"></div>
							</ModalHeader>
							<ModalBody>
								<div className="flex flex-col gap-5 -mt-2">
									<RadioGroup
										label="Adjustment Type"
										value={adjustmentType}
										onValueChange={setAdjustmentType}
										size="sm"
										classNames={{
											label: "text-sm font-medium text-gray-800",
										}}
									>
										<Radio value="add">Add Credits</Radio>
										<Radio value="remove">Remove Credits</Radio>
									</RadioGroup>
									<Input
										type="number"
										label="Number of Credits"
										value={creditAmount}
										onValueChange={setCreditAmount}
										min="1"
										size="sm"
									/>
									<Select
										label="Reason"
										placeholder="Select a reason"
										selectedKeys={reason ? [reason] : []}
										onSelectionChange={(keys) => {
											setReason(Array.from(keys)[0] as string)
										}}
										size="sm"
									>
										{reasonOptions.map((option) => (
											<SelectItem key={option.value}>
												{option.label}
											</SelectItem>
										))}
									</Select>
									<Textarea
										label="Notes (Optional)"
										placeholder="Additional explanation for audit trail..."
										value={notes}
										onValueChange={setNotes}
										size="sm"
										minRows={3}
									/>
									<div className="flex gap-1 bg-blue-50 rounded-md p-3">
										<p className="text-sm font-sans text-blue-800 font-semibold">
											Preview:
										</p>
										<p className="text-sm font-sans text-blue-800">
											New balance will be
										</p>
										<p className="text-sm font-sans text-blue-800 font-semibold">
											{adjustmentType == "add"
												? client.credit_balance + Number(creditAmount)
												: client.credit_balance - Number(creditAmount) < 0
												? 0
												: client.credit_balance - Number(creditAmount)}
										</p>
										<p className="text-sm font-sans text-blue-800">
											credit
											{adjustmentType == "add"
												? client.credit_balance + Number(creditAmount) >
														1 ||
												  client.credit_balance + Number(creditAmount) == 0
													? "s"
													: ""
												: client.credit_balance - Number(creditAmount) <=
														0 ||
												  client.credit_balance - Number(creditAmount) > 1
												? "s"
												: ""}
										</p>
									</div>
									<Checkbox
										isSelected={!notConfirmed}
										onValueChange={() => setNotConfirmed(!notConfirmed)}
										size="sm"
									>
										I confirm this adjustment is correct
									</Checkbox>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button
									color="primary"
									isDisabled={!reason || notConfirmed}
									isLoading={isAdjusting}
									onPress={() => handleCreditAdjustmentPress(onClose)}
								>
									Apply Adjustment
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
