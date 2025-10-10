"use client"

export type LeadCardProps = {
	id: number
	clientName?: string
	leadName?: string
	phone?: string
	createdAt?: string
	status?: string
}

export default function LeadTableRow({
	id,
	clientName,
	leadName,
	phone,
	createdAt,
	status,
}: LeadCardProps) {
	const handleClientClick = () => {}

	const formattedTime = createdAt
		? new Date(createdAt).toLocaleTimeString("en-US", {
				timeZone: "America/New_York", // EST
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
		  })
		: "-"
	return (
		<div className="grid grid-cols-6 grid-rows-1 p-3 px-5 items-center">
			<button
				onClick={handleClientClick}
				className="text-small font-sans font-medium hover:cursor-pointer"
			>
				{clientName}
			</button>
			<p className="text-small font-sans font-medium"> {leadName}</p>
			<p className="text-small font-sans font-medium ">{phone}</p>
			<p className="text-small font-sans font-medium text-gray-600">{formattedTime}</p>
			<p>{status}</p>
		</div>
	)
}
