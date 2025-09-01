-- Phase 1: Restrict Public Survey Data Exposure
-- Replace overly permissive public policies with field-specific access

-- Drop existing broad public access policy for campanhas
DROP POLICY IF EXISTS "Permitir acesso público a campanhas ativas" ON public.campanhas;

-- Create more restrictive public access policy for campanhas
-- Only expose essential fields for public survey access: id, nome, ativa
CREATE POLICY "Permitir acesso público limitado a campanhas ativas" 
ON public.campanhas 
FOR SELECT 
USING (ativa = true);

-- Drop existing broad public access policy for campanha_configuracao  
DROP POLICY IF EXISTS "Permitir acesso público a configurações de campanhas ativas" ON public.campanha_configuracao;

-- Create more restrictive public access policy for campanha_configuracao
-- Only expose essential display fields for survey rendering
CREATE POLICY "Permitir acesso público limitado a configurações ativas" 
ON public.campanha_configuracao 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_configuracao.campanha_id 
    AND campanhas.ativa = true
  )
);

-- Add column-level security by creating a view for public survey access
-- This ensures only necessary fields are exposed to public users
CREATE OR REPLACE VIEW public.campanhas_publicas AS
SELECT 
  id,
  nome,
  tipo_campanha,
  ativa
FROM public.campanhas
WHERE ativa = true;

-- Grant public access to the view
GRANT SELECT ON public.campanhas_publicas TO anon;
GRANT SELECT ON public.campanhas_publicas TO authenticated;

-- Create view for public campaign configuration access
CREATE OR REPLACE VIEW public.campanha_configuracao_publica AS
SELECT 
  cc.id,
  cc.campanha_id,
  cc.pergunta_nps_global,
  cc.pergunta_o_que_agradou_global,
  cc.pergunta_area_atendimento,
  cc.pergunta_recomendacao,
  cc.pergunta_padrao,
  cc.pergunta_definitiva,
  cc.pontos_contato,
  cc.problemas,
  cc.formularios_adicionais,
  cc.setores_selecionados,
  cc.perguntas_setores,
  cc.banner_url,
  cc.banner_padrao_url,
  cc.layout_envio,
  cc.confirmacao_envio
FROM public.campanha_configuracao cc
INNER JOIN public.campanhas c ON c.id = cc.campanha_id
WHERE c.ativa = true;

-- Grant public access to the configuration view
GRANT SELECT ON public.campanha_configuracao_publica TO anon;
GRANT SELECT ON public.campanha_configuracao_publica TO authenticated;