"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "../../utils/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
	user: User | null
	profile: { username: string; full_name: string } | null
	loading: boolean
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const supabase = createClient()
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<{ username: string; full_name: string } | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadUser() {
			setLoading(true)
			const {
				data: { user },
			} = await supabase.auth.getUser()
			setUser(user ?? null)

			if (user) {
				const { data, error } = await supabase
					.from("profiles")
					.select("username, full_name")
					.eq("id", user.id)
					.single()
				if (!error && data) setProfile(data)
			}

			setLoading(false)
		}

		loadUser()

		const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			if (!session) setProfile(null)
		})

		return () => subscription.subscription.unsubscribe()
	}, [supabase])

	return (
		<AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
