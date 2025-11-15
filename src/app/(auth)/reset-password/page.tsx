"use client"

import { Form, Button, Input } from "@heroui/react"
import {
	UserCircleIcon,
	EyeSlashIcon,
	EyeIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	LockClosedIcon,
} from "@heroicons/react/16/solid"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../../utils/supabase/client"

export default function ResetPassword() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)
	const [isValidSession, setIsValidSession] = useState(false)
	const [isChecking, setIsChecking] = useState(true)

	useEffect(() => {
		const checkSession = async () => {
			const supabase = createClient()
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (session) {
				setIsValidSession(true)
			} else {
				setError("Invalid or expired reset link. Please request a new password reset.")
			}
			setIsChecking(false)
		}

		checkSession()
	}, [])

	const togglePasswordVisibility = () => setShowPassword(!showPassword)
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

	const onSubmit = async (e: any) => {
		e.preventDefault()
		setError("")
		setSuccess(false)

		const form = new FormData(e.currentTarget)
		const password = String(form.get("password") ?? "")
		const confirmPassword = String(form.get("confirmPassword") ?? "")

		// Validation
		if (password.length < 8) {
			setError("Password must be at least 8 characters long")
			return
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		setIsLoading(true)

		try {
			const supabase = createClient()
			const { error: updateError } = await supabase.auth.updateUser({
				password: password,
			})

			if (updateError) {
				throw updateError
			}

			setSuccess(true)

			// Redirect to login after 3 seconds
			setTimeout(() => {
				router.push("/login")
			}, 3000)
		} catch (err: any) {
			console.error("Password reset error:", err)
			setError(err.message || "Failed to reset password. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	if (isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-100">
				<div className="flex flex-col items-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					<p className="mt-4 text-gray-600">Verifying reset link...</p>
				</div>
			</div>
		)
	}

	if (!isValidSession && !isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-100">
				<div className="flex flex-col items-center w-full max-w-sm">
					<UserCircleIcon className="size-18 text-blue-500" />
					<h1 className="text-3xl text-bold font-bold mt-2">Lead Manager Pro</h1>
					<div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-gray-300 mt-5">
						<div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg">
							<ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
							<div className="flex flex-col">
								<p className="text-sm text-red-900 font-medium">
									Invalid Reset Link
								</p>
								<p className="text-xs text-red-700 mt-1">{error}</p>
							</div>
						</div>
						<Button
							className="w-full bg-blue-500 text-sm text-white font-semibold p-2 rounded-md mt-4"
							onPress={() => router.push("/forgot-password")}
						>
							Request New Reset Link
						</Button>
					</div>
				</div>
			</div>
		)
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
						<h1 className="text-center font-bold">Reset Your Password</h1>
						<p className="text-center text-xs mt-1">Enter your new password below</p>
					</div>

					<div className="flex flex-col mt-4 min-h-21">
						<label
							htmlFor="password"
							className="mb-2 text-gray-700 text-xs font-semibold"
						>
							New Password
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
									onClick={togglePasswordVisibility}
									className="focus:outline-none pr-2"
									aria-label="toggle password visibility"
								>
									{showPassword ? (
										<EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									) : (
										<EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									)}
								</button>
							}
							size="sm"
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter new password"
							isDisabled={isLoading || success}
							onChange={() => {
								setError("")
								setSuccess(false)
							}}
						/>
						<p className="text-xs text-gray-600 mt-1">Must be at least 8 characters</p>
					</div>

					<div className="flex flex-col min-h-21">
						<label
							htmlFor="confirmPassword"
							className="mb-2 text-gray-700 text-xs font-semibold"
						>
							Confirm New Password
						</label>
						<Input
							isRequired
							errorMessage="Please confirm your password"
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
									onClick={toggleConfirmPasswordVisibility}
									className="focus:outline-none pr-2"
									aria-label="toggle password visibility"
								>
									{showConfirmPassword ? (
										<EyeSlashIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									) : (
										<EyeIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
									)}
								</button>
							}
							size="sm"
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Confirm new password"
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
									Password reset successful!
								</p>
								<p className="text-xs text-green-700 mt-1">
									Redirecting to login...
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
						Reset Password
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
