import { Button } from "@heroui/react"

type PaginationProps = {
	name: string
	currentPage: number
	totalPages: number
	itemsPerPage: number
	totalItems: number
	onPageChange: (page: number) => void
}

export default function Pagination({
	name,
	currentPage,
	totalPages,
	itemsPerPage,
	totalItems,
	onPageChange,
}: PaginationProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const maxVisible = 5

		if (totalPages <= maxVisible + 2) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		pages.push(1)

		if (currentPage > 3) {
			pages.push("...")
		}

		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (currentPage < totalPages - 2) {
			pages.push("...")
		}

		pages.push(totalPages)

		return pages
	}

	const pageNumbers = getPageNumbers()

	return (
		<div className="flex items-center justify-between">
			<p className="text-sm text-gray-600">
				Showing <span className="text-gray-900">{startItem}</span> to{" "}
				<span className="text-gray-900">{endItem}</span> of{" "}
				<span className="text-gray-900">{totalItems}</span> {name}
			</p>

			<div className="flex items-center gap-2">
				<Button
					disableRipple
					variant="bordered"
					size="sm"
					isDisabled={currentPage === 1}
					onPress={() => onPageChange(currentPage - 1)}
					className="text-gray-700 text-small border border-gray-300 rounded-lg px-3"
				>
					Previous
				</Button>

				{pageNumbers.map((page, index) => {
					if (page === "...") {
						return (
							<span key={`ellipsis-${index}`} className="px-2 text-gray-500">
								...
							</span>
						)
					}

					return (
						<Button
							disableRipple
							key={page}
							variant={currentPage === page ? "solid" : "bordered"}
							size="sm"
							onPress={() => onPageChange(page as number)}
							className={
								currentPage === page
									? "bg-blue-500 text-white text-small min-w-[36px] rounded-lg p-0"
									: "text-gray-700 text-small border border-gray-300 min-w-[36px] rounded-lg p-0"
							}
						>
							{page}
						</Button>
					)
				})}

				<Button
					disableRipple
					variant="bordered"
					size="sm"
					isDisabled={currentPage === totalPages}
					onPress={() => onPageChange(currentPage + 1)}
					className="text-gray-700 text-small border border-gray-300 rounded-lg px-3"
				>
					Next
				</Button>
			</div>
		</div>
	)
}
