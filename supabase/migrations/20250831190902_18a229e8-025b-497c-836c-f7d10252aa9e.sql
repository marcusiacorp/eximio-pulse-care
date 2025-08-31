-- Corrigir política RLS para permitir inserções públicas em envios_pesquisa
-- Remove as políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Permitir inserção pública de envios simplificada" ON public.envios_pesquisa;

-- Cria nova política mais específica para permitir inserções de envios para campanhas ativas
CREATE POLICY "Permitir inserção de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);

-- Garantir que a política de SELECT também funciona para campanhas ativas
DROP POLICY IF EXISTS "Permitir acesso público a envios por campanha ativa" ON public.envios_pesquisa;

CREATE POLICY "Permitir acesso público a envios por campanha ativa" 
ON public.envios_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);

-- Verificar se a política de UPDATE também está correta para campanhas ativas
DROP POLICY IF EXISTS "Permitir atualização pública de envios" ON public.envios_pesquisa;

CREATE POLICY "Permitir atualização de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);