-- Dropar as políticas INSERT conflitantes
DROP POLICY IF EXISTS "Usuários podem inserir pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir inserção pública de pacientes para pesquisas" ON public.pacientes;

-- Criar uma única política INSERT que permite tanto inserções públicas quanto autenticadas
CREATE POLICY "Permitir inserção de pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  -- Permitir inserções públicas (para pesquisas públicas)
  auth.uid() IS NULL
  OR 
  -- Permitir inserções de usuários autenticados com os tipos de acesso corretos
  (auth.uid() IS NOT NULL AND get_user_type() = ANY (ARRAY['administrador'::text, 'gestor_diretor'::text, 'gestor_eximio'::text, 'gestor_supervisor'::text]))
);