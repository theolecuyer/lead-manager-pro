"use client"

import { AuthProvider } from "@/providers/AuthProvider"
import type { User } from "@supabase/supabase-js"

export default function AdminLayoutClient({
	children,
	initialUser,
	initialProfile,
}: {
	children: React.ReactNode
	initialUser?: User | null
	initialProfile?: { username?: string; full_name?: string } | null
}) {
	return (
		<AuthProvider initialUser={initialUser} initialProfile={initialProfile}>
			{children}
		</AuthProvider>
	)
}
