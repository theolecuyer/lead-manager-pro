"use client"

import AdminHeader from "@/components/AdminHeader"
import BreadcrumbHeader from "@/components/BreadcrumbHeader"
import { Tabs, Tab, Input, Button } from "@heroui/react"
import { useState, useEffect } from "react"
import { getSystemSettings, updateSystemSettings } from "@/lib/supabase/settings"
import { InformationCircleIcon } from "@heroicons/react/24/solid"

export default function AdminSettings() {
	const [selectedTab, setSelectedTab] = useState("system")
	const [autoPauseDays, setAutoPauseDays] = useState("")
	const [autoSuspendDays, setAutoSuspendDays] = useState("")
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [autoPauseError, setAutoPauseError] = useState("")
	const [autoSuspendError, setAutoSuspendError] = useState("")

	useEffect(() => {
		async function loadSettings() {
			try {
				setIsLoading(true)
				const settings = await getSystemSettings()
				setAutoPauseDays(settings.auto_pause_inactive_days?.toString() || "")
				setAutoSuspendDays(settings.auto_suspend_inactive_days?.toString() || "")
			} catch (error) {
				console.error("Error loading settings:", error)
			} finally {
				setIsLoading(false)
			}
		}

		loadSettings()
	}, [])

	const handleSaveSystemSettings = async () => {
		// Reset errors
		setAutoPauseError("")
		setAutoSuspendError("")

		let hasError = false

		// Validate auto-pause
		if (autoPauseDays && (parseInt(autoPauseDays) <= 0 || isNaN(parseInt(autoPauseDays)))) {
			setAutoPauseError("Must be a positive number")
			hasError = true
		}

		// Validate auto-suspend
		if (
			autoSuspendDays &&
			(parseInt(autoSuspendDays) <= 0 || isNaN(parseInt(autoSuspendDays)))
		) {
			setAutoSuspendError("Must be a positive number")
			hasError = true
		}

		// Validate that suspend > pause if both set
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
		} catch (error) {
			console.error("Error saving settings:", error)
			alert("Failed to save settings. See console for details.")
		} finally {
			setIsSaving(false)
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
							<h2 className="text-lg font-bold font-sans">Client Status</h2>
							<p className="text-sm text-gray-600 mb-6 font-sans">
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
									}}
									description="Automatically mark clients as paused who haven't received a lead in this many days. Leave empty to disable."
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
									}}
									description="Automatically mark clients as suspended who haven't received a lead in this many days. Must be greater than auto-pause days. Leave empty to disable."
									size="sm"
									isInvalid={!!autoSuspendError}
									errorMessage={autoSuspendError}
									isDisabled={isLoading}
								/>

								<div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
									<InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<p className="text-sm text-blue-900">
										<span className="font-medium font-sans">Note:</span> These
										settings track days since the client's last received lead.
										Changes to status currently only affect viewing in lists.
										Manual status changes override automation.
									</p>
								</div>

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
						<div className="mt-6">{/* Report Settings Content */}</div>
					)}

					{selectedTab === "profile" && (
						<div className="mt-6">{/* Profile Content */}</div>
					)}

					{selectedTab === "products" && (
						<div className="mt-6">{/* Products Content */}</div>
					)}
				</div>
			</div>
		</AdminHeader>
	)
}
