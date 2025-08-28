-- Segunda parte: Remover políticas antigas e criar novas com os tipos atualizados

-- Remover políticas RLS antigas das tabelas
DROP POLICY IF EXISTS "Administradores podem atualizar hospitais" ON public.hospitais;
DROP POLICY IF EXISTS "Administradores podem inserir hospitais" ON public.hospitais;
DROP POLICY IF EXISTS "Administradores podem ver todos os hospitais" ON public.hospitais;
DROP POLICY IF EXISTS "Gestores podem ver seu hospital" ON public.hospitais;

DROP POLICY IF EXISTS "Administradores podem atualizar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Administradores podem inserir usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Gestores diretores podem ver usuários do mesmo hospital" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.usuarios;

-- Criar função para verificar se usuário tem acesso administrativo
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
  );
$$;

-- Criar função para verificar se usuário pode ver hospital específico
CREATE OR REPLACE FUNCTION public.can_view_hospital(hospital_uuid uuid)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
      OR (tipo_acesso = 'gestor_supervisor' AND hospital_id = hospital_uuid)
    )
  );
$$;

-- Novas políticas RLS para hospitais
CREATE POLICY "Gestores podem inserir hospitais" 
ON public.hospitais 
FOR INSERT 
WITH CHECK (public.has_admin_access());

CREATE POLICY "Gestores podem atualizar hospitais" 
ON public.hospitais 
FOR UPDATE 
USING (public.has_admin_access());

CREATE POLICY "Usuários podem ver hospitais permitidos" 
ON public.hospitais 
FOR SELECT 
USING (public.can_view_hospital(id));

-- Novas políticas RLS para usuarios
CREATE POLICY "Administradores podem inserir usuários" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (public.has_admin_access());

CREATE POLICY "Administradores podem atualizar usuários" 
ON public.usuarios 
FOR UPDATE 
USING (public.has_admin_access());

CREATE POLICY "Administradores podem ver todos os usuários" 
ON public.usuarios 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM usuarios u 
    WHERE u.id = auth.uid() 
    AND u.tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
  )
);

CREATE POLICY "Supervisores podem ver usuários do mesmo hospital" 
ON public.usuarios 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM usuarios u 
    WHERE u.id = auth.uid() 
    AND u.tipo_acesso = 'gestor_supervisor' 
    AND u.hospital_id = usuarios.hospital_id
  )
);

CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.usuarios 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.usuarios 
FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() 
  AND tipo_acesso = (SELECT tipo_acesso FROM usuarios WHERE id = auth.uid())
  AND hospital_id = (SELECT hospital_id FROM usuarios WHERE id = auth.uid())
);