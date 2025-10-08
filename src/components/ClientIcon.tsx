"use client"

import { ArrowTrendingUpIcon, MinusCircleIcon } from "@heroicons/react/24/solid"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export type ClientCardProps = {
	id: number
	name: string
	leadsToday: number
	billedToday: number
}

export default function ClientCardComponent({
	id,
	name,
	leadsToday,
	billedToday,
}: ClientCardProps) {
	const netBillable = billedToday
	const credited = leadsToday - billedToday
	const netColor = netBillable > 0 ? "text-[#46c392]" : "text-red-700"
	const router = useRouter()

	const handleClientClick = () => {
		router.push(`/admin/clients/${id}`)
	}

	return (
		<button
			onClick={handleClientClick}
			className="group select-none cursor-pointer bg-white rounded-md p-5 border border-gray-200 w-full text-left grid grid-cols-4 gap-3
            transform transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg
            hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-100"
		>
			{/* Name + arrow */}
			<div className="col-span-4 row-span-1">
				<div className="flex justify-between">
					<p className="text-medium text-gray-900 font-semibold font-sans truncate">
						{name}
					</p>
					<ArrowRightIcon className="w-5 h-5 text-gray-400 stroke-2" />
				</div>
			</div>

			{/* Leads Today */}
			<div className="col-span-4 row-span-1">
				<div className="grid grid-cols-4 items-center">
					<div className="col-span-3">
						<span className="inline-flex items-center bg-blue-100 rounded-xl px-2.5 py-0.5 gap-1">
							<ArrowTrendingUpIcon className="text-blue-700 h-4 w-4" />
							<span className="text-blue-700 text-sm font-semibold font-sans truncate">
								Leads Today
							</span>
						</span>
					</div>
					<div className="flex justify-end items-center">
						<span className="inline-flex items-center bg-blue-100 rounded-xl px-2.5 py-0.5">
							<span className="text-blue-700 text-sm font-semibold font-sans">
								{leadsToday}
							</span>
						</span>
					</div>
				</div>
			</div>

			{/* Credits */}
			<div className="col-span-4 row-span-1">
				<div className="grid grid-cols-4 items-center">
					<div className="col-span-3">
						<span className="inline-flex items-center bg-red-100 rounded-xl px-2.5 py-0.5 gap-1">
							<MinusCircleIcon className="text-red-700 h-4 w-4" />
							<span className="text-red-700 text-sm font-semibold font-sans truncate">
								Credited
							</span>
						</span>
					</div>
					<div className="flex justify-end items-center">
						<span className="inline-flex items-center bg-red-100 rounded-xl px-2.5 py-0.5">
							<span className="text-red-700 text-sm font-semibold font-sans">
								{credited}
							</span>
						</span>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="col-span-4">
				<div className="bg-gray-200 w-full h-px mt-2"></div>
			</div>

			{/* Net billable */}
			<div className="col-span-4 row-span-1">
				<div className="grid grid-cols-4 items-center">
					<div className="col-span-3">
						<span className="inline-flex items-center">
							<span
								className={`text-sm text-[#374151] font-semibold font-sans truncate`}
							>
								Net Billable
							</span>
						</span>
					</div>
					<div className="flex justify-end items-center">
						<span className="inline-flex items-center">
							<span className={`${netColor} text-medium font-extrabold font-sans`}>
								{netBillable}
							</span>
						</span>
					</div>
				</div>
			</div>
		</button>
	)
}
