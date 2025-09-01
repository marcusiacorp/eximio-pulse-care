-- Forçar a atualização das políticas RLS para usar campanhas_publicas
-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir inserção de envios para campanhas ativas" ON public.envios_pesquisa;
DROP POLICY IF EXISTS "Permitir atualização de envios para campanhas ativas" ON public.envios_pesquisa;

-- Criar políticas que usam a view pública
CREATE POLICY "Permitir inserção de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.campanhas_publicas 
  WHERE campanhas_publicas.id = envios_pesquisa.campanha_id 
  AND campanhas_publicas.ativa = true
));

CREATE POLICY "Permitir atualização de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.campanhas_publicas 
  WHERE campanhas_publicas.id = envios_pesquisa.campanha_id 
  AND campanhas_publicas.ativa = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.campanhas_publicas 
  WHERE campanhas_publicas.id = envios_pesquisa.campanha_id 
  AND campanhas_publicas.ativa = true
));