-- Remover todas as políticas problemáticas da tabela usuarios
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Supervisores podem ver usuários do mesmo hospital" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários sempre podem ver próprio perfil" ON public.usuarios;

-- Remover funções que causam recursão
DROP FUNCTION IF EXISTS public.has_admin_access();
DROP FUNCTION IF EXISTS public.can_view_hospital(uuid);
DROP FUNCTION IF EXISTS public.can_manage_patients();

-- Criar funções simples sem recursão
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT tipo_acesso::text 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_hospital()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT hospital_id 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Políticas simples para usuarios
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.usuarios 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Administradores podem ver todos usuários" 
ON public.usuarios 
FOR SELECT 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
);

CREATE POLICY "Supervisores podem ver usuários do mesmo hospital" 
ON public.usuarios 
FOR SELECT 
USING (
  public.get_user_type() = 'gestor_supervisor' 
  AND hospital_id = public.get_user_hospital()
);

-- Atualizar políticas das outras tabelas
DROP POLICY IF EXISTS "Gestores podem ver hospitais permitidos" ON public.hospitais;
DROP POLICY IF EXISTS "Usuários podem ver hospitais permitidos" ON public.hospitais;

CREATE POLICY "Usuários podem ver hospitais permitidos" 
ON public.hospitais 
FOR SELECT 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
  OR (
    public.get_user_type() = 'gestor_supervisor' 
    AND id = public.get_user_hospital()
  )
);

-- Atualizar políticas dos pacientes
DROP POLICY IF EXISTS "Usuários podem ver pacientes do seu hospital" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem inserir pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem atualizar pacientes do seu hospital" ON public.pacientes;

CREATE POLICY "Usuários podem ver pacientes do seu hospital" 
ON public.pacientes 
FOR SELECT 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio', 'gestor_supervisor')
);

CREATE POLICY "Usuários podem inserir pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio', 'gestor_supervisor')
);

CREATE POLICY "Usuários podem atualizar pacientes do seu hospital" 
ON public.pacientes 
FOR UPDATE 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio', 'gestor_supervisor')
);