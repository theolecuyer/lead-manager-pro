import { Credit } from "@/app/admin/clients/[id]/page"

export default function CreditTableRow(credit: Credit) {
	const formattedDate = credit.created_at
		? new Date(credit.created_at).toLocaleString("en-US", {
				timeZone: "America/New_York",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
		  })
		: "-"

	const REASON_MAP: Record<string, string> = {
		poor_lead_quality: "Poor Lead Quality",
		duplicate: "Duplicate",
		wrong_service_area: "Wrong Service Area",
		customer_goodwill: "Customer Goodwill",
		manual_adjustment: "Manual Adjustment",
		auto_applied_to_lead: "Auto Applied to Lead",
		retroactive_application: "Retroactive Application",
		other: "Other",
	}

	let formattedReason = "N/A"
	if (credit.reason) {
		formattedReason = REASON_MAP[credit.reason]
	}

	let textColor, text, bgColor, textColor2
	switch (credit.adjustment_type) {
		case "add":
			text = "Added"
			textColor = "text-green-700"
			textColor2 = "text-green-800"
			bgColor = "bg-green-100"
			break
		case "deduct":
			text = "Deducted"
			textColor = "text-red-600"
			textColor2 = "text-red-800"
			bgColor = "bg-red-100"
			break
		case "quality_adjustment":
			text = "Non-Billable"
			textColor = "text-orange-600"
			textColor2 = "text-orange-800"
			bgColor = "bg-orange-100"
			break
	}

	return (
		<div className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center">
			<p className="ml-2 flex justify-start text-small font-sans font-medium text-gray-700">
				{formattedDate}
			</p>
			<div className="ml-[20%]">
				<span className={`inline-flex items-center ${bgColor} rounded-full px-2.5 py-0.5`}>
					<p className={`${textColor2} text-small font-sans font-medium`}>{text}</p>
				</span>
			</div>
			<p className={`text-small font-sans font-medium ${textColor}`}>{credit.amount}</p>
			<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
				{credit.balance_after}
			</p>
			<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
				{formattedReason}
			</p>
			<p className="flex justify-start text-small font-sans font-medium text-gray-600 ml-[30%]">
				{credit.adjusted_by ? credit.adjusted_by : "System"}
			</p>
		</div>
	)
}
