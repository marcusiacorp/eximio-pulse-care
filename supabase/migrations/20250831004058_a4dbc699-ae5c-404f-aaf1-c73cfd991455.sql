-- Criar função para verificar se usuário pode gerenciar pacientes
CREATE OR REPLACE FUNCTION public.can_manage_patients()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio', 'gestor_supervisor')
  );
$function$;

-- Remover políticas problemáticas da tabela pacientes
DROP POLICY IF EXISTS "Usuários podem inserir pacientes no seu hospital" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem ver pacientes do seu hospital" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem atualizar pacientes do seu hospital" ON public.pacientes;

-- Recriar políticas usando a função
CREATE POLICY "Usuários podem inserir pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (can_manage_patients());

CREATE POLICY "Usuários podem ver pacientes do seu hospital" 
ON public.pacientes 
FOR SELECT 
USING (can_manage_patients());

CREATE POLICY "Usuários podem atualizar pacientes do seu hospital" 
ON public.pacientes 
FOR UPDATE 
USING (can_manage_patients());