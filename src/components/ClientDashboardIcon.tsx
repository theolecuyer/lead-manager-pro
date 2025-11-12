import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

export type ClientDashboardIconProps = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	stats: boolean
	statsText: string
	textcolor: string
	color1: string
	color2: string
	borderColor: string
	numToday: number
	comparison: number
	comparisonTime: string
	title: string
}

type Difference = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	percentage: number
	sign: string
	color: string
}

const calculateDiff = (numToday: number, numYesterday: number): Difference => {
	const diff = ((numToday - numYesterday) / (numToday + numYesterday)) * 100
	if (diff >= 0) {
		return { icon: ArrowUpIcon, percentage: diff, sign: "+", color: "text-green-500" }
	} else {
		return { icon: ArrowDownIcon, percentage: diff, sign: "-", color: "text-red-500" }
	}
}

export default function ClientDashboardIcon(dashboardIconProps: ClientDashboardIconProps) {
	const diffObject = calculateDiff(dashboardIconProps.numToday, dashboardIconProps.comparison)

	return (
		<div
			className={`bg-white px-5 py-4 rounded-lg shadow grid grid-cols-4 border-l-4 ${dashboardIconProps.borderColor}`}
		>
			<div className="col-span-3">
				<p className="text-xs sm:text-sm font-light font-sans whitespace-nowrap">
					{dashboardIconProps.title}
				</p>
				<p
					className={`font-extrabold ${dashboardIconProps.textcolor} text-3xl mt-2 font-sans`}
				>
					{dashboardIconProps.numToday}
				</p>
				{dashboardIconProps.stats ? (
					<div className="hidden [@media(min-width:480px)]:block mt-1 items-center">
						<span className={`pl-0.5 text-xs ${diffObject.color} font-sans`}>
							{diffObject.sign}
							{Math.abs(diffObject.percentage).toFixed(1)}%{" "}
							{dashboardIconProps.comparisonTime}
						</span>
					</div>
				) : (
					<div className="hidden [@media(min-width:480px)]:block mt-1 items-center">
						<span className="font-sans text-xs text-gray-500 whitespace-nowrap">
							{dashboardIconProps.statsText}
						</span>
					</div>
				)}
			</div>
			<div className="flex items-center justify-center lg:pr-1 xl:pr-2">
				<div
					className={`${dashboardIconProps.color1} px-3 py-5 sm:px-4 sm:py-6 lg:px-3 lg:py-3 xl:px-4 xl:py-6 rounded-lg`}
				>
					<dashboardIconProps.icon
						className={`h-6 w-6 xl:h-8 xl:w-8 ${dashboardIconProps.color2}`}
					/>
				</div>
			</div>
		</div>
	)
}
