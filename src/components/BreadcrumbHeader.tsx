import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"

type Crumb = {
	content: string
	href: string
}

type BreadcrumbHeaderProps = {
	crumbs: Crumb[]
}

const BreadcrumbHeader = ({ crumbs }: BreadcrumbHeaderProps) => {
	const router = useRouter()

	return (
		<div className="flex items-center text-sm">
			{crumbs.map((crumb, i) => (
				<div key={i} className="flex items-center text-sm">
					{i == crumbs.length - 1 ? (
						<button
							key={i}
							onClick={() => router.push(crumb.href)}
							className="hover:cursor-pointer font-medium text-gray-900"
						>
							{crumb.content}
						</button>
					) : (
						<button
							key={i}
							onClick={() => router.push(crumb.href)}
							className="hover:cursor-pointer text-slate-600"
						>
							{crumb.content}
						</button>
					)}

					{i < crumbs.length - 1 && (
						<ChevronRightIcon className="h-4 w-4 mx-1 text-slate-600" />
					)}
				</div>
			))}
		</div>
	)
}

export default BreadcrumbHeader
