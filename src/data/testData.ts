export type ClientData = {
	id: number
	name: string
	leadsToday: number
	credits: number
}

export const clients: ClientData[] = [
	{ id: 1, name: "Sarah Johnson", leadsToday: 5, credits: 2 },
	{ id: 2, name: "Emily Davis", leadsToday: 4, credits: 0 },
	{ id: 3, name: "Lisa Thompson", leadsToday: 2, credits: 3 },
	{ id: 4, name: "Michael Chen", leadsToday: 6, credits: 0 },
	{ id: 5, name: "Christopher Perry", leadsToday: 5, credits: 1 },
	{ id: 6, name: "Bob Wallace", leadsToday: 2, credits: 1 },
]
