export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          active: boolean | null
          created_at: string
          credit_balance: number
          credits_issued_today: number
          email: string | null
          id: number
          last_reset_date: string | null
          leads_paid_today: number
          leads_received_today: number
          lifetime_revenue: number
          name: string | null
          phone: string | null
          total_leads_count: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          credit_balance?: number
          credits_issued_today?: number
          email?: string | null
          id?: number
          last_reset_date?: string | null
          leads_paid_today?: number
          leads_received_today?: number
          lifetime_revenue?: number
          name?: string | null
          phone?: string | null
          total_leads_count?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          credit_balance?: number
          credits_issued_today?: number
          email?: string | null
          id?: number
          last_reset_date?: string | null
          leads_paid_today?: number
          leads_received_today?: number
          lifetime_revenue?: number
          name?: string | null
          phone?: string | null
          total_leads_count?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      credits: {
        Row: {
          additional_notes: string | null
          adjusted_by: string | null
          adjustment_type: string
          amount: number
          balance_after: number
          client_id: number
          created_at: string
          id: number
          lead_id: number | null
          reason: string | null
        }
        Insert: {
          additional_notes?: string | null
          adjusted_by?: string | null
          adjustment_type: string
          amount: number
          balance_after: number
          client_id: number
          created_at?: string
          id?: never
          lead_id?: number | null
          reason?: string | null
        }
        Update: {
          additional_notes?: string | null
          adjusted_by?: string | null
          adjustment_type?: string
          amount?: number
          balance_after?: number
          client_id?: number
          created_at?: string
          id?: never
          lead_id?: number | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          active_clients_count: number
          client_breakdown: Json
          created_at: string
          id: number
          net_billable: number
          report_date: string
          total_credits: number
          total_leads: number
        }
        Insert: {
          active_clients_count: number
          client_breakdown: Json
          created_at?: string
          id?: never
          net_billable: number
          report_date: string
          total_credits: number
          total_leads: number
        }
        Update: {
          active_clients_count?: number
          client_breakdown?: Json
          created_at?: string
          id?: never
          net_billable?: number
          report_date?: string
          total_credits?: number
          total_leads?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          additional_info: string | null
          client_id: number | null
          created_at: string
          credited_at: string | null
          credited_by: string | null
          credited_reason: string | null
          id: number
          lead_address: string | null
          lead_name: string | null
          lead_phone: string | null
          payment_status: string
          product_id: number | null
          report_id: number | null
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          client_id?: number | null
          created_at?: string
          credited_at?: string | null
          credited_by?: string | null
          credited_reason?: string | null
          id?: number
          lead_address?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          payment_status?: string
          product_id?: number | null
          report_id?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          client_id?: number | null
          created_at?: string
          credited_at?: string | null
          credited_by?: string | null
          credited_reason?: string | null
          id?: number
          lead_address?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          payment_status?: string
          product_id?: number | null
          report_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "daily_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          client_user_id: number | null
          full_name: string | null
          id: string
          user_role: Database["public"]["Enums"]["user_role"]
          username: string | null
        }
        Insert: {
          client_user_id?: number | null
          full_name?: string | null
          id: string
          user_role: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Update: {
          client_user_id?: number | null
          full_name?: string | null
          id?: string
          user_role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_client_credits: {
        Args: {
          p_additional_notes?: string
          p_adjusted_by?: string
          p_client_id: number
          p_credit_amount: number
          p_reason?: string
        }
        Returns: undefined
      }
      find_client_by_name: {
        Args: { client_name_input: string }
        Returns: number
      }
      generate_daily_report: { Args: never; Returns: undefined }
      get_todays_leads: {
        Args: never
        Returns: {
          additional_info: string
          client: Json
          client_id: number
          created_at: string
          credited_at: string
          credited_by: string
          credited_reason: string
          id: number
          lead_address: string
          lead_name: string
          lead_phone: string
          payment_status: string
          product: Json
          product_id: number
          report_id: number
          updated_at: string
        }[]
      }
      issue_credit_to_lead: {
        Args: {
          p_additional_notes?: string
          p_adjusted_by?: string
          p_credit_amount: number
          p_lead_id: number
          p_reason?: string
        }
        Returns: undefined
      }
      issue_credits_to_client: {
        Args: {
          p_additional_notes?: string
          p_adjusted_by?: string
          p_client_id: number
          p_credit_amount: number
          p_reason: string
        }
        Returns: undefined
      }
      reset_daily_lead_counters: { Args: never; Returns: undefined }
    }
    Enums: {
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "client"],
    },
  },
} as const
