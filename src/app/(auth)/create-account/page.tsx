"use client"

import { Form, Button, Input } from "@heroui/react"
import {
	LockClosedIcon,
	UserCircleIcon,
	EnvelopeIcon,
	EyeSlashIcon,
	EyeIcon,
	KeyIcon,
} from "@heroicons/react/16/solid"
import { useState } from "react"
import { useRouter } from "next/navigation"

type CreateAccountData = {
	email: string
	password: string
	adminCode: string
}

export default function CreateAccount() {
	const router = useRouter()
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [adminCode, setAdminCode] = useState("")
	const [visible, setVisible] = useState(false)
	const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_CODE
	const [submitted, setSubmitted] = useState<CreateAccountData | null>(null)
	const [errors, setErrors] = useState<{
		email?: string
		password?: string
		confirmPassword?: string
		adminCode?: string
	}>({})

	const toggleVisibility = () => setVisible(!visible)

	const handleConfirmChange = (value: string) => {
		setConfirmPassword(value)

		if (password && value !== password) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: "Passwords do not match",
			}))
		} else {
			setErrors((prev) => {
				const { confirmPassword, ...rest } = prev
				return rest
			})
		}
	}

	const handleAdminCodeChange = (value: string) => {
		setAdminCode(value)

		if (value === ADMIN_CODE) {
			setErrors((prev) => {
				const { adminCode, ...rest } = prev
				return rest
			})
		} else if (value && value !== ADMIN_CODE) {
			setErrors((prev) => ({
				...prev,
				adminCode: "Invalid admin invite code",
			}))
		}
	}

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget as HTMLFormElement)

		const newErrors: { [key: string]: string } = {}

		const email = String(form.get("email") ?? "")
		const password = String(form.get("password") ?? "")
		const confirmPassword = String(form.get("confirmPassword") ?? "")

		if (!email) newErrors.email = "Enter an email"
		if (!password) newErrors.password = "Enter a password"
		if (password != confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match"
		}
		if (!adminCode) {
			newErrors.adminCode = "Enter admin code"
		} else if (adminCode !== ADMIN_CODE) {
			newErrors.adminCode = "Invalid admin invite code"
		}

		setErrors(newErrors)

		if (Object.keys(newErrors).length > 0) {
			return
		}

		const data: CreateAccountData = { email, password, adminCode }
		setSubmitted(data)
		console.log("user created with: ", data)
		//TODO: Supabase Auth Create user logic
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-100">
			<div className="flex flex-col items-center w-full max-w-sm">
				<UserCircleIcon className="size-18 text-blue-500" />
				<h1 className="text-3xl text-bold font-bold mt-2">Lead Manager Pro</h1>
				<h1 className="text-sm text-gray-700 mt-1">Secure Admin Access Only</h1>
				<Form
					className="flex flex-col w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-gray-300 mt-5"
					onSubmit={onSubmit}
				>
					<div className="p-1">
						<h1 className="text-center font-bold">Create Admin Account</h1>
						<p className="text-center text-xs mt-1">Access your admin dashboard</p>
					</div>

					<div className="flex flex-col mt-4 min-h-21">
						<label htmlFor="email" className="mb-2 text-gray-700 text-xs font-semibold">
							Email Address
						</label>
						<Input
							isRequired
							errorMessage="Please enter a valid email"
							classNames={{
								base: "",
								mainWrapper: "flex flex-col w-full",
								inputWrapper:
									"flex-1 outline-neutral-300 outline-1 rounded-sm py-2 text-gray-500",
								innerWrapper: "flex items-center",
								input: "flex-1 text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
								errorMessage:
									"mt-1 text-xs text-red-600 self-start w-full text-left",
							}}
							startContent={
								<div className="pl-1 mr-3 pointer-events-none flex items-center">
									<EnvelopeIcon className="w-4 h-4 text-gray-400" />
								</div>
							}
							size="sm"
							id="email"
							name="email"
							type="email"
							placeholder="admin@company.com"
						/>
					</div>

					<div className="flex flex-col min-h-21">
						<label
							htmlFor="password"
							className="mb-2 text-gray-700 text-xs font-semibold"
						>
							Password
						</label>
						<Input
							isRequired
							errorMessage="Please enter a password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							classNames={{
								base: "",
								mainWrapper: "flex flex-col w-full",
								inputWrapper:
									"flex-1 outline-neutral-300 outline-1 rounded-sm py-2 text-gray-500",
								innerWrapper: "flex items-center",
								input: "flex-1 text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
								errorMessage:
									"mt-1 text-xs text-red-600 self-start w-full text-left",
							}}
							startContent={
								<div className="pl-1 mr-3 pointer-events-none flex items-center">
									<LockClosedIcon className="w-4 h-4 text-gray-400" />
								</div>
							}
							endContent={
								<button
									type="button"
									onClick={toggleVisibility}
									className="focus:outline-none pr-2"
									aria-label="toggle password visibility"
								>
									{visible ? (
										<EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									) : (
										<EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									)}
								</button>
							}
							size="sm"
							id="password"
							name="password"
							type={visible ? "text" : "password"}
							placeholder="Enter your password"
						/>
					</div>

					<div className="flex flex-col min-h-21">
						<label
							htmlFor="password"
							className="mb-2 text-gray-700 text-xs font-semibold"
						>
							Confirm Password
						</label>
						<Input
							isRequired
							isInvalid={!!errors.confirmPassword}
							errorMessage={errors.confirmPassword}
							value={confirmPassword}
							onChange={(e) => handleConfirmChange(e.target.value)}
							classNames={{
								base: "",
								mainWrapper: "flex flex-col w-full",
								inputWrapper:
									"flex-1 outline-neutral-300 outline-1 rounded-sm py-2 text-gray-500",
								innerWrapper: "flex items-center",
								input: "flex-1 text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
								errorMessage:
									"mt-1 text-xs text-red-600 self-start w-full text-left",
							}}
							startContent={
								<div className="pl-1 mr-3 pointer-events-none flex items-center">
									<LockClosedIcon className="w-4 h-4 text-gray-400" />
								</div>
							}
							endContent={
								<button
									type="button"
									onClick={toggleVisibility}
									className="focus:outline-none pr-2"
									aria-label="toggle password visibility"
								>
									{visible ? (
										<EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									) : (
										<EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									)}
								</button>
							}
							size="sm"
							id="confirmPassword"
							name="confirmPassword"
							type={visible ? "text" : "password"}
							placeholder="Reenter your password"
						/>
					</div>

					<div className="flex flex-col min-h-21">
						<label htmlFor="email" className="mb-2 text-gray-700 text-xs font-semibold">
							Admin Invite Code
						</label>
						<Input
							isRequired
							value={adminCode}
							onChange={(e) => handleAdminCodeChange(e.target.value)}
							isInvalid={!!errors.adminCode}
							errorMessage={errors.adminCode}
							classNames={{
								base: "",
								mainWrapper: "flex flex-col w-full",
								inputWrapper:
									"flex-1 outline-neutral-300 outline-1 rounded-sm py-2 text-gray-500",
								innerWrapper: "flex items-center",
								input: "flex-1 text-sm focus:outline-none border-transparent focus:border-transparent focus:ring-0",
								errorMessage:
									"mt-1 text-xs text-red-600 self-start w-full text-left",
							}}
							startContent={
								<div className="pl-1 mr-3 pointer-events-none flex items-center">
									<KeyIcon className="w-4 h-4 text-gray-400" />
								</div>
							}
							size="sm"
							id="adminCode"
							name="adminCode"
							type="text"
							placeholder="Enter your admin code"
						/>
					</div>

					<Button
						type="submit"
						className="bg-blue-500 text-sm text-white font-semibold p-2 rounded-md mt-2"
					>
						Create Account
					</Button>

					<div className="flex items-center justify-center my-3">
						<button
							type="button"
							className="text-xs text-blue-600 font-medium mt-4 hover:underline"
							onClick={() => {
								router.push("/forgot-password")
							}}
						>
							Forgot your password?
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}
