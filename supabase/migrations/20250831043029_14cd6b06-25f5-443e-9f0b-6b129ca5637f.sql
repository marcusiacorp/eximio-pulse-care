-- Dropar a política atual e criar uma nova mais robusta
DROP POLICY IF EXISTS "Permitir inserção de pacientes" ON public.pacientes;

-- Criar uma política mais explícita que evita chamar funções desnecessariamente
CREATE POLICY "Permitir inserção de pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  -- Permitir inserções públicas (quando não há usuário autenticado)
  auth.uid() IS NULL 
  OR 
  -- Permitir inserções de usuários autenticados com os tipos corretos
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