-- Fix the envios_pesquisa table security issues
-- First drop the overly permissive public read policy
DROP POLICY IF EXISTS "Permitir acesso público a envios por campanha ativa" ON public.envios_pesquisa;

-- Update existing policies for envios_pesquisa to be more secure
-- The "Usuários podem ver envios do seu hospital" policy already exists, so we don't need to recreate it

-- Ensure we have secure insertion policy (update existing if needed)
DROP POLICY IF EXISTS "Permitir inserção de envios para campanhas ativas" ON public.envios_pesquisa;

CREATE POLICY "Permitir inserção de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_id 
    AND campanhas.ativa = true
  )
);

-- Ensure we have secure update policy for marking responses as completed
DROP POLICY IF EXISTS "Permitir atualização de envios para campanhas ativas" ON public.envios_pesquisa;

CREATE POLICY "Permitir atualização de envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_id 
    AND campanhas.ativa = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_id 
    AND campanhas.ativa = true
  )
);