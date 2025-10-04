// providers/AuthProvider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "../../utils/supabase/client"
import type { User } from "@supabase/supabase-js"

type Profile = { username?: string; full_name?: string } | null

type AuthContextType = {
	user: User | null
	profile: Profile
	loading: boolean
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
})

export function AuthProvider({
	children,
	initialUser,
	initialProfile,
}: {
	children: React.ReactNode
	initialUser?: User | null
	initialProfile?: Profile
}) {
	const supabase = createClient()
	const [user, setUser] = useState<User | null>(initialUser ?? null)
	const [profile, setProfile] = useState<Profile>(initialProfile ?? null)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		let mounted = true
		async function loadUserIfAbsent() {
			if (initialUser) return
			setLoading(true)
			try {
				const { data } = await supabase.auth.getUser()
				if (!mounted) return
				setUser(data.user ?? null)

				if (data.user) {
					const { data: p, error } = await supabase
						.from("profiles")
						.select("username, full_name")
						.eq("id", data.user.id)
						.single()
					if (!error && p) setProfile(p)
				}
			} catch (err) {
				console.error("AuthProvider loadUserIfAbsent error:", err)
			} finally {
				if (mounted) setLoading(false)
			}
		}
		loadUserIfAbsent()
		return () => {
			mounted = false
		}
	}, [supabase, initialUser])

	useEffect(() => {
		const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			const u = session?.user ?? null
			setUser(u)
			if (!u) setProfile(null)
		})

		return () => {
			try {
				if ((subscription as any)?.unsubscribe) (subscription as any).unsubscribe()
				else if ((subscription as any)?.subscription?.unsubscribe)
					(subscription as any).subscription.unsubscribe()
			} catch (e) {}
		}
	}, [supabase])

	return (
		<AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
