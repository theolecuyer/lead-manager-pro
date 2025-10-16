import { Credit } from "@/app/admin/clients/[id]/page"

export default function CreditTableRow(credit: Credit) {
	const createdDate = new Date(credit.created_at)
	const formattedDate = createdDate.toLocaleString("en-US", {
		timeZone: "America/New_York",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})

	return (
		<div className="grid grid-cols-6 border-y border-gray-100 grid-rows-1 p-3 px-5 items-center">
			<p className="ml-2 flex justify-start text-small font-sans font-medium text-gray-700">
				{formattedDate}
			</p>
			<p className="text-small font-sans font-medium text-gray-700 ml-[30%]">
				{credit.adjustment_type}
			</p>
			<p className="text-small font-sans font-medium text-gray-700">{credit.amount}</p>
			<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
				{credit.balance_after}
			</p>
			<p className="text-small font-sans font-medium text-gray-600 ml-[-20%]">
				{credit.additional_notes}
			</p>
			<p className="flex justify-start text-small font-sans font-medium text-gray-600 ml-[30%]">
				{credit.adjusted_by}
			</p>
		</div>
	)
}
