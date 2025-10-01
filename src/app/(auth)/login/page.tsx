"use client"

import { Form, Button, Input } from "@heroui/react"
import { UserCircleIcon } from "@heroicons/react/16/solid"

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-100">
			<div className="flex flex-col items-center w-full max-w-sm">
				<UserCircleIcon className="size-18 text-blue-500" />
				<h1 className="text-2xl text-bold font-bold mt-2">Lead Manager Pro</h1>
				<h1 className="text-sm text-gray-700 mt-1">Secure Admin Access Only</h1>
				<Form className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-lg shadow-lg mt-3">
					<div>
						<h1 className="text-center font-bold mt-1">Admin Sign In</h1>
						<p className="text-center text-xs p-1">Access your admin dashboard</p>
					</div>

					<div className="flex flex-col">
						<label htmlFor="email" className="mb-1 font-medium text-gray-700">
							Email
						</label>
						<Input id="email" name="email" placeholder="Enter your email" />
					</div>

					<div className="flex flex-col">
						<label htmlFor="password" className="mb-1 font-medium text-gray-700">
							Password
						</label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Enter your password"
						/>
					</div>

					<Button type="submit" className="mt-2">
						Login
					</Button>
				</Form>
			</div>
		</div>
	)
}
