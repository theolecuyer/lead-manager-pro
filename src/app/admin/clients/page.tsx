"use client"

import AdminHeader from "@/components/AdminHeader"

export default function AdminClients() {
	const handleAddClient = () => {
		console.log("Adding client")
	}

	return (
		<AdminHeader
			header={
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-bold">Clients</h1>
					<button
						onClick={handleAddClient}
						className="px-3 py-1 mr-2 rounded-md bg-blue-500 text-white hover:cursor-pointer"
					>
						Add New Client +
					</button>
				</div>
			}
		>
			<div>Clients</div>
		</AdminHeader>
	)
}
