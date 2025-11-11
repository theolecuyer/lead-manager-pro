"use client"

import { issueCreditToLead } from "@/lib/supabase/credits"
import { getAllProducts } from "@/lib/supabase/products"
import { updateLeadProduct } from "@/lib/supabase/leads"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Select,
	SelectItem,
	Textarea,
	Checkbox,
} from "@heroui/react"
import type { Lead } from "@/app/admin/dashboard/page"
import { Database } from "@/lib/supabase/database.types"
import { InformationCircleIcon } from "@heroicons/react/24/solid"

type Product = Database["public"]["Tables"]["products"]["Row"]

export type LeadCardProps = {
	lead: Lead
	onLeadUpdated?: () => void
}

export default function ClientLeadTableRow({ lead, onLeadUpdated }: LeadCardProps) {
	const [reason, setReason] = useState("")
	const [notes, setNotes] = useState("")
	const [isAdjusting, setIsAdjusting] = useState(false)
	const [notConfirmed, setNotConfirmed] = useState(true)
	const [selectedProduct, setSelectedProduct] = useState<number | null>(lead.product_id || null)
	const [products, setProducts] = useState<Product[]>([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(true)
	const router = useRouter()
	const {
		isOpen: isViewOpen,
		onOpen: onViewOpen,
		onOpenChange: onViewOpenChange,
	} = useDisclosure()
	const {
		isOpen: isCreditOpen,
		onOpen: onCreditOpen,
		onOpenChange: onCreditOpenChange,
	} = useDisclosure()

	const reasonOptions = [
		{ value: "poor_lead_quality", label: "Poor Lead Quality" },
		{ value: "duplicate", label: "Duplicate" },
		{ value: "wrong_service_area", label: "Wrong Service Area" },
		{ value: "customer_goodwill", label: "Customer Goodwill" },
		{ value: "manual_adjustment", label: "Manual Adjustment" },
		{ value: "other", label: "Other" },
	]

	// Fetch products on component mount
	useEffect(() => {
		async function fetchProducts() {
			try {
				const fetchedProducts = await getAllProducts()
				setProducts(fetchedProducts)
			} catch (error) {
				console.error("Error fetching products:", error)
			} finally {
				setIsLoadingProducts(false)
			}
		}
		fetchProducts()
	}, [])

	const handleView = () => {
		onViewOpen()
	}

	const handleCredit = async () => {
		onCreditOpen()
	}

	const isProductEditable = () => {
		return lead.payment_status === "billable" && lead.report_id === null
	}

	const handleProductChange = async (keys: any) => {
		const newProductId = Number(Array.from(keys)[0])
		setSelectedProduct(newProductId)

		// Update product in database
		try {
			await updateLeadProduct(lead.id, newProductId)
			console.log("Product updated successfully")
			onLeadUpdated?.()
		} catch (error) {
			console.error("Error updating product:", error)
			alert("Failed to update product")
			setSelectedProduct(lead.product_id || null)
		}
	}

	const formattedAddress =
		lead.lead_address == null
			? ""
			: lead.lead_address.split(",").length > 2
			? lead.lead_address.split(",")[0] + ", " + lead.lead_address.split(",")[1]
			: lead.lead_address

	const handleCreditSubmit = async (onClose: () => void) => {
		if (!reason || notConfirmed) return

		setIsAdjusting(true)
		try {
			await issueCreditToLead({
				leadId: lead.id,
				creditAmount: 1,
				reason: reason,
				additionalNotes: notes || undefined,
			})

			console.log("Lead credited successfully!")

			onLeadUpdated?.()

			setReason("")
			setNotes("")
			setNotConfirmed(true)

			onClose()
		} catch (error) {
			console.error("Failed to credit lead:", error)
			alert("Something went wrong when crediting the lead.")
		} finally {
			setIsAdjusting(false)
		}
	}

	const statusObject = () => {
		let bg = "bg-red-100"
		let text = "text-red-900"
		let statusText = "Credited"
		switch (lead.payment_status) {
			case "paid":
				bg = "bg-green-100"
				text = "text-green-500"
				statusText = "Paid"
				break
			case "billable":
				bg = "bg-blue-100"
				text = "text-blue-700"
				statusText = "Billable"
				break
			case "paid_by_credit":
				bg = "bg-purple-100"
				text = "text-purple-500"
				statusText = "Paid By Credit"
				break
		}
		return (
			<div className="ml-[20%]">
				<span className={`inline-flex items-center ${bg} rounded-xl px-2.5 py-0.5 gap-1`}>
					<p className={`${text} text-small font-sans truncate`}>{statusText}</p>
				</span>
			</div>
		)
	}

	const formattedTime = lead.created_at
		? new Date(lead.created_at).toLocaleString("en-US", {
				timeZone: "America/New_York",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
		  })
		: "-"

	const selectedProductData = products.find((p) => p.id === selectedProduct)

	return (
		<>
			<div className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center">
				<p className="ml-2 flex justify-start text-small font-sans font-medium text-gray-700">
					{formattedTime}
				</p>
				<p className="text-small font-sans font-medium text-gray-700 ml-[15%]">
					{lead.lead_name}
				</p>
				<p className="text-small font-sans font-medium text-gray-600 pr-2">
					{formattedAddress}
				</p>
				<div className="ml-[15%]">
					<Select
						size="sm"
						selectedKeys={selectedProduct ? [selectedProduct.toString()] : []}
						onSelectionChange={handleProductChange}
						placeholder="Select product"
						aria-label="Product"
						isDisabled={isLoadingProducts || !isProductEditable()}
						classNames={{
							trigger: "min-h-8 h-8 bg-white",
							value: "text-small font-sans font-medium text-gray-700",
						}}
					>
						{products.map((product) => (
							<SelectItem
								key={product.id}
								classNames={{
									base: "bg-white hover:bg-gray-100",
								}}
							>
								{product.name}
							</SelectItem>
						))}
					</Select>
				</div>
				{statusObject()}
				<div className="flex gap-10 justify-end mr-2">
					<button
						onClick={handleView}
						className="text-small text-blue-500 font-medium hover:cursor-pointer"
					>
						View
					</button>
					{lead.payment_status == "credited" ? (
						<div>
							<h1 className="text-small text-gray-400 font-medium">Credited</h1>
						</div>
					) : (
						<button
							onClick={handleCredit}
							className="text-small text-red-500 font-medium hover:cursor-pointer"
						>
							Add Credit
						</button>
					)}
				</div>
			</div>

			{/* View Lead Modal */}
			<Modal isOpen={isViewOpen} onOpenChange={onViewOpenChange} size="lg">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h1>Lead Details</h1>
								<div className="-mx-6 w-[calc(100%+3rem)] h-px bg-gray-200 mt-3"></div>
							</ModalHeader>
							<ModalBody>
								<div className="grid grid-cols-2 gap-5 -mt-2">
									<div className="flex flex-col col-span-2">
										<p className="text-sm text-gray-700 font-sans">Lead Name</p>
										<p className="text-xl font-semibold font-sans">
											{lead.lead_name}
										</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm text-gray-700 font-sans">
											Date Received
										</p>
										<p className="font-sans">{formattedTime}</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm text-gray-700 font-sans">
											Lead Phone
										</p>
										<p className="font-sans">{lead.lead_phone}</p>
									</div>
									<div className="flex flex-col col-span-2">
										<p className="text-sm text-gray-700 font-sans">
											Lead Address
										</p>
										<p className="font-sans">{formattedAddress}</p>
									</div>
									<div className="flex flex-col">
										<p className="text-sm text-gray-700 font-sans">Product</p>
										<p className="font-sans">
											{selectedProductData?.name || "Not selected"}
										</p>
									</div>
									{selectedProductData && (
										<div className="flex flex-col">
											<p className="text-sm text-gray-700 font-sans">Price</p>
											<p className="font-sans">
												${Number(selectedProductData.price).toFixed(2)}
											</p>
										</div>
									)}
									{lead.additional_info && (
										<div className="flex flex-col col-span-2">
											<p className="text-sm text-gray-700 font-sans">
												Additional Info
											</p>
											<p className="font-sans">{lead.additional_info}</p>
										</div>
									)}
									<div className="flex flex-col">
										<p className="text-sm text-gray-700 font-sans mb-1">
											Payment Status
										</p>
										<div className="-ml-[25%]">{statusObject()}</div>
									</div>
									{lead.payment_status == "credited" && (
										<div className="flex bg-red-50 col-span-2 rounded-md p-4 mt-2 border border-red-200 border-px">
											<div className="grid grid-cols-2 gap-4 w-full">
												<div className="flex items-center gap-1 col-span-2 mb-2">
													<InformationCircleIcon className="w-5 h-5 text-red-900" />
													<p className="text-red-900 text-medium font-semibold font-sans">
														Credit Information
													</p>
												</div>
												<div className="flex flex-col">
													<p className="text-sm text-red-800 font-sans">
														Credited Reason
													</p>
													<p className="font-sans text-red-900">
														{reasonOptions.find(
															(opt) =>
																opt.value === lead.credited_reason
														)?.label || lead.credited_reason}
													</p>
												</div>
												<div className="flex flex-col">
													<p className="text-sm text-red-800 font-sans">
														Credited By
													</p>
													<p className="font-sans text-red-900">
														{lead.credited_by || "N/A"}
													</p>
												</div>
												<div className="flex flex-col col-span-2">
													<p className="text-sm text-red-800 font-sans">
														Credited At
													</p>
													<p className="font-sans text-red-900">
														{lead.credited_at
															? new Date(
																	lead.credited_at
															  ).toLocaleString("en-US", {
																	timeZone: "America/New_York",
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																	hour: "numeric",
																	minute: "2-digit",
																	hour12: true,
															  })
															: "N/A"}
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Credit Lead Modal */}
			<Modal isOpen={isCreditOpen} onOpenChange={onCreditOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Credit Lead</ModalHeader>
							<ModalBody>
								<div className="flex flex-col gap-5 -mt-2">
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
											<SelectItem
												key={option.value}
												classNames={{
													base: "bg-white hover:bg-gray-100",
												}}
											>
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
									onPress={() => handleCreditSubmit(onClose)}
								>
									Apply Credit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
