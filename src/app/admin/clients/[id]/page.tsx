"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"
import AdminHeader from "@/components/AdminHeader"
import { getClientById } from "@/lib/supabase/clients"
import type { Client } from "../../dashboard/page"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
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
} from "@heroicons/react/24/solid"
import DashboardIcon from "@/components/DashboardIcon"

interface ClientPageProps {
	params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
	const { id } = React.use(params)
	const clientId = parseInt(id)
	const [client, setClient] = useState<Client | null>(null)
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
				const data = await getClientById(clientId)
				setClient(data)
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
						<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">
							{client.name}
						</h1>
						<h1 className="text-sm text-gray-700">Client Details & Lead Management</h1>
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

				<div className="bg-white p-5 rounded-md shadow">
					<div className="flex">
						<div className="flex-none flex items-center justify-center w-12 h-12 my-3 rounded-full bg-blue-100 text-blue-600 font-semibold">
							{initials}
						</div>
						<div className="flex flex-col mx-3 gap-1">
							<h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
							<div className="flex items-center">
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
					</div>
				</div>
				<div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
