-- Remover todas as políticas que dependem das funções antigas
DROP POLICY IF EXISTS "Gestores podem inserir hospitais" ON public.hospitais;
DROP POLICY IF EXISTS "Gestores podem atualizar hospitais" ON public.hospitais;
DROP POLICY IF EXISTS "Administradores podem inserir usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Administradores podem atualizar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Supervisores podem ver usuários do mesmo hospital" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários sempre podem ver próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Gestores podem ver hospitais permitidos" ON public.hospitais;
DROP POLICY IF EXISTS "Usuários podem ver hospitais permitidos" ON public.hospitais;
DROP POLICY IF EXISTS "Usuários podem ver pacientes do seu hospital" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem inserir pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Usuários podem atualizar pacientes do seu hospital" ON public.pacientes;

-- Agora remover as funções
DROP FUNCTION IF EXISTS public.has_admin_access();
DROP FUNCTION IF EXISTS public.can_view_hospital(uuid);
DROP FUNCTION IF EXISTS public.can_manage_patients();

-- Criar novas funções simples
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

-- Recriar todas as políticas com as novas funções
-- Políticas para usuarios
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

CREATE POLICY "Administradores podem inserir usuários" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
);

CREATE POLICY "Administradores podem atualizar usuários" 
ON public.usuarios 
FOR UPDATE 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
);

-- Políticas para hospitais
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

CREATE POLICY "Gestores podem inserir hospitais" 
ON public.hospitais 
FOR INSERT 
WITH CHECK (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
);

CREATE POLICY "Gestores podem atualizar hospitais" 
ON public.hospitais 
FOR UPDATE 
USING (
  public.get_user_type() IN ('administrador', 'gestor_diretor', 'gestor_eximio')
);

-- Políticas para pacientes
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