"use client"

import { Form, Button, Input } from "@heroui/react"
import {
	UserCircleIcon,
	EnvelopeIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
} from "@heroicons/react/16/solid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { sendPasswordResetEmail } from "@/lib/supabase/auth"

export default function ForgotPassword() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)
	const [email, setEmail] = useState("")

	const onSubmit = async (e: any) => {
		e.preventDefault()
		setError("")
		setSuccess(false)
		setIsLoading(true)

		try {
			const form = new FormData(e.currentTarget)
			const emailValue = String(form.get("email") ?? "")
			setEmail(emailValue)

			await sendPasswordResetEmail(emailValue)
			setSuccess(true)
		} catch (err: any) {
			console.error("Password reset error:", err)
			setError(err.message || "Failed to send reset email. Please try again.")
		} finally {
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
						<h1 className="text-center font-bold">Forgot Your Password?</h1>
						<p className="text-center text-xs mt-1">
							Enter your email to receive a reset link
						</p>
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
							isDisabled={isLoading || success}
							onChange={() => {
								setError("")
								setSuccess(false)
							}}
						/>
					</div>

					{error && (
						<div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg mt-3">
							<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
							<p className="text-sm text-red-900">{error}</p>
						</div>
					)}

					{success && (
						<div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg mt-3">
							<CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
							<div className="flex flex-col">
								<p className="text-sm text-green-900 font-medium">
									Reset link sent!
								</p>
								<p className="text-xs text-green-700 mt-1">
									If an account exists for {email}, you will receive a password
									reset link shortly. Check your email and follow the
									instructions.
								</p>
							</div>
						</div>
					)}

					<Button
						type="submit"
						className="bg-blue-500 text-sm text-white font-semibold p-2 rounded-md mt-2"
						isLoading={isLoading}
						isDisabled={isLoading || success}
					>
						Send Reset Link
					</Button>

					<div className="flex items-center justify-center my-3">
						<button
							type="button"
							className="text-xs text-blue-600 font-medium mt-4 hover:underline"
							onClick={() => {
								router.push("/login")
							}}
							disabled={isLoading}
						>
							Return to login
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}
