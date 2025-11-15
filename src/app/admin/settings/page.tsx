"use client"

import AdminHeader from "@/components/AdminHeader"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import {
	Tabs,
	Tab,
	Input,
	Button,
	Select,
	SelectItem,
	Chip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Textarea,
} from "@heroui/react"
import { useState, useEffect } from "react"
import { getSystemSettings, updateSystemSettings } from "@/lib/supabase/settings"
import { getReportSettings, updateReportSettings } from "@/lib/supabase/reportSettings"
import {
	getCurrentUserProfile,
	updateProfile,
	updateEmail,
	changePassword,
} from "@/lib/supabase/profile"
import {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	type CreateProductInput,
	type UpdateProductInput,
} from "@/lib/supabase/products"
import type { Database } from "@/lib/supabase/database.types"
import {
	InformationCircleIcon,
	EyeIcon,
	EyeSlashIcon,
	ExclamationTriangleIcon,
	PlusIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/solid"

type Product = Database["public"]["Tables"]["products"]["Row"]

// Converts 24h to 12h format
function convertTo12Hour(time24: string): { hour: string; period: "AM" | "PM" } {
	const [hours, minutes] = time24.split(":")
	const hour = parseInt(hours)

	if (hour === 0) {
		return { hour: "12", period: "AM" }
	} else if (hour < 12) {
		return { hour: hour.toString(), period: "AM" }
	} else if (hour === 12) {
		return { hour: "12", period: "PM" }
	} else {
		return { hour: (hour - 12).toString(), period: "PM" }
	}
}

// Converts 12h to 24h format
function convertTo24Hour(hour: string, period: "AM" | "PM"): string {
	let h = parseInt(hour)

	if (period === "AM") {
		if (h === 12) h = 0
	} else {
		if (h !== 12) h += 12
	}

	return `${h.toString().padStart(2, "0")}:00:00`
}

export default function AdminSettings() {
	const [selectedTab, setSelectedTab] = useState("system")

	// System Settings
	const [autoPauseDays, setAutoPauseDays] = useState("")
	const [autoSuspendDays, setAutoSuspendDays] = useState("")
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [autoPauseError, setAutoPauseError] = useState("")
	const [autoSuspendError, setAutoSuspendError] = useState("")
	const [systemError, setSystemError] = useState("")
	const [systemSuccess, setSystemSuccess] = useState("")

	// Report Settings
	const [reportHour, setReportHour] = useState("7")
	const [reportPeriod, setReportPeriod] = useState<"AM" | "PM">("PM")
	const [timezone, setTimezone] = useState("America/New_York")
	const [sendOnWeekends, setSendOnWeekends] = useState(false)
	const [recipients, setRecipients] = useState<string[]>([])
	const [newRecipient, setNewRecipient] = useState("")
	const [recipientError, setRecipientError] = useState("")
	const [isSavingReports, setIsSavingReports] = useState(false)
	const [reportError, setReportError] = useState("")
	const [reportSuccess, setReportSuccess] = useState("")

	// Profile Settings
	const [fullName, setFullName] = useState("")
	const [email, setEmail] = useState("")
	const [userRole, setUserRole] = useState("")
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [passwordError, setPasswordError] = useState("")
	const [profileError, setProfileError] = useState("")
	const [profileSuccess, setProfileSuccess] = useState("")
	const [passwordSuccess, setPasswordSuccess] = useState("")

	// Product Settings
	const [products, setProducts] = useState<Product[]>([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [productError, setProductError] = useState("")
	const [productSuccess, setProductSuccess] = useState("")
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
	const [productName, setProductName] = useState("")
	const [productDescription, setProductDescription] = useState("")
	const [productPrice, setProductPrice] = useState("")
	const [isSavingProduct, setIsSavingProduct] = useState(false)
	const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
	const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
	const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

	const timezones = [
		{ value: "America/New_York", label: "Eastern Time (ET)" },
		{ value: "America/Chicago", label: "Central Time (CT)" },
		{ value: "America/Denver", label: "Mountain Time (MT)" },
		{ value: "America/Los_Angeles", label: "Pacific Time (PT)" },
		{ value: "America/Phoenix", label: "Arizona (MST)" },
		{ value: "America/Anchorage", label: "Alaska Time (AKT)" },
		{ value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
	]

	const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())

	useEffect(() => {
		async function loadSettings() {
			try {
				setIsLoading(true)
				const [systemSettings, reportSettings, profileData] = await Promise.all([
					getSystemSettings(),
					getReportSettings(),
					getCurrentUserProfile(),
				])

				// System settings
				setAutoPauseDays(systemSettings.auto_pause_inactive_days?.toString() || "")
				setAutoSuspendDays(systemSettings.auto_suspend_inactive_days?.toString() || "")

				// Report settings
				if (reportSettings.report_time) {
					const { hour, period } = convertTo12Hour(reportSettings.report_time)
					setReportHour(hour)
					setReportPeriod(period)
				}
				setTimezone(reportSettings.timezone)
				setSendOnWeekends(reportSettings.send_reports_on_weekends)
				setRecipients(reportSettings.report_recipients)

				// Profile settings
				setFullName(profileData.profile.full_name || "")
				setEmail(profileData.email || "")
				setUserRole(profileData.profile.user_role || "")
			} catch (error) {
				console.error("Error loading settings:", error)
			} finally {
				setIsLoading(false)
			}
		}

		loadSettings()
	}, [])

	useEffect(() => {
		if (selectedTab === "products") {
			loadProducts()
		}
	}, [selectedTab])

	const loadProducts = async () => {
		setIsLoadingProducts(true)
		try {
			const data = await getAllProducts()
			setProducts(data)
		} catch (error: any) {
			console.error("Error loading products:", error)
			setProductError(error.message || "Failed to load products")
		} finally {
			setIsLoadingProducts(false)
		}
	}

	const handleSaveSystemSettings = async () => {
		setAutoPauseError("")
		setAutoSuspendError("")
		setSystemError("")
		setSystemSuccess("")

		let hasError = false

		if (autoPauseDays && (parseInt(autoPauseDays) <= 0 || isNaN(parseInt(autoPauseDays)))) {
			setAutoPauseError("Must be a positive number")
			hasError = true
		}

		if (
			autoSuspendDays &&
			(parseInt(autoSuspendDays) <= 0 || isNaN(parseInt(autoSuspendDays)))
		) {
			setAutoSuspendError("Must be a positive number")
			hasError = true
		}

		if (
			autoPauseDays &&
			autoSuspendDays &&
			parseInt(autoSuspendDays) <= parseInt(autoPauseDays)
		) {
			setAutoSuspendError("Must be greater than auto-pause days")
			hasError = true
		}

		if (hasError) return

		setIsSaving(true)
		try {
			await updateSystemSettings({
				auto_pause_inactive_days: autoPauseDays ? parseInt(autoPauseDays) : null,
				auto_suspend_inactive_days: autoSuspendDays ? parseInt(autoSuspendDays) : null,
			})
			setSystemSuccess("System settings updated successfully")
		} catch (error: any) {
			console.error("Error saving settings:", error)
			setSystemError(error.message || "Failed to save settings. Please try again.")
		} finally {
			setIsSaving(false)
		}
	}

	const handleAddRecipient = () => {
		setRecipientError("")

		if (!newRecipient.trim()) return

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(newRecipient.trim())) {
			setRecipientError("Please enter a valid email address")
			return
		}

		if (recipients.includes(newRecipient.trim())) {
			setRecipientError("This email is already in the list")
			return
		}

		setRecipients([...recipients, newRecipient.trim()])
		setNewRecipient("")
	}

	const handleRemoveRecipient = (email: string) => {
		if (recipients.length === 1) {
			setReportError("You must have at least one recipient")
			return
		}

		setRecipients(recipients.filter((r) => r !== email))
		setReportError("")
	}

	const handleSaveReportSettings = async () => {
		setReportError("")
		setReportSuccess("")

		if (recipients.length === 0) {
			setReportError("You must have at least one recipient")
			return
		}

		setIsSavingReports(true)
		try {
			const time24 = convertTo24Hour(reportHour, reportPeriod)

			await updateReportSettings({
				report_time: time24,
				timezone: timezone,
				send_reports_on_weekends: sendOnWeekends,
				report_recipients: recipients,
			})

			setReportSuccess("Report settings updated successfully")
		} catch (error: any) {
			console.error("Error saving report settings:", error)
			setReportError(error.message || "Failed to save report settings. Please try again.")
		} finally {
			setIsSavingReports(false)
		}
	}

	const handleSaveProfile = async () => {
		setProfileError("")
		setProfileSuccess("")
		setIsSavingProfile(true)
		try {
			await updateProfile({
				full_name: fullName,
			})

			const profileData = await getCurrentUserProfile()
			if (email !== profileData.email) {
				await updateEmail(email)
				setProfileSuccess(
					"Profile updated! Please check your new email for a verification link."
				)
			} else {
				setProfileSuccess("Profile updated successfully")
			}
		} catch (error: any) {
			console.error("Error saving profile:", error)
			setProfileError(error.message || "Failed to save profile. Please try again.")
		} finally {
			setIsSavingProfile(false)
		}
	}

	const handleChangePassword = async () => {
		setPasswordError("")
		setPasswordSuccess("")

		if (!currentPassword || !newPassword || !confirmPassword) {
			setPasswordError("Please fill in all password fields")
			return
		}

		if (newPassword.length < 8) {
			setPasswordError("Password must be at least 8 characters")
			return
		}

		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match")
			return
		}

		if (currentPassword === newPassword) {
			setPasswordError("New password must be different from current password")
			return
		}

		setIsChangingPassword(true)
		try {
			await changePassword(currentPassword, newPassword)

			setCurrentPassword("")
			setNewPassword("")
			setConfirmPassword("")

			setPasswordSuccess(
				"Password changed successfully. You'll remain logged in on this device but will be logged out on all other devices."
			)
		} catch (error: any) {
			console.error("Error changing password:", error)
			setPasswordError(error.message || "Failed to change password. Please try again.")
		} finally {
			setIsChangingPassword(false)
		}
	}

	const openAddProductModal = () => {
		setProductName("")
		setProductDescription("")
		setProductPrice("")
		setProductError("")
		setProductSuccess("")
		onAddOpen()
	}

	const openEditProductModal = (product: Product) => {
		setEditingProduct(product)
		setProductName(product.name)
		setProductDescription(product.description || "")
		setProductPrice(product.price.toString())
		setProductError("")
		setProductSuccess("")
		onEditOpen()
	}

	const openDeleteProductModal = (product: Product) => {
		setDeletingProduct(product)
		setProductError("")
		setProductSuccess("")
		onDeleteOpen()
	}

	const handleAddProduct = async () => {
		setProductError("")

		if (!productName.trim()) {
			setProductError("Product name is required")
			return
		}

		const price = parseFloat(productPrice)
		if (isNaN(price) || price <= 0) {
			setProductError("Price must be a positive number")
			return
		}

		setIsSavingProduct(true)
		try {
			const input: CreateProductInput = {
				name: productName.trim(),
				description: productDescription.trim() || undefined,
				price: price,
			}

			await createProduct(input)
			await loadProducts()
			setProductSuccess("Product created successfully")
			onAddClose()

			setTimeout(() => setProductSuccess(""), 3000)
		} catch (error: any) {
			console.error("Error creating product:", error)
			setProductError(error.message || "Failed to create product. Please try again.")
		} finally {
			setIsSavingProduct(false)
		}
	}

	const handleEditProduct = async () => {
		if (!editingProduct) return

		setProductError("")

		if (!productName.trim()) {
			setProductError("Product name is required")
			return
		}

		const price = parseFloat(productPrice)
		if (isNaN(price) || price <= 0) {
			setProductError("Price must be a positive number")
			return
		}

		setIsSavingProduct(true)
		try {
			const input: UpdateProductInput = {
				name: productName.trim(),
				description: productDescription.trim() || undefined,
				price: price,
			}

			await updateProduct(editingProduct.id, input)
			await loadProducts()
			setProductSuccess("Product updated successfully")
			onEditClose()

			setTimeout(() => setProductSuccess(""), 3000)
		} catch (error: any) {
			console.error("Error updating product:", error)
			setProductError(error.message || "Failed to update product. Please try again.")
		} finally {
			setIsSavingProduct(false)
		}
	}

	const handleDeleteProduct = async () => {
		if (!deletingProduct) return

		setIsSavingProduct(true)
		try {
			await deleteProduct(deletingProduct.id)
			await loadProducts()
			setProductSuccess("Product deleted successfully")
			onDeleteClose()

			setTimeout(() => setProductSuccess(""), 3000)
		} catch (error: any) {
			console.error("Error deleting product:", error)
			setProductError(error.message || "Failed to delete product. Please try again.")
			onDeleteClose()
		} finally {
			setIsSavingProduct(false)
		}
	}

	return (
		<AdminHeader
			header={
				<div className="flex flex-col justify-center gap-1 h-full">
					<BreadcrumbHeader
						crumbs={[
							{ content: "Dashboard", href: "/admin/dashboard" },
							{ content: "Settings", href: "/admin/settings" },
						]}
					/>
					<h1 className="text-xl font-bold text-gray-900 leading-none mt-2">Settings</h1>
					<h1 className="text-sm text-gray-700">
						Manage system and report configuration, your profile, and products
					</h1>
				</div>
			}
		>
			<div className="bg-white rounded-md shadow">
				<Tabs
					aria-label="Settings tabs"
					color="primary"
					variant="underlined"
					selectedKey={selectedTab}
					onSelectionChange={(key) => setSelectedTab(key as string)}
					classNames={{
						base: "w-full",
						tabList:
							"gap-6 w-full relative rounded-none p-0 border-b border-gray-200 px-5",
						cursor: "w-full bg-blue-600",
						tab: "max-w-fit px-0 h-12",
						tabContent: "group-data-[selected=true]:text-blue-600",
					}}
				>
					<Tab key="system" title="System Settings" />
					<Tab key="reports" title="Report Settings" />
					<Tab key="profile" title="User Profile" />
					<Tab key="products" title="Products" />
				</Tabs>

				<div className="px-5 pb-5">
					{selectedTab === "system" && (
						<div className="mt-6">
							<h2 className="text-lg font-bold">Client Status Automation</h2>
							<p className="text-sm text-gray-600 mt-1 mb-6">
								Configure automatic status changes for inactive clients
							</p>

							<div className="flex flex-col gap-5">
								<Input
									type="number"
									label="Auto-Pause Inactive Clients (Days)"
									placeholder="e.g., 30"
									value={autoPauseDays}
									onValueChange={(value) => {
										setAutoPauseDays(value)
										if (value && parseInt(value) > 0) {
											setAutoPauseError("")
										}
										setSystemError("")
										setSystemSuccess("")
									}}
									description="Automatically pause clients who haven't received a lead in this many days. Leave empty to disable."
									size="sm"
									isInvalid={!!autoPauseError}
									errorMessage={autoPauseError}
									isDisabled={isLoading}
								/>

								<Input
									type="number"
									label="Auto-Suspend Inactive Clients (Days)"
									placeholder="e.g., 60"
									value={autoSuspendDays}
									onValueChange={(value) => {
										setAutoSuspendDays(value)
										if (
											value &&
											parseInt(value) > 0 &&
											(!autoPauseDays ||
												parseInt(value) > parseInt(autoPauseDays))
										) {
											setAutoSuspendError("")
										}
										setSystemError("")
										setSystemSuccess("")
									}}
									description="Automatically suspend clients who haven't received a lead in this many days. Must be greater than auto-pause days. Leave empty to disable."
									size="sm"
									isInvalid={!!autoSuspendError}
									errorMessage={autoSuspendError}
									isDisabled={isLoading}
								/>

								<div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
									<InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
									<p className="text-sm text-blue-900">
										<span className="font-medium">Note:</span> These settings
										track days since the client's last received lead. Manual
										status changes override automation.
									</p>
								</div>

								{systemError && (
									<div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
										<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
										<p className="text-sm text-red-900">{systemError}</p>
									</div>
								)}

								{systemSuccess && (
									<div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
										<InformationCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
										<p className="text-sm text-green-900">{systemSuccess}</p>
									</div>
								)}

								<div>
									<Button
										color="primary"
										onPress={handleSaveSystemSettings}
										isLoading={isSaving}
										isDisabled={isLoading}
									>
										Save System Settings
									</Button>
								</div>
							</div>
						</div>
					)}

					{selectedTab === "reports" && (
						<div className="mt-6">
							<h2 className="text-lg font-bold">Daily Report Automation</h2>
							<p className="text-sm text-gray-600 mt-1 mb-6">
								Configure automatic generation of daily reports
							</p>

							<div className="flex flex-col gap-5">
								<div className="grid grid-cols-2 gap-3">
									<Select
										label="Report Time (Hour)"
										placeholder="Select hour"
										selectedKeys={[reportHour]}
										onSelectionChange={(keys) => {
											setReportHour(Array.from(keys)[0] as string)
											setReportError("")
											setReportSuccess("")
										}}
										size="sm"
										isDisabled={isLoading}
									>
										{hours.map((hour) => (
											<SelectItem key={hour}>{hour}</SelectItem>
										))}
									</Select>

									<Select
										label="AM/PM"
										placeholder="Select period"
										selectedKeys={[reportPeriod]}
										onSelectionChange={(keys) => {
											setReportPeriod(Array.from(keys)[0] as "AM" | "PM")
											setReportError("")
											setReportSuccess("")
										}}
										size="sm"
										isDisabled={isLoading}
									>
										<SelectItem key="AM">AM</SelectItem>
										<SelectItem key="PM">PM</SelectItem>
									</Select>
								</div>

								<Select
									label="Timezone"
									placeholder="Select timezone"
									selectedKeys={[timezone]}
									onSelectionChange={(keys) => {
										setTimezone(Array.from(keys)[0] as string)
										setReportError("")
										setReportSuccess("")
									}}
									description="Timezone used for report generation scheduling"
									size="sm"
									isDisabled={isLoading}
								>
									{timezones.map((tz) => (
										<SelectItem key={tz.value}>{tz.label}</SelectItem>
									))}
								</Select>

								<Select
									label="Send Reports on Weekends"
									placeholder="Select option"
									selectedKeys={[sendOnWeekends ? "yes" : "no"]}
									onSelectionChange={(keys) => {
										setSendOnWeekends(Array.from(keys)[0] === "yes")
										setReportError("")
										setReportSuccess("")
									}}
									description="When disabled, reports will not be generated or sent on Saturdays and Sundays"
									size="sm"
									isDisabled={isLoading}
								>
									<SelectItem key="yes">Yes</SelectItem>
									<SelectItem key="no">No</SelectItem>
								</Select>

								<div>
									<label className="text-sm font-medium text-gray-700 mb-2 block">
										Email Recipients
									</label>
									<p className="text-xs text-gray-600 mb-3">
										Enter email addresses that will receive the daily report
									</p>

									<div className="flex gap-2 mb-3">
										<Input
											placeholder="email@example.com"
											value={newRecipient}
											onValueChange={(value) => {
												setNewRecipient(value)
												setRecipientError("")
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleAddRecipient()
												}
											}}
											size="sm"
											isInvalid={!!recipientError}
											errorMessage={recipientError}
											isDisabled={isLoading}
										/>
										<Button
											color="primary"
											onPress={handleAddRecipient}
											isDisabled={isLoading}
										>
											Add
										</Button>
									</div>

									<div className="flex flex-wrap gap-2">
										{recipients.map((email) => (
											<Chip
												key={email}
												onClose={() => handleRemoveRecipient(email)}
												variant="flat"
												color="primary"
											>
												{email}
											</Chip>
										))}
									</div>

									{recipients.length === 0 && !reportError && (
										<p className="text-sm text-red-600 mt-2">
											At least one recipient is required
										</p>
									)}
								</div>

								<div className="flex gap-3 bg-blue-50 p-4 rounded-lg">
									<InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
									<p className="text-sm text-blue-900">
										Reports are generated for the previous day's activity. For
										example, a report generated at {reportHour}:00{" "}
										{reportPeriod} will contain data from the previous day.
									</p>
								</div>

								{reportError && (
									<div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
										<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
										<p className="text-sm text-red-900">{reportError}</p>
									</div>
								)}

								{reportSuccess && (
									<div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
										<InformationCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
										<p className="text-sm text-green-900">{reportSuccess}</p>
									</div>
								)}

								<div>
									<Button
										color="primary"
										onPress={handleSaveReportSettings}
										isLoading={isSavingReports}
										isDisabled={isLoading || recipients.length === 0}
									>
										Save Report Settings
									</Button>
								</div>
							</div>
						</div>
					)}

					{selectedTab === "profile" && (
						<div className="mt-6">
							<div className="flex flex-col gap-8">
								<div>
									<h2 className="text-lg font-bold">Profile Information</h2>
									<p className="text-sm text-gray-600 mt-1 mb-6">
										Update your personal information
									</p>

									<div className="flex flex-col gap-5">
										<Input
											label="Full Name"
											placeholder="John Smith"
											value={fullName}
											onValueChange={(value) => {
												setFullName(value)
												setProfileError("")
												setProfileSuccess("")
											}}
											size="sm"
											isDisabled={isLoading}
										/>

										<Input
											label="Email Address"
											placeholder="john@leadflow.com"
											value={email}
											onValueChange={(value) => {
												setEmail(value)
												setProfileError("")
												setProfileSuccess("")
											}}
											description="Changing your email will require verification. You'll receive a confirmation email."
											size="sm"
											isDisabled={isLoading}
										/>

										<div>
											<label className="text-sm font-medium text-gray-700 mb-2 block">
												Role
											</label>
											<Chip color="primary" variant="flat">
												{userRole.charAt(0).toUpperCase() +
													userRole.slice(1)}
											</Chip>
											<p className="text-xs text-gray-600 mt-2">
												Contact an administrator to change your role
											</p>
										</div>

										{profileError && (
											<div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
												<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
												<p className="text-sm text-red-900">
													{profileError}
												</p>
											</div>
										)}

										{profileSuccess && (
											<div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
												<InformationCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
												<p className="text-sm text-green-900">
													{profileSuccess}
												</p>
											</div>
										)}

										<div>
											<Button
												color="primary"
												onPress={handleSaveProfile}
												isLoading={isSavingProfile}
												isDisabled={isLoading}
											>
												Update Profile
											</Button>
										</div>
									</div>
								</div>

								<div>
									<h2 className="text-lg font-bold">Change Password</h2>
									<p className="text-sm text-gray-600 mt-1 mb-6">
										Update your account password
									</p>

									<div className="flex flex-col gap-5">
										<Input
											type={showCurrentPassword ? "text" : "password"}
											label="Current Password"
											placeholder="Enter current password"
											value={currentPassword}
											onValueChange={(value) => {
												setCurrentPassword(value)
												setPasswordError("")
												setPasswordSuccess("")
											}}
											description="Enter your current password to confirm your identity"
											size="sm"
											isDisabled={isLoading}
											endContent={
												<button
													type="button"
													onClick={() =>
														setShowCurrentPassword(!showCurrentPassword)
													}
													className="focus:outline-none"
												>
													{showCurrentPassword ? (
														<EyeSlashIcon className="w-5 h-5 text-gray-400" />
													) : (
														<EyeIcon className="w-5 h-5 text-gray-400" />
													)}
												</button>
											}
										/>

										<Input
											type={showNewPassword ? "text" : "password"}
											label="New Password"
											placeholder="Enter new password"
											value={newPassword}
											onValueChange={(value) => {
												setNewPassword(value)
												setPasswordError("")
												setPasswordSuccess("")
											}}
											description="Password must be at least 8 characters"
											size="sm"
											isDisabled={isLoading}
											endContent={
												<button
													type="button"
													onClick={() =>
														setShowNewPassword(!showNewPassword)
													}
													className="focus:outline-none"
												>
													{showNewPassword ? (
														<EyeSlashIcon className="w-5 h-5 text-gray-400" />
													) : (
														<EyeIcon className="w-5 h-5 text-gray-400" />
													)}
												</button>
											}
										/>

										<Input
											type={showConfirmPassword ? "text" : "password"}
											label="Confirm New Password"
											placeholder="Confirm new password"
											value={confirmPassword}
											onValueChange={(value) => {
												setConfirmPassword(value)
												setPasswordError("")
												setPasswordSuccess("")
											}}
											size="sm"
											isDisabled={isLoading}
											endContent={
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													className="focus:outline-none"
												>
													{showConfirmPassword ? (
														<EyeSlashIcon className="w-5 h-5 text-gray-400" />
													) : (
														<EyeIcon className="w-5 h-5 text-gray-400" />
													)}
												</button>
											}
										/>

										{passwordError && (
											<div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
												<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
												<p className="text-sm text-red-900">
													{passwordError}
												</p>
											</div>
										)}

										{passwordSuccess && (
											<div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
												<InformationCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
												<p className="text-sm text-green-900">
													{passwordSuccess}
												</p>
											</div>
										)}

										<div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-lg">
											<ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
											<p className="text-sm text-yellow-900">
												After changing your password, you'll remain logged
												in on this device but will be logged out on all
												other devices.
											</p>
										</div>

										<div>
											<Button
												color="primary"
												onPress={handleChangePassword}
												isLoading={isChangingPassword}
												isDisabled={
													isLoading ||
													!currentPassword ||
													!newPassword ||
													!confirmPassword
												}
											>
												Change Password
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{selectedTab === "products" && (
						<div className="mt-6">
							<div className="flex justify-between items-center mb-6">
								<div>
									<h2 className="text-lg font-bold">Product Management</h2>
									<p className="text-sm text-gray-600 mt-1">
										Manage your products and pricing
									</p>
								</div>
								<Button
									color="primary"
									startContent={<PlusIcon className="w-4 h-4" />}
									onPress={openAddProductModal}
									size="sm"
								>
									Add Product
								</Button>
							</div>

							{productError && (
								<div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg mb-4">
									<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
									<p className="text-sm text-red-900">{productError}</p>
								</div>
							)}

							{productSuccess && (
								<div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg mb-4">
									<InformationCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
									<p className="text-sm text-green-900">{productSuccess}</p>
								</div>
							)}

							{isLoadingProducts ? (
								<div className="flex justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
								</div>
							) : products.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg">
									<p className="text-gray-600 mb-4">No products yet</p>
									<Button
										color="primary"
										startContent={<PlusIcon className="w-4 h-4" />}
										onPress={openAddProductModal}
										size="sm"
									>
										Add Your First Product
									</Button>
								</div>
							) : (
								<Table aria-label="Products table">
									<TableHeader>
										<TableColumn>NAME</TableColumn>
										<TableColumn>DESCRIPTION</TableColumn>
										<TableColumn>PRICE</TableColumn>
										<TableColumn width={100}>ACTIONS</TableColumn>
									</TableHeader>
									<TableBody>
										{products.map((product) => (
											<TableRow key={product.id}>
												<TableCell>
													<span className="font-medium">
														{product.name}
													</span>
												</TableCell>
												<TableCell>
													<span className="text-sm text-gray-600">
														{product.description || "—"}
													</span>
												</TableCell>
												<TableCell>
													<span className="font-medium">
														$
														{parseFloat(
															product.price.toString()
														).toFixed(2)}
													</span>
												</TableCell>
												<TableCell>
													<div className="flex gap-2">
														<Button
															isIconOnly
															size="sm"
															variant="light"
															onPress={() =>
																openEditProductModal(product)
															}
														>
															<PencilIcon className="w-4 h-4 text-blue-600" />
														</Button>
														<Button
															isIconOnly
															size="sm"
															variant="light"
															onPress={() =>
																openDeleteProductModal(product)
															}
														>
															<TrashIcon className="w-4 h-4 text-red-600" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Add Product Modal */}
			<Modal isOpen={isAddOpen} onClose={onAddClose}>
				<ModalContent>
					<ModalHeader>Add New Product</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-4">
							<Input
								label="Product Name"
								placeholder="Enter product name"
								value={productName}
								onValueChange={setProductName}
								size="sm"
								isRequired
							/>

							<Textarea
								label="Description"
								placeholder="Enter product description (optional)"
								value={productDescription}
								onValueChange={setProductDescription}
								size="sm"
								minRows={3}
							/>

							<Input
								label="Price"
								placeholder="0.00"
								value={productPrice}
								onValueChange={setProductPrice}
								size="sm"
								type="number"
								step="0.01"
								min="0"
								startContent={
									<div className="pointer-events-none flex items-center">
										<span className="text-gray-400 text-sm">$</span>
									</div>
								}
								isRequired
							/>

							{productError && (
								<div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg">
									<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
									<p className="text-sm text-red-900">{productError}</p>
								</div>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onAddClose}>
							Cancel
						</Button>
						<Button
							color="primary"
							onPress={handleAddProduct}
							isLoading={isSavingProduct}
						>
							Add Product
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Edit Product Modal */}
			<Modal isOpen={isEditOpen} onClose={onEditClose}>
				<ModalContent>
					<ModalHeader>Edit Product</ModalHeader>
					<ModalBody>
						<div className="flex flex-col gap-4">
							<Input
								label="Product Name"
								placeholder="Enter product name"
								value={productName}
								onValueChange={setProductName}
								size="sm"
								isRequired
							/>

							<Textarea
								label="Description"
								placeholder="Enter product description (optional)"
								value={productDescription}
								onValueChange={setProductDescription}
								size="sm"
								minRows={3}
							/>

							<Input
								label="Price"
								placeholder="0.00"
								value={productPrice}
								onValueChange={setProductPrice}
								size="sm"
								type="number"
								step="0.01"
								min="0"
								startContent={
									<div className="pointer-events-none flex items-center">
										<span className="text-gray-400 text-sm">$</span>
									</div>
								}
								isRequired
							/>

							{productError && (
								<div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg">
									<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
									<p className="text-sm text-red-900">{productError}</p>
								</div>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onEditClose}>
							Cancel
						</Button>
						<Button
							color="primary"
							onPress={handleEditProduct}
							isLoading={isSavingProduct}
						>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete Product Modal */}
			<Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
				<ModalContent>
					<ModalHeader>Delete Product</ModalHeader>
					<ModalBody>
						<p className="text-sm">
							Are you sure you want to delete{" "}
							<span className="font-semibold">{deletingProduct?.name}</span>? This
							action cannot be undone.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onDeleteClose}>
							Cancel
						</Button>
						<Button
							color="danger"
							onPress={handleDeleteProduct}
							isLoading={isSavingProduct}
						>
							Delete Product
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</AdminHeader>
	)
}
