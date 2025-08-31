import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface CampanhaMetrics {
  campanha_id: string
  campanha_nome: string
  tipo_campanha: string
  data_criacao: string
  ativa: boolean
  total_envios: number
  total_respondidas: number
  aguardando_resposta: number
  taxa_resposta: number
  nps_medio: number
}

export interface CampanhaByTypeMetrics {
  tipo_campanha: string
  total_campanhas: number
  total_envios: number
  total_respondidas: number
  taxa_resposta_media: number
}

export const useCampanhaMetrics = (hospitalId?: string) => {
  return useQuery({
    queryKey: ["campanha-metrics", hospitalId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_hospital_campanhas_metrics", {
        hospital_uuid: hospitalId || null
      })
      
      if (error) {
        console.error("Erro ao buscar métricas das campanhas:", error)
        throw error
      }
      
      return data as CampanhaMetrics[]
    },
    enabled: true
  })
}

export const useCampanhasByTypeMetrics = (hospitalId?: string) => {
  return useQuery({
    queryKey: ["campanhas-by-type-metrics", hospitalId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_campanhas_by_type_metrics", {
        hospital_uuid: hospitalId || null
      })
      
      if (error) {
        console.error("Erro ao buscar métricas por tipo:", error)
        throw error
      }
      
      return data as CampanhaByTypeMetrics[]
    },
    enabled: true
  })
}

export const useSingleCampanhaMetrics = (campanhaId: string) => {
  return useQuery({
    queryKey: ["single-campanha-metrics", campanhaId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_campanha_metrics", {
        campanha_uuid: campanhaId
      })
      
      if (error) {
        console.error("Erro ao buscar métricas da campanha:", error)
        throw error
      }
      
      return data?.[0] as CampanhaMetrics | undefined
    },
    enabled: !!campanhaId
  })
}