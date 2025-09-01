-- Remove the overly permissive public read policy that exposes patient data
DROP POLICY IF EXISTS "Permitir acesso público a respostas por campanha ativa" ON public.respostas_pesquisa;

-- Keep the public insert policy but make it more restrictive
DROP POLICY IF EXISTS "Permitir inserção pública de respostas" ON public.respostas_pesquisa;
DROP POLICY IF EXISTS "Permitir inserção de respostas via token público" ON public.respostas_pesquisa;

-- Create a more secure public insert policy that only allows inserting, not reading
CREATE POLICY "Permitir apenas inserção pública de respostas" 
ON public.respostas_pesquisa 
FOR INSERT 
WITH CHECK (
  -- Allow public insertion only for active campaigns
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_id 
    AND campanhas.ativa = true
  )
);

-- Ensure authenticated hospital users can still access their data
-- This policy should already exist but let's make sure it's properly configured
DROP POLICY IF EXISTS "Usuários podem ver respostas do seu hospital" ON public.respostas_pesquisa;

CREATE POLICY "Usuários podem ver respostas do seu hospital" 
ON public.respostas_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM envios_pesquisa e
    JOIN campanhas c ON c.id = e.campanha_id
    JOIN usuarios u ON u.id = auth.uid()
    WHERE e.id = respostas_pesquisa.envio_id 
    AND (
      u.tipo_acesso = ANY (ARRAY['administrador'::tipo_acesso, 'gestor_diretor'::tipo_acesso, 'gestor_eximio'::tipo_acesso])
      OR (u.tipo_acesso = 'gestor_supervisor'::tipo_acesso AND u.hospital_id = c.hospital_id)
    )
  )
);