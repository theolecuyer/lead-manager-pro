"use client"

import { clients } from "@/data/testData"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import React from "react"
import AdminHeader from "@/components/AdminHeader"

interface ClientPageProps {
	params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
	const { id } = React.use(params)
	const clientId = parseInt(id)
	const client = clients.find((c) => c.id === clientId)
	const router = useRouter()

	useEffect(() => {
		if (!client) {
			router.push("/admin/clients")
		}
	}, [client, router])

	if (!client) return null

	return (
		<AdminHeader header={<h1>{client.name}</h1>}>
			<div className="p-10">
				<h1 className="text-2xl font-bold mb-2">{client.name}</h1>
				<p className="text-gray-700">Leads Today: {client.leadsToday}</p>
				<p className="text-gray-700">Billed Today: {client.billedToday}</p>
				<p className="text-gray-700">Credits: {client.credits}</p>
				<p className="text-gray-700">Credits Today: {client.creditsToday}</p>
			</div>
		</AdminHeader>
	)
}
