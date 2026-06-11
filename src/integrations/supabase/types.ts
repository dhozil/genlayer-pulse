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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      community_signals: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          proposal_id: string
          signal: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          proposal_id: string
          signal: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          proposal_id?: string
          signal?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_signals_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          author_name: string
          category: string
          community_down: number
          community_up: number
          consensus_confidence: number | null
          consensus_summary: string | null
          consensus_verdict: Database["public"]["Enums"]["vote_choice"] | null
          context: string | null
          contract_proposal_id: string | null
          contract_tx_hash: string | null
          created_at: string
          finalized_at: string | null
          id: string
          question: string
          status: Database["public"]["Enums"]["proposal_status"]
          total_abstain: number
          total_no: number
          total_yes: number
        }
        Insert: {
          author_name?: string
          category?: string
          community_down?: number
          community_up?: number
          consensus_confidence?: number | null
          consensus_summary?: string | null
          consensus_verdict?: Database["public"]["Enums"]["vote_choice"] | null
          context?: string | null
          contract_proposal_id?: string | null
          contract_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          id?: string
          question: string
          status?: Database["public"]["Enums"]["proposal_status"]
          total_abstain?: number
          total_no?: number
          total_yes?: number
        }
        Update: {
          author_name?: string
          category?: string
          community_down?: number
          community_up?: number
          consensus_confidence?: number | null
          consensus_summary?: string | null
          consensus_verdict?: Database["public"]["Enums"]["vote_choice"] | null
          context?: string | null
          contract_proposal_id?: string | null
          contract_tx_hash?: string | null
          created_at?: string
          finalized_at?: string | null
          id?: string
          question?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          total_abstain?: number
          total_no?: number
          total_yes?: number
        }
        Relationships: []
      }
      validator_votes: {
        Row: {
          confidence: number
          created_at: string
          id: string
          model: string
          proposal_id: string
          reasoning: string
          validator_name: string
          vote: Database["public"]["Enums"]["vote_choice"]
        }
        Insert: {
          confidence?: number
          created_at?: string
          id?: string
          model: string
          proposal_id: string
          reasoning: string
          validator_name: string
          vote: Database["public"]["Enums"]["vote_choice"]
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          model?: string
          proposal_id?: string
          reasoning?: string
          validator_name?: string
          vote?: Database["public"]["Enums"]["vote_choice"]
        }
        Relationships: [
          {
            foreignKeyName: "validator_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      proposal_status: "pending" | "deliberating" | "finalized" | "failed"
      vote_choice: "yes" | "no" | "abstain"
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
      proposal_status: ["pending", "deliberating", "finalized", "failed"],
      vote_choice: ["yes", "no", "abstain"],
    },
  },
} as const
