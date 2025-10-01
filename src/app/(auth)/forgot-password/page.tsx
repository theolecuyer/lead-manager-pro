"use client"

import { Form, Button, Input } from "@heroui/react"
import {
	LockClosedIcon,
	UserCircleIcon,
	EnvelopeIcon,
	EyeSlashIcon,
	EyeIcon,
} from "@heroicons/react/16/solid"
import { useState } from "react"
import { useRouter } from "next/navigation"

type userData = {
	email: string
}

export default function ForgotPassword() {
	const router = useRouter()
	const [visible, setVisible] = useState(false)
	const [submitted, setSubmitted] = useState<userData | null>(null)
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

	const toggleVisibility = () => setVisible(!visible)

	const onSubmit = (e: any) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget)

		const email = String(form.get("email") ?? "")
		const data: userData = { email }
		console.log(data)
		setSubmitted(data)
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
						<h1 className="text-center font-bold">Forgot Your Password?</h1>
						<p className="text-center text-xs mt-1">Reset it below</p>
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

					<Button
						type="submit"
						className="bg-blue-500 text-sm text-white font-semibold p-2 rounded-md mt-2"
					>
						Send Reset Link
					</Button>

					{submitted && (
						<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
							<p className="text-xs text-green-700 text-center">
								A reset link has been emailed if this email exists
							</p>
						</div>
					)}

					<div className="flex items-center justify-center my-3">
						<button
							type="button"
							className="text-xs text-blue-600 font-medium mt-4 hover:underline"
							onClick={() => {
								router.push("/login")
							}}
						>
							Return to login
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}
