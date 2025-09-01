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
          banner_padrao_url: string | null
          banner_url: string | null
          campanha_id: string
          confirmacao_envio: Json | null
          created_at: string
          formularios_adicionais: Json | null
          id: string
          layout_envio: Json | null
          lembrete: Json | null
          o_que_agradou: string | null
          pergunta_area_atendimento: string | null
          pergunta_definitiva: Json | null
          pergunta_nps_global: string | null
          pergunta_o_que_agradou_global: string | null
          pergunta_padrao: Json | null
          pergunta_recomendacao: string | null
          perguntas_setores: Json | null
          pontos_contato: Json | null
          problemas: Json | null
          recomendacao: string | null
          resposta_autorizacao: string | null
          setores_selecionados: string[] | null
          trecho_pergunta: string | null
          updated_at: string
        }
        Insert: {
          autorizacao?: string | null
          banner_padrao_url?: string | null
          banner_url?: string | null
          campanha_id: string
          confirmacao_envio?: Json | null
          created_at?: string
          formularios_adicionais?: Json | null
          id?: string
          layout_envio?: Json | null
          lembrete?: Json | null
          o_que_agradou?: string | null
          pergunta_area_atendimento?: string | null
          pergunta_definitiva?: Json | null
          pergunta_nps_global?: string | null
          pergunta_o_que_agradou_global?: string | null
          pergunta_padrao?: Json | null
          pergunta_recomendacao?: string | null
          perguntas_setores?: Json | null
          pontos_contato?: Json | null
          problemas?: Json | null
          recomendacao?: string | null
          resposta_autorizacao?: string | null
          setores_selecionados?: string[] | null
          trecho_pergunta?: string | null
          updated_at?: string
        }
        Update: {
          autorizacao?: string | null
          banner_padrao_url?: string | null
          banner_url?: string | null
          campanha_id?: string
          confirmacao_envio?: Json | null
          created_at?: string
          formularios_adicionais?: Json | null
          id?: string
          layout_envio?: Json | null
          lembrete?: Json | null
          o_que_agradou?: string | null
          pergunta_area_atendimento?: string | null
          pergunta_definitiva?: Json | null
          pergunta_nps_global?: string | null
          pergunta_o_que_agradou_global?: string | null
          pergunta_padrao?: Json | null
          pergunta_recomendacao?: string | null
          perguntas_setores?: Json | null
          pontos_contato?: Json | null
          problemas?: Json | null
          recomendacao?: string | null
          resposta_autorizacao?: string | null
          setores_selecionados?: string[] | null
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
          {
            foreignKeyName: "campanha_configuracao_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas_publicas"
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
          link_campanha: string | null
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
          link_campanha?: string | null
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
          link_campanha?: string | null
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
      dados_anonimos: {
        Row: {
          campanha_id: string
          created_at: string
          email_respondente: string | null
          id: string
          nome_respondente: string | null
          telefone_respondente: string | null
          updated_at: string
        }
        Insert: {
          campanha_id: string
          created_at?: string
          email_respondente?: string | null
          id?: string
          nome_respondente?: string | null
          telefone_respondente?: string | null
          updated_at?: string
        }
        Update: {
          campanha_id?: string
          created_at?: string
          email_respondente?: string | null
          id?: string
          nome_respondente?: string | null
          telefone_respondente?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      envios_pesquisa: {
        Row: {
          campanha_id: string
          created_at: string
          enviado_em: string
          id: string
          paciente_id: string | null
          respondido_em: string | null
          status: string
          token_resposta: string
          updated_at: string
        }
        Insert: {
          campanha_id: string
          created_at?: string
          enviado_em?: string
          id?: string
          paciente_id?: string | null
          respondido_em?: string | null
          status?: string
          token_resposta?: string
          updated_at?: string
        }
        Update: {
          campanha_id?: string
          created_at?: string
          enviado_em?: string
          id?: string
          paciente_id?: string | null
          respondido_em?: string | null
          status?: string
          token_resposta?: string
          updated_at?: string
        }
        Relationships: []
      }
      hospitais: {
        Row: {
          created_at: string
          email_diretor: string | null
          id: string
          inicio_projeto: string | null
          localizacao: string | null
          nome: string
          sponsor: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_diretor?: string | null
          id?: string
          inicio_projeto?: string | null
          localizacao?: string | null
          nome: string
          sponsor?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_diretor?: string | null
          id?: string
          inicio_projeto?: string | null
          localizacao?: string | null
          nome?: string
          sponsor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          created_at: string
          email: string
          hospital_id: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hospital_id?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hospital_id?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      respostas_pesquisa: {
        Row: {
          avaliacao_ambulatorio_nota: number | null
          avaliacao_ambulatorio_o_que_mais_contribuiu: string | null
          avaliacao_ambulatorio_o_que_mais_influenciou: string | null
          avaliacao_ambulatorio_sugestoes: string | null
          avaliacao_prontosocorro_nota: number | null
          avaliacao_prontosocorro_o_que_mais_contribuiu: string | null
          avaliacao_prontosocorro_o_que_mais_influenciou: string | null
          avaliacao_prontosocorro_sugestoes: string | null
          avaliacao_unidadeinternacao_nota: number | null
          avaliacao_unidadeinternacao_o_que_mais_contribuiu: string | null
          avaliacao_unidadeinternacao_o_que_mais_influenciou: string | null
          avaliacao_unidadeinternacao_sugestoes: string | null
          campanha_id: string | null
          created_at: string
          envio_id: string
          formularios_adicionais: Json | null
          id: string
          nps_score: number | null
          pergunta_definitiva: Json | null
          pergunta_padrao_avaliacao_geral: number | null
          pergunta_padrao_identificacao_da_area: string | null
          pergunta_padrao_o_que_mais_te_agradou: string | null
          pontos_contato: Json | null
          problemas: Json | null
          resposta_autorizacao: boolean | null
          resposta_o_que_agradou: string | null
          resposta_porque_nota: string | null
          resposta_recomendacao: boolean | null
          resposta_trecho_pergunta: string | null
          setores_atendimento: string[] | null
          updated_at: string
        }
        Insert: {
          avaliacao_ambulatorio_nota?: number | null
          avaliacao_ambulatorio_o_que_mais_contribuiu?: string | null
          avaliacao_ambulatorio_o_que_mais_influenciou?: string | null
          avaliacao_ambulatorio_sugestoes?: string | null
          avaliacao_prontosocorro_nota?: number | null
          avaliacao_prontosocorro_o_que_mais_contribuiu?: string | null
          avaliacao_prontosocorro_o_que_mais_influenciou?: string | null
          avaliacao_prontosocorro_sugestoes?: string | null
          avaliacao_unidadeinternacao_nota?: number | null
          avaliacao_unidadeinternacao_o_que_mais_contribuiu?: string | null
          avaliacao_unidadeinternacao_o_que_mais_influenciou?: string | null
          avaliacao_unidadeinternacao_sugestoes?: string | null
          campanha_id?: string | null
          created_at?: string
          envio_id: string
          formularios_adicionais?: Json | null
          id?: string
          nps_score?: number | null
          pergunta_definitiva?: Json | null
          pergunta_padrao_avaliacao_geral?: number | null
          pergunta_padrao_identificacao_da_area?: string | null
          pergunta_padrao_o_que_mais_te_agradou?: string | null
          pontos_contato?: Json | null
          problemas?: Json | null
          resposta_autorizacao?: boolean | null
          resposta_o_que_agradou?: string | null
          resposta_porque_nota?: string | null
          resposta_recomendacao?: boolean | null
          resposta_trecho_pergunta?: string | null
          setores_atendimento?: string[] | null
          updated_at?: string
        }
        Update: {
          avaliacao_ambulatorio_nota?: number | null
          avaliacao_ambulatorio_o_que_mais_contribuiu?: string | null
          avaliacao_ambulatorio_o_que_mais_influenciou?: string | null
          avaliacao_ambulatorio_sugestoes?: string | null
          avaliacao_prontosocorro_nota?: number | null
          avaliacao_prontosocorro_o_que_mais_contribuiu?: string | null
          avaliacao_prontosocorro_o_que_mais_influenciou?: string | null
          avaliacao_prontosocorro_sugestoes?: string | null
          avaliacao_unidadeinternacao_nota?: number | null
          avaliacao_unidadeinternacao_o_que_mais_contribuiu?: string | null
          avaliacao_unidadeinternacao_o_que_mais_influenciou?: string | null
          avaliacao_unidadeinternacao_sugestoes?: string | null
          campanha_id?: string | null
          created_at?: string
          envio_id?: string
          formularios_adicionais?: Json | null
          id?: string
          nps_score?: number | null
          pergunta_definitiva?: Json | null
          pergunta_padrao_avaliacao_geral?: number | null
          pergunta_padrao_identificacao_da_area?: string | null
          pergunta_padrao_o_que_mais_te_agradou?: string | null
          pontos_contato?: Json | null
          problemas?: Json | null
          resposta_autorizacao?: boolean | null
          resposta_o_que_agradou?: string | null
          resposta_porque_nota?: string | null
          resposta_recomendacao?: boolean | null
          resposta_trecho_pergunta?: string | null
          setores_atendimento?: string[] | null
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
      campanha_configuracao_publica: {
        Row: {
          banner_padrao_url: string | null
          banner_url: string | null
          campanha_id: string | null
          confirmacao_envio: Json | null
          formularios_adicionais: Json | null
          id: string | null
          layout_envio: Json | null
          pergunta_area_atendimento: string | null
          pergunta_definitiva: Json | null
          pergunta_nps_global: string | null
          pergunta_o_que_agradou_global: string | null
          pergunta_padrao: Json | null
          pergunta_recomendacao: string | null
          perguntas_setores: Json | null
          pontos_contato: Json | null
          problemas: Json | null
          setores_selecionados: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "campanha_configuracao_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanha_configuracao_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas_publicas"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas_publicas: {
        Row: {
          ativa: boolean | null
          id: string | null
          nome: string | null
          tipo_campanha: string | null
        }
        Insert: {
          ativa?: boolean | null
          id?: string | null
          nome?: string | null
          tipo_campanha?: string | null
        }
        Update: {
          ativa?: boolean | null
          id?: string | null
          nome?: string | null
          tipo_campanha?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_campanha_metrics: {
        Args: { campanha_uuid: string }
        Returns: {
          aguardando_resposta: number
          campanha_id: string
          campanha_nome: string
          taxa_resposta: number
          tipo_campanha: string
          total_envios: number
          total_respondidas: number
        }[]
      }
      get_campanhas_by_type_metrics: {
        Args: { hospital_uuid?: string }
        Returns: {
          taxa_resposta_media: number
          tipo_campanha: string
          total_campanhas: number
          total_envios: number
          total_respondidas: number
        }[]
      }
      get_hospital_campanhas_metrics: {
        Args: { hospital_uuid?: string }
        Returns: {
          aguardando_resposta: number
          ativa: boolean
          campanha_id: string
          campanha_nome: string
          data_criacao: string
          nps_medio: number
          taxa_resposta: number
          tipo_campanha: string
          total_envios: number
          total_respondidas: number
        }[]
      }
      get_user_hospital: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_type: {
        Args: Record<PropertyKey, never>
        Returns: string
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
