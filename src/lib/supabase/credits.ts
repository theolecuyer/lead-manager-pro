import { createClient } from "../../../utils/supabase/client"

export interface AdjustCreditsParams {
	clientId: number
	creditAmount: number
	adjustmentType: 'add' | 'remove'
	reason: string
	additionalNotes?: string
	adjustedBy?: string
}

export async function adjustClientCredits({
	clientId,
	creditAmount,
	adjustmentType,
	reason,
	additionalNotes,
	adjustedBy,
}: AdjustCreditsParams) {
	const supabase = createClient()

	let userName = adjustedBy

	if (!userName) {
		const { data: { user } } = await supabase.auth.getUser()
		
		if (user) {
			const { data: profile } = await supabase
				.from('profiles')
				.select('full_name')
				.eq('id', user.id)
				.single()
			
			userName = profile?.full_name || 'Unknown User'
		} else {
			userName = 'System'
		}
	}

	const finalAmount = adjustmentType === 'remove' ? -Math.abs(creditAmount) : Math.abs(creditAmount)

	const { data, error } = await supabase.rpc("adjust_client_credits", {
		p_client_id: clientId,
		p_credit_amount: finalAmount,
		p_reason: reason,
		p_additional_notes: additionalNotes || null,
		p_adjusted_by: userName
	})

	if (error) {
		console.error("Error adjusting credits:", error)
		throw new Error(error.message)
	}

	return { success: true, data }
}

export interface IssueCreditToLeadParams {
	leadId: number
	creditAmount: number
	reason?: string
	additionalNotes?: string
	adjustedBy?: string
}

export async function issueCreditToLead({
	leadId,
	creditAmount,
	reason,
	additionalNotes,
	adjustedBy,
}: IssueCreditToLeadParams) {
	const supabase = createClient()

	let userName = adjustedBy

	if (!userName) {
		const { data: { user } } = await supabase.auth.getUser()
		
		if (user) {
			const { data: profile } = await supabase
				.from('profiles')
				.select('full_name')
				.eq('id', user.id)
				.single()
			
			userName = profile?.full_name || 'Unknown User'
		} else {
			userName = 'System'
		}
	}

	const { data, error } = await supabase.rpc("issue_credit_to_lead", {
		p_lead_id: leadId,
		p_credit_amount: creditAmount,
		p_reason: reason,
		p_additional_notes: additionalNotes || null,
		p_adjusted_by: userName
	})

	if (error) {
		console.error("Error issuing credit to lead:", error)
		throw new Error(error.message)
	}

	return { success: true, data }
}

export async function getAllCredits() {
	const supabase = createClient()

	const { data, error } = await supabase
		.from("credits")
		.select(`
			*,
			client:clients(id, name, email, phone),
			lead:leads(id, lead_name, lead_phone, lead_address)
		`)
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching credits:", error)
		throw new Error(error.message)
	}

	return data
}

export async function getCreditsByClientId(clientId: number) {
	const supabase = createClient()

	const { data, error } = await supabase
		.from("credits")
		.select(`
			*,
			client:clients(id, name, email, phone),
			lead:leads(id, lead_name, lead_phone, lead_address)
		`)
		.eq("client_id", clientId)
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching client credits:", error)
		throw new Error(error.message)
	}

	return data
}

export async function getCreditsByLeadId(leadId: number) {
	const supabase = createClient()

	const { data, error } = await supabase
		.from("credits")
		.select(`
			*,
			client:clients(id, name, email, phone),
			lead:leads(id, lead_name, lead_phone, lead_address)
		`)
		.eq("lead_id", leadId)
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching lead credits:", error)
		throw new Error(error.message)
	}

	return data
}

export async function getRecentCredits(limit: number = 10) {
	const supabase = createClient()

	const { data, error } = await supabase
		.from("credits")
		.select(`
			*,
			client:clients(id, name, email, phone),
			lead:leads(id, lead_name, lead_phone, lead_address)
		`)
		.order("created_at", { ascending: false })
		.limit(limit)

	if (error) {
		console.error("Error fetching recent credits:", error)
		throw new Error(error.message)
	}

	return data
}
