"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	const navItems = [
		{
			href: "/admin/dashboard",
			label: "Dashboard",
			icon: HomeIcon,
			title: "Dashboard Overview",
			action: false,
		},
		{ href: "/admin/clients", label: "Clients", icon: UsersIcon },
		{ href: "/admin/reports", label: "Reports", icon: ChartBarIcon },
		{ href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
	]

	const activeNavItem = navItems.find(
		({ href }) => pathname === href || pathname.startsWith(href + "/")
	)
	const pageTitle = activeNavItem?.title ?? activeNavItem?.label ?? "Dashboard"

	return (
		<div className="flex min-h-screen">
			{/* Desktop Nav */}
			<aside className="hidden md:block w-50 p-4 border-r border-gray-200 shadow-md">
				<h2 className="text-lg font-bold pb-0.5 mt-2">Lead Manager Pro</h2>
				<h2 className="text-sm font-medium text-gray-500 mb-5">Admin Dashboard</h2>
				<div className="-mx-4 h-px bg-gray-200"></div>
				<nav className="flex flex-col gap-2 mt-5">
					{navItems.map(({ href, label, icon: Icon }) => {
						const active = pathname === href || pathname.startsWith(href + "/")
						return (
							<Link
								key={href}
								href={href}
								className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${
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

			{/* Shrunk Desktop/Mobile Nav */}
			<nav className="flex md:hidden flex-col gap-2 mt-5">
				{navItems.map(({ href, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(href + "/")
					return (
						<Link
							key={href}
							href={href}
							className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${
									active
										? "bg-blue-500 text-white"
										: "text-gray-700 hover:bg-gray-100"
								}`}
						>
							<Icon className="h-5 w-5" />
						</Link>
					)
				})}
			</nav>

			<div className="flex-1 flex flex-col">
				{/* Top Bar */}
				<header className="flex items-center justify-between bg-white p-4 shadow-m border-gray-200 border-b">
					<h1 className="text-xl font-semibold">{activeNavItem?.title}</h1>
					<div className="flex items-center gap-4">
						{activeNavItem?.action && (
							<button className="px-3 py-1 rounded-md bg-blue-600 text-white">
								Action
							</button>
						)}
						<div className="relative">
							<button className="rounded-full bg-gray-200 px-3 py-1">User</button>
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 p-6 bg-gray-100">{children}</main>
			</div>
		</div>
	)
}
