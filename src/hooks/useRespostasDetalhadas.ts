import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface RespostaDetalhada {
  id: string
  nps_score?: number
  // Dados pessoais vêm de uma tabela separada
  dados_anonimos?: {
    nome_respondente?: string
    email_respondente?: string
    telefone_respondente?: string
  }
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
  pergunta_padrao_avaliacao_geral?: number
  pergunta_padrao_o_que_mais_te_agradou?: string
  pergunta_padrao_identificacao_da_area?: string
  // Campos por setor - Ambulatório
  avaliacao_ambulatorio_nota?: number
  avaliacao_ambulatorio_o_que_mais_contribuiu?: string
  avaliacao_ambulatorio_o_que_mais_influenciou?: string
  avaliacao_ambulatorio_sugestoes?: string
  // Campos por setor - Pronto Socorro
  avaliacao_prontosocorro_nota?: number
  avaliacao_prontosocorro_o_que_mais_contribuiu?: string
  avaliacao_prontosocorro_o_que_mais_influenciou?: string
  avaliacao_prontosocorro_sugestoes?: string
  // Campos por setor - Unidade de Internação
  avaliacao_unidadeinternacao_nota?: number
  avaliacao_unidadeinternacao_o_que_mais_contribuiu?: string
  avaliacao_unidadeinternacao_o_que_mais_influenciou?: string
  avaliacao_unidadeinternacao_sugestoes?: string
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

      // Buscar dados pessoais anônimos da campanha
      const { data: dadosAnonimos, error: dadosError } = await supabase
        .from('dados_anonimos')
        .select('*')
        .eq('campanha_id', campanhaId)
        .order('created_at', { ascending: false })

      if (dadosError) {
        console.error('Erro ao buscar dados anônimos:', dadosError)
        throw dadosError
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

      // Combinar respostas com dados pessoais (quando existirem)
      // Para pesquisas públicas, pode não haver dados pessoais, então fazemos um merge baseado na ordem temporal
      const respostasComDados = respostas.map((resposta, index) => ({
        ...resposta,
        dados_anonimos: dadosAnonimos[index] || null
      }))

      return {
        respostas: respostasComDados as RespostaDetalhada[],
        configuracao: configuracao as ConfiguracaoCampanha,
        campanha: campanha
      }
    },
    enabled: !!campanhaId,
  })
}