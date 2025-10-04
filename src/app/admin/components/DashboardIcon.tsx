import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

export type DashboardIconProps = {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	textcolor: string
	color1: string
	color2: string
	numToday: number
	numYesterday: number
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

export default function DashboardIcon(dashboardIconProps: DashboardIconProps) {
	const diffObject = calculateDiff(dashboardIconProps.numToday, dashboardIconProps.numYesterday)

	return (
		<div className="bg-white p-5 rounded shadow grid grid-cols-4 ">
			<div className="col-span-3">
				<p className="text-xs sm:text-sm font-light font-sans whitespace-nowrap">
					{dashboardIconProps.title}
				</p>
				<p
					className={`font-extrabold ${dashboardIconProps.textcolor} text-3xl mt-2 font-sans`}
				>
					{dashboardIconProps.numToday}
				</p>
				<div className="hidden [@media(min-width:480px)]:block mt-2 items-center">
					<diffObject.icon className={`h-5 w-5 ${diffObject.color}`} />
					<span className={`pl-0.5 text-xs ${diffObject.color} font-sans`}>
						{diffObject.sign}
						{Math.abs(diffObject.percentage).toFixed(1)}%
					</span>
					<span className="font-sans text-xs pl-1 whitespace-nowrap">vs yesterday</span>
				</div>
			</div>
			<div className="flex items-center justify-center lg:pr-1 xl:pr-2">
				<div
					className={`${dashboardIconProps.color1} px-3 py-5 sm:px-4 sm:py-6 lg:px-1.5 lg:py-3.5 xl:px-4 xl:py-6 rounded-lg`}
				>
					<dashboardIconProps.icon
						className={`h-8 w-8 xl:h-10 xl:w-10 ${dashboardIconProps.color2}`}
					/>
				</div>
			</div>
		</div>
	)
}
