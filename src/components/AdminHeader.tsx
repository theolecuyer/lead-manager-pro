"use client"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import {
	HomeIcon,
	UsersIcon,
	ChartBarIcon,
	Cog6ToothIcon,
	ChevronDownIcon,
	UserIcon,
} from "@heroicons/react/24/solid"
import { useEffect } from "react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react"
import { useAuth } from "@/providers/AuthProvider"

interface AdminLayoutUIProps {
	children: React.ReactNode
	header?: React.ReactNode
	rightAction?: React.ReactNode
}

export default function AdminHeader({ children, header, rightAction }: AdminLayoutUIProps) {
	const pathname = usePathname()
	const { user, profile, loading } = useAuth()

	useEffect(() => {
		if (!loading && !user) redirect("/login")
	}, [user, loading])

	if (loading) return <p className="text-center">Loading user...</p>

	const navItems = [
		{ href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
		{ href: "/admin/clients", label: "Clients", icon: UsersIcon },
		{ href: "/admin/reports", label: "Reports", icon: ChartBarIcon },
		{ href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
	]

	return (
		<div className="flex min-h-screen">
			<aside className="hidden md:block w-52 p-4 border-r border-gray-200 shadow-md">
				<h2 className="text-lg font-bold pb-0.5 mt-2">Lead Manager Pro</h2>
				<h2 className="text-sm font-medium text-gray-500 mb-5">Admin Dashboard</h2>
				<div className="-mx-4 h-px bg-gray-200" />
				<nav className="flex flex-col gap-2 mt-5">
					{navItems.map(({ href, label, icon: Icon }) => {
						const active = pathname === href || pathname.startsWith(href + "/")
						return (
							<Link
								key={href}
								href={href}
								className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
									active
										? "bg-blue-500 text-white"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Icon className="h-5 w-5" />
								{label}
							</Link>
						)
					})}
				</nav>
			</aside>

			<div className="flex-1 flex flex-col">
				<header className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
					<div className="flex-1">{header}</div>
					<div className="flex items-center gap-4">
						{rightAction && <div className="flex items-center">{rightAction}</div>}

						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Button
									disableRipple
									variant="light"
									className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition focus:outline-none"
								>
									<UserIcon className="w-4 h-4 text-gray-500" />
									<span className="font-medium">
										{profile?.username ?? "Account"}
									</span>
									<ChevronDownIcon className="w-4 h-4 text-gray-500" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="User Menu"
								className="bg-white shadow-lg rounded-md p-2 min-w-[160px]"
								itemClasses={{
									base: [
										"rounded-md",
										"px-3",
										"py-2.5",
										"text-sm",
										"hover:bg-gray-100",
										"transition",
										"mb-1",
										"last:mb-0",
										"focus:bg-gray-100",
										"data-[hover=true]:bg-gray-100",
									],
								}}
							>
								<DropdownItem key="profile">Profile</DropdownItem>
								<DropdownItem key="settings">Settings</DropdownItem>
								<DropdownItem
									key="logout"
									className="text-danger font-medium"
									color="danger"
								>
									<form method="POST" action="/signout" className="w-full">
										<button type="submit" className="w-full text-left">
											Log Out
										</button>
									</form>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</header>

				<main className="flex-1 p-6 bg-gray-100">{children}</main>
			</div>
		</div>
	)
}
