-- Adicionar colunas específicas na tabela respostas_pesquisa para normalizar os dados
ALTER TABLE public.respostas_pesquisa 
ADD COLUMN campanha_id uuid,
ADD COLUMN resposta_trecho_pergunta text,
ADD COLUMN resposta_o_que_agradou text,
ADD COLUMN resposta_porque_nota text,
ADD COLUMN setores_atendimento text[],
ADD COLUMN resposta_recomendacao boolean,
ADD COLUMN resposta_autorizacao boolean;

-- Adicionar índices para melhor performance
CREATE INDEX idx_respostas_pesquisa_campanha_id ON public.respostas_pesquisa(campanha_id);
CREATE INDEX idx_respostas_pesquisa_nps_score ON public.respostas_pesquisa(nps_score);

-- Adicionar colunas específicas na tabela campanha_configuracao para normalizar configuração
ALTER TABLE public.campanha_configuracao
ADD COLUMN o_que_agradou text,
ADD COLUMN setores_selecionados text[],
ADD COLUMN pergunta_recomendacao text,
ADD COLUMN resposta_autorizacao text,
ADD COLUMN banner_url text;

-- Atualizar RLS policy para permitir SELECT por campanha_id
CREATE POLICY "Permitir acesso público a respostas por campanha ativa" 
ON public.respostas_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = respostas_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);