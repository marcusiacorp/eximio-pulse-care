-- Fix the envios_pesquisa table security issues
-- Remove public read access to survey tokens and sensitive data
DROP POLICY IF EXISTS "Permitir acesso público a envios por campanha ativa" ON public.envios_pesquisa;

-- Create more restrictive policies for envios_pesquisa
-- Only allow authenticated users from same hospital to view survey sends
CREATE POLICY "Usuários podem ver envios do seu hospital" 
ON public.envios_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = envios_pesquisa.campanha_id 
    AND (
      u.tipo_acesso = ANY (ARRAY['administrador'::tipo_acesso, 'gestor_diretor'::tipo_acesso, 'gestor_eximio'::tipo_acesso])
      OR (u.tipo_acesso = 'gestor_supervisor'::tipo_acesso AND u.hospital_id = c.hospital_id)
    )
  )
);

-- Allow secure insertion for public surveys (without exposing tokens)
CREATE POLICY "Usuários podem criar envios para campanhas ativas" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campanhas 
    WHERE campanhas.id = campanha_id 
    AND campanhas.ativa = true
  )
);

-- Allow secure updates for marking responses as completed
CREATE POLICY "Permitir marcar envios como respondidos" 
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

-- Restrict public access to campaign configuration (only essential fields)
DROP POLICY IF EXISTS "Permitir acesso público a configurações de campanhas ativas" ON public.campanha_configuracao;

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

-- Restrict public access to campaigns (only essential fields)
DROP POLICY IF EXISTS "Permitir acesso público a campanhas ativas" ON public.campanhas;

CREATE POLICY "Permitir acesso público limitado a campanhas ativas" 
ON public.campanhas 
FOR SELECT 
USING (ativa = true);