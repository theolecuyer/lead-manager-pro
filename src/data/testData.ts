import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type ClientData = {
	id: number
	name: string
	leadsToday: number
	credits: number
	creditsToday: number
	billedToday: number
}

export type LeadData = {
	clientId: number
	date: Date
	timestamp: Timestamp
	leadName: string
	leadPhoneNumber: string
	additionalInfo: string
}

export const clients: ClientData[] = [
	{ id: 1, name: "Sarah Johnson", leadsToday: 5, credits: 2, creditsToday: 1, billedToday: 3 },
	{ id: 2, name: "Emily Davis", leadsToday: 4, credits: 0, creditsToday: 0, billedToday: 4 },
	{ id: 3, name: "Lisa Thompson", leadsToday: 3, credits: 3, creditsToday: 2, billedToday: 3 },
	{ id: 4, name: "Michael Chen", leadsToday: 6, credits: 0, creditsToday: 0, billedToday: 6 },
	{
		id: 5,
		name: "Christopher Perry",
		leadsToday: 5,
		credits: 1,
		creditsToday: 1,
		billedToday: 4,
	},
	{ id: 6, name: "Bob Wallace", leadsToday: 2, credits: 1, creditsToday: 0, billedToday: 1 },
	{ id: 7, name: "Ava Martinez", leadsToday: 7, credits: 2, creditsToday: 0, billedToday: 5 },
	{ id: 8, name: "Daniel Brooks", leadsToday: 3, credits: 2, creditsToday: 2, billedToday: 1 },
	{ id: 9, name: "Nina Patel", leadsToday: 6, credits: 1, creditsToday: 0, billedToday: 5 },
	{ id: 10, name: "Jason Lee", leadsToday: 1, credits: 3, creditsToday: 0, billedToday: 0 },
	{ id: 11, name: "Olivia Nguyen", leadsToday: 8, credits: 0, creditsToday: 0, billedToday: 8 },
	{ id: 12, name: "Ethan Ramirez", leadsToday: 4, credits: 2, creditsToday: 1, billedToday: 2 },
]

export const leads: LeadData[] = [
	{
		clientId: 1,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "John Carter",
		leadPhoneNumber: "(555) 123-4567",
		additionalInfo: "Interested in solar panel installation.",
	},
	{
		clientId: 1,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Sarah Mills",
		leadPhoneNumber: "(555) 234-5678",
		additionalInfo: "Requested callback about pricing.",
	},
	{
		clientId: 2,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Emma Wilson",
		leadPhoneNumber: "(555) 345-6789",
		additionalInfo: "Needs follow-up for quote approval.",
	},
	{
		clientId: 3,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "David Brown",
		leadPhoneNumber: "(555) 456-7890",
		additionalInfo: "Asked for Spanish-speaking rep.",
	},
	{
		clientId: 4,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Michael Green",
		leadPhoneNumber: "(555) 567-8901",
		additionalInfo: "Interested in multi-location service.",
	},
	{
		clientId: 5,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Rachel Adams",
		leadPhoneNumber: "(555) 678-9012",
		additionalInfo: "Wants to schedule a consultation.",
	},
	{
		clientId: 6,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Thomas Clark",
		leadPhoneNumber: "(555) 789-0123",
		additionalInfo: "Follow-up for invoice question.",
	},
	{
		clientId: 7,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Ava Martinez",
		leadPhoneNumber: "(555) 890-1234",
		additionalInfo: "Requested info on referral program.",
	},
	{
		clientId: 8,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Daniel Brooks",
		leadPhoneNumber: "(555) 901-2345",
		additionalInfo: "Asked about pricing breakdown.",
	},
	{
		clientId: 9,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Nina Patel",
		leadPhoneNumber: "(555) 012-3456",
		additionalInfo: "Wants follow-up next week.",
	},
	{
		clientId: 10,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Jason Lee",
		leadPhoneNumber: "(555) 222-3333",
		additionalInfo: "Needs bulk order info.",
	},
	{
		clientId: 11,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Olivia Nguyen",
		leadPhoneNumber: "(555) 333-4444",
		additionalInfo: "Requested demo scheduling.",
	},
	{
		clientId: 12,
		date: new Date(),
		timestamp: Date.now(),
		leadName: "Ethan Ramirez",
		leadPhoneNumber: "(555) 444-5555",
		additionalInfo: "Interested in enterprise pricing.",
	},
]
