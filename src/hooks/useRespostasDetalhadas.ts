import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface RespostaDetalhada {
  id: string
  nome_respondente?: string
  email_respondente?: string
  telefone_respondente?: string
  nps_score?: number
  resposta_trecho_pergunta?: string
  resposta_o_que_agradou?: string
  resposta_porque_nota?: string
  setores_atendimento?: string[]
  resposta_recomendacao?: boolean
  resposta_autorizacao?: boolean
  pontos_contato?: any
  problemas?: any
  formularios_adicionais?: any
  // Novos campos da pergunta padrão
  area_selecionada?: string
  nps_score_global?: number
  resposta_o_que_agradou_global?: string
  respostas_setores?: any
  created_at: string
}

export interface ConfiguracaoCampanha {
  trecho_pergunta?: string
  o_que_agradou?: string
  pergunta_recomendacao?: string
  resposta_autorizacao?: string
  setores_selecionados?: string[]
  pontos_contato?: any
  problemas?: any
  formularios_adicionais?: any
  // Novos campos para perguntas padrão
  pergunta_nps_global?: string
  pergunta_o_que_agradou_global?: string
  pergunta_area_atendimento?: string
  perguntas_setores?: any
}

export const useRespostasDetalhadas = (campanhaId: string | null) => {
  return useQuery({
    queryKey: ['respostas-detalhadas', campanhaId],
    queryFn: async () => {
      if (!campanhaId) return null

      // Buscar respostas da campanha
      const { data: respostas, error: respostasError } = await supabase
        .from('respostas_pesquisa')
        .select('*')
        .eq('campanha_id', campanhaId)
        .order('created_at', { ascending: false })

      if (respostasError) {
        console.error('Erro ao buscar respostas:', respostasError)
        throw respostasError
      }

      // Buscar configuração da campanha para determinar colunas
      const { data: configuracao, error: configError } = await supabase
        .from('campanha_configuracao')
        .select('*')
        .eq('campanha_id', campanhaId)
        .maybeSingle()

      if (configError) {
        console.error('Erro ao buscar configuração:', configError)
        throw configError
      }

      // Buscar dados básicos da campanha
      const { data: campanha, error: campanhaError } = await supabase
        .from('campanhas')
        .select('nome, tipo_campanha')
        .eq('id', campanhaId)
        .single()

      if (campanhaError) {
        console.error('Erro ao buscar campanha:', campanhaError)
        throw campanhaError
      }

      return {
        respostas: respostas as RespostaDetalhada[],
        configuracao: configuracao as ConfiguracaoCampanha,
        campanha: campanha
      }
    },
    enabled: !!campanhaId,
  })
}