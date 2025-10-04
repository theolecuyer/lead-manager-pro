"use client"

import { HeroUIProvider } from "@heroui/react"
import { AuthProvider } from "./AuthProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<HeroUIProvider>{children}</HeroUIProvider>
		</AuthProvider>
	)
}
