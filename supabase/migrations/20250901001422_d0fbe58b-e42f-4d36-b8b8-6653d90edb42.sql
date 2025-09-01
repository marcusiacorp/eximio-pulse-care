-- Fix SECURITY DEFINER views - make them SECURITY INVOKER
-- Drop and recreate views with proper security context

DROP VIEW IF EXISTS public.campanhas_publicas;
DROP VIEW IF EXISTS public.campanha_configuracao_publica;

-- Create views with SECURITY INVOKER (not DEFINER) to use querying user's permissions
CREATE VIEW public.campanhas_publicas 
WITH (security_invoker = true) AS
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

-- Create configuration view with SECURITY INVOKER
CREATE VIEW public.campanha_configuracao_publica 
WITH (security_invoker = true) AS
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