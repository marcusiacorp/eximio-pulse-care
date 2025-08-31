-- Remover políticas que causam recursão infinita
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Supervisores podem ver usuários do mesmo hospital" ON public.usuarios;

-- Recriar política para administradores sem recursão
CREATE POLICY "Administradores podem ver todos os usuários" 
ON public.usuarios 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
  )
);

-- Recriar política para supervisores sem recursão
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

-- Política adicional para garantir que usuários sempre possam ver seu próprio perfil
CREATE POLICY "Usuários sempre podem ver próprio perfil" 
ON public.usuarios 
FOR SELECT 
USING (id = auth.uid());