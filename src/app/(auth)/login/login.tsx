"use client"

import { Form, Button, Input } from "@heroui/react"
import {
	LockClosedIcon,
	UserCircleIcon,
	EnvelopeIcon,
	EyeSlashIcon,
	EyeIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/16/solid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../actions"

export default function LoginPage() {
	const router = useRouter()
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const toggleVisibility = () => setVisible(!visible)

	async function onSubmit(e: any) {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		try {
			const form = new FormData(e.currentTarget)
			await login(form)
		} catch (err: any) {
			if (err?.digest?.startsWith("NEXT_REDIRECT")) {
				return
			}

			console.error("Login error:", err)

			setError(err?.message || "Invalid email or password. Please try again.")
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-100">
			<div className="flex flex-col items-center w-full max-w-sm">
				<UserCircleIcon className="size-18 text-blue-500" />
				<h1 className="text-3xl text-bold font-bold mt-2">Lead Manager Pro</h1>
				<h1 className="text-sm text-gray-700 mt-1">Secure Admin Access Only</h1>
				<Form
					className="flex flex-col items-stretch w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-gray-300 mt-5"
					onSubmit={onSubmit}
				>
					<div className="p-1">
						<h1 className="text-center font-bold">Admin Sign In</h1>
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
							isDisabled={isLoading}
							onChange={() => setError("")}
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
							isDisabled={isLoading}
							onChange={() => setError("")}
						/>
					</div>

					{error && (
						<div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg mt-3">
							<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
							<p className="text-sm text-red-900">{error}</p>
						</div>
					)}

					<Button
						type="submit"
						className="bg-blue-500 text-sm text-white font-semibold p-2 rounded-md mt-2"
						isLoading={isLoading}
						isDisabled={isLoading}
					>
						Sign In
					</Button>

					<div className="flex items-center justify-center my-1">
						<button
							type="button"
							className="text-xs text-blue-600 font-medium mt-4 hover:underline"
							onClick={() => {
								router.push("/forgot-password")
							}}
							disabled={isLoading}
						>
							Forgot your password?
						</button>
					</div>

					<div className="flex items-center my-3">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="px-4 text-gray-500 text-sm">or</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<div className="flex items-center justify-center">
						<p className="mx-0 text-sm">Need an admin account?</p>
						<button
							type="button"
							onClick={() => {
								router.push("/create-account")
							}}
							className="text-sm text-blue-600 px-1 font-medium hover:underline"
							disabled={isLoading}
						>
							Sign up
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}
