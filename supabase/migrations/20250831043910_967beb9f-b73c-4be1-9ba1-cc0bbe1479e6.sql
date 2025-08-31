-- Adicionar campos de respondente na tabela respostas_pesquisa
ALTER TABLE public.respostas_pesquisa 
ADD COLUMN nome_respondente TEXT,
ADD COLUMN email_respondente TEXT,
ADD COLUMN telefone_respondente TEXT;

-- Tornar paciente_id nullable na tabela envios_pesquisa
ALTER TABLE public.envios_pesquisa 
ALTER COLUMN paciente_id DROP NOT NULL;

-- Atualizar RLS para permitir inserções públicas em envios_pesquisa sem paciente_id
DROP POLICY IF EXISTS "Permitir inserção pública de envios" ON public.envios_pesquisa;

CREATE POLICY "Permitir inserção pública de envios" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (
  -- Permitir inserções públicas (pesquisa pública)
  auth.uid() IS NULL 
  OR 
  -- Permitir inserções de usuários autenticados (envios administrativos)
  (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 
      FROM usuarios 
      WHERE id = auth.uid() 
      AND tipo_acesso = ANY (ARRAY['administrador'::tipo_acesso, 'gestor_diretor'::tipo_acesso, 'gestor_eximio'::tipo_acesso, 'gestor_supervisor'::tipo_acesso])
    )
  )
);