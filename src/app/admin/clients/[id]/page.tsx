"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"
import AdminHeader from "@/components/AdminHeader"
import { getClientById } from "@/lib/supabase/clients"
import type { Client } from "../../dashboard/page"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import { Tabs, Tab } from "@heroui/react"
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
} from "@heroicons/react/24/solid"
import { Database } from "@/lib/supabase/database.types"
import DashboardIcon from "@/components/DashboardIcon"
import { getCreditsByClientId } from "@/lib/supabase/credits"
import LeadTableRow from "@/components/LeadTableRow"
import CreditTableRow from "@/components/CreditTableRow"

export type Credit = Database["public"]["Tables"]["credits"]["Row"]

interface ClientPageProps {
	params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
	const { id } = React.use(params)
	const clientId = parseInt(id)
	const [client, setClient] = useState<Client | null>(null)
	const [credits, setCredits] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [showEmailAlert, setShowEmailAlert] = useState(false)
	const [showPhoneAlert, setShowPhoneAlert] = useState(false)
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
				const [clientData, creditsData] = await Promise.all([
					getClientById(clientId),
					getCreditsByClientId(clientId),
				])
				setClient(clientData)
				setCredits(creditsData)
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

	const initials = (client.name ?? "")
		.split(" ")
		.filter(Boolean)
		.map((word) => word[0])
		.slice(0, 2)
		.join("")
		.toUpperCase()

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
						classNames={{
							tabList: "bg-white",
							tabContent:
								"group-data-[selected=true]:text-white text-black hover:text-gray-600",
						}}
					>
						<Tab key="all-time" title="All Time" />
						<Tab key="this-month" title="This Month" />
						<Tab key="today" title="Today" />
					</Tabs>
				</div>

				<div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<DashboardIcon
						icon={ArrowTrendingUpIcon}
						stats={true}
						statsText=""
						textcolor="text-black"
						color1="bg-blue-100"
						color2="text-blue-500"
						numToday={2}
						comparison={8}
						comparisonTime="from last month"
						title="Total Leads This Month"
					/>
					<DashboardIcon
						icon={MinusCircleIcon}
						stats={false}
						statsText="quality adjustments"
						textcolor="text-red-500"
						color1="bg-red-100"
						color2="text-red-500"
						numToday={2}
						comparison={12}
						comparisonTime="from last month"
						title="Credits This Month"
					/>
					<DashboardIcon
						icon={CurrencyDollarIcon}
						stats={false}
						statsText="leads billed this month"
						textcolor="text-green-600"
						color1="bg-green-100"
						color2="text-green-500"
						numToday={2}
						comparison={8}
						comparisonTime="from last month"
						title="Net Billable This Month"
					/>
					<DashboardIcon
						icon={CreditCardIcon}
						stats={false}
						statsText="available credits"
						textcolor="text-purple-500"
						color1="bg-purple-100"
						color2="text-purple-500"
						numToday={2}
						comparison={6}
						comparisonTime="from last month"
						title="Account Credit Balance"
					/>
				</div>
				<div className="bg-white p-5 rounded-md shadow">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<h1 className="font-bold font-sans">Manage Account Credits</h1>
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
									{client.credit_balance > 1 ? "s" : ""}
								</h1>
								<p className="text-sm font-medium text-gray-600">
									Available for future deductions
								</p>
							</div>
							<div className="bg-gray-200 w-px h-[90%] mx-6"></div>
							<div className="flex flex-col">
								<p className="text-sm font-medium text-gray-600">Last Adjustment</p>
								<p className="text-sm font-semibold">+x Credits on Date, 2025</p>
								<p className="text-xs font-medium text-gray-600">
									Reason: insert reason
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white p-5 rounded-md shadow my-5">
					<h1 className="font-bold font-sans">Credit History</h1>
					<div className="grid grid-cols-6 grid-rows-1 border-y border-gray-200 bg-gray-50 p-3 px-5 -mx-5 mt-5 items-center">
						<p className="text-small font-sans font-medium text-gray-600 ml-2">DATE</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[30%]">
							TYPE
						</p>
						<p className="text-small font-sans font-medium text-gray-600">AMOUNT</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
							BALANCE
						</p>
						<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
							NOTES
						</p>
						<p className="flex justify-start text-small font-sans font-medium text-gray-600 ml-[30%]">
							BY
						</p>
					</div>
					<div className="flex flex-col -mx-5">
						{credits.length > 0 ? (
							credits.map((credit) => <CreditTableRow key={credit.id} {...credit} />)
						) : (
							<p className="text-center text-sm text-gray-500 p-5">
								No credits received.
							</p>
						)}
					</div>
				</div>
				<div className="p-10">
					<h1 className="text-2xl font-bold mb-2">{client.name}</h1>
					<p className="text-gray-700">
						Leads Received Today: {client.leads_received_today}
					</p>
					<p className="text-gray-700">Net Billable Today: {netBillable}</p>
					<p className="text-gray-700">Credited Today: {credited}</p>
					<p className="text-gray-700">Credit Balance: {client.credit_balance}</p>
					<p className="text-gray-700">
						Credits Issued Today: {client.credits_issued_today}
					</p>
					<p className="text-gray-700">Email: {client.email || "N/A"}</p>
					<p className="text-gray-700">Phone: {client.phone || "N/A"}</p>
					<p className="text-gray-700">Status: {client.active ? "Active" : "Inactive"}</p>
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
							</ModalHeader>
							<ModalBody>
								<p>Credit adjustment form will go here...</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" onPress={onClose}>
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
