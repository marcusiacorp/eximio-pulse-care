-- Primeiro, vamos corrigir a função get_user_type para lidar com auth.uid() NULL
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Se não há usuário autenticado, retornar NULL
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN (
    SELECT tipo_acesso::text 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$function$

-- Agora vamos dropar a política atual e criar uma nova mais robusta
DROP POLICY IF EXISTS "Permitir inserção de pacientes" ON public.pacientes;

-- Criar uma política mais explícita que evita chamar funções desnecessariamente
CREATE POLICY "Permitir inserção de pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  -- Permitir inserções públicas (quando não há usuário autenticado)
  auth.uid() IS NULL
  OR 
  -- Permitir inserções de usuários autenticados (verificar depois se o usuário tem permissão)
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