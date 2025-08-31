-- Remover os campos antigos que não estão sendo usados corretamente
ALTER TABLE public.respostas_pesquisa 
DROP COLUMN IF EXISTS area_selecionada,
DROP COLUMN IF EXISTS nps_score_global,
DROP COLUMN IF EXISTS resposta_o_que_agradou_global,
DROP COLUMN IF EXISTS respostas_setores;

-- Adicionar os novos campos com nomes específicos para perguntas padrão
ALTER TABLE public.respostas_pesquisa 
ADD COLUMN pergunta_padrao_avaliacao_geral integer,
ADD COLUMN pergunta_padrao_o_que_mais_te_agradou text,
ADD COLUMN pergunta_padrao_identificacao_da_area text,
-- Campos para Ambulatório
ADD COLUMN avaliacao_ambulatorio_nota integer,
ADD COLUMN avaliacao_ambulatorio_o_que_mais_contribuiu text,
ADD COLUMN avaliacao_ambulatorio_o_que_mais_influenciou text,
ADD COLUMN avaliacao_ambulatorio_sugestoes text,
-- Campos para Pronto Socorro
ADD COLUMN avaliacao_prontosocorro_nota integer,
ADD COLUMN avaliacao_prontosocorro_o_que_mais_contribuiu text,
ADD COLUMN avaliacao_prontosocorro_o_que_mais_influenciou text,
ADD COLUMN avaliacao_prontosocorro_sugestoes text,
-- Campos para Unidade de Internação
ADD COLUMN avaliacao_unidadeinternacao_nota integer,
ADD COLUMN avaliacao_unidadeinternacao_o_que_mais_contribuiu text,
ADD COLUMN avaliacao_unidadeinternacao_o_que_mais_influenciou text,
ADD COLUMN avaliacao_unidadeinternacao_sugestoes text;