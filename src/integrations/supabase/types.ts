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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      campanha_configuracao: {
        Row: {
          autorizacao: string | null
          campanha_id: string
          confirmacao_envio: Json | null
          created_at: string
          formularios_adicionais: Json | null
          id: string
          layout_envio: Json | null
          lembrete: Json | null
          pontos_contato: Json | null
          problemas: Json | null
          recomendacao: string | null
          trecho_pergunta: string | null
          updated_at: string
        }
        Insert: {
          autorizacao?: string | null
          campanha_id: string
          confirmacao_envio?: Json | null
          created_at?: string
          formularios_adicionais?: Json | null
          id?: string
          layout_envio?: Json | null
          lembrete?: Json | null
          pontos_contato?: Json | null
          problemas?: Json | null
          recomendacao?: string | null
          trecho_pergunta?: string | null
          updated_at?: string
        }
        Update: {
          autorizacao?: string | null
          campanha_id?: string
          confirmacao_envio?: Json | null
          created_at?: string
          formularios_adicionais?: Json | null
          id?: string
          layout_envio?: Json | null
          lembrete?: Json | null
          pontos_contato?: Json | null
          problemas?: Json | null
          recomendacao?: string | null
          trecho_pergunta?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanha_configuracao_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas: {
        Row: {
          ativa: boolean
          created_at: string
          data_criacao: string
          hospital_id: string | null
          id: string
          nome: string
          tipo_campanha: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          data_criacao?: string
          hospital_id?: string | null
          id?: string
          nome: string
          tipo_campanha: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          data_criacao?: string
          hospital_id?: string | null
          id?: string
          nome?: string
          tipo_campanha?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitais"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitais: {
        Row: {
          created_at: string
          id: string
          inicio_projeto: string | null
          localizacao: string | null
          nome: string
          sponsor: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inicio_projeto?: string | null
          localizacao?: string | null
          nome: string
          sponsor?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inicio_projeto?: string | null
          localizacao?: string | null
          nome?: string
          sponsor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          hospital_id: string | null
          id: string
          nome: string
          tipo_acesso: Database["public"]["Enums"]["tipo_acesso"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hospital_id?: string | null
          id?: string
          nome: string
          tipo_acesso: Database["public"]["Enums"]["tipo_acesso"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hospital_id?: string | null
          id?: string
          nome?: string
          tipo_acesso?: Database["public"]["Enums"]["tipo_acesso"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitais"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_hospital: {
        Args: { hospital_uuid: string }
        Returns: boolean
      }
      has_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      tipo_acesso:
        | "administrador"
        | "gestor_diretor"
        | "gestor_medico"
        | "gestor_eximio"
        | "gestor_supervisor"
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
      tipo_acesso: [
        "administrador",
        "gestor_diretor",
        "gestor_medico",
        "gestor_eximio",
        "gestor_supervisor",
      ],
    },
  },
} as const
