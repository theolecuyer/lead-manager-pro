import { createClient } from "../../../utils/supabase/client"

export interface IssueCreditParams {
	clientId: number
	creditAmount: number
	reason?: string
	adjustedBy?: string
}

export async function issueCreditsToClient({
	clientId,
	creditAmount,
	reason = "manual_adjustment",
	adjustedBy,
}: IssueCreditParams) {
	const supabase = createClient()

	// Get current user ID if not provided
	const userId = adjustedBy || (await supabase.auth.getUser()).data.user?.id

	const { data, error } = await supabase.rpc("issue_credits_to_client", {
		p_client_id: clientId,
		p_credit_amount: creditAmount,
		p_reason: reason,
		p_adjusted_by: userId,
	})

	if (error) {
		console.error("Error issuing credits:", error)
		throw new Error(error.message)
	}

	return { success: true, data }
}

export interface IssueCreditToLeadParams {
	leadId: number
	creditAmount: number
	reason?: string
	adjustedBy?: string
}

export async function issueCreditToLead({
	leadId,
	creditAmount,
	reason,
	adjustedBy,
}: IssueCreditToLeadParams) {
	const supabase = createClient()

	const userId = adjustedBy || (await supabase.auth.getUser()).data.user?.id

	const { data, error } = await supabase.rpc("issue_credit_to_lead", {
		p_lead_id: leadId,
		p_credit_amount: creditAmount,
		p_reason: reason,
		p_adjusted_by: userId,
	})

	if (error) {
		console.error("Error issuing credit to lead:", error)
		throw new Error(error.message)
	}

	return { success: true, data }
}
