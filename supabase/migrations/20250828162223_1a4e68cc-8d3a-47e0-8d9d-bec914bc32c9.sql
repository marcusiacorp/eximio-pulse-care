-- Criar ENUM para tipos de acesso
CREATE TYPE public.tipo_acesso AS ENUM ('administrador', 'gestor_diretor', 'gestor_medico');

-- Tabela Hospitais
CREATE TABLE public.hospitais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela Usuarios
CREATE TABLE public.usuarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    tipo_acesso public.tipo_acesso NOT NULL,
    hospital_id UUID REFERENCES public.hospitais(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.hospitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela hospitais
-- Administradores podem ver todos os hospitais
CREATE POLICY "Administradores podem ver todos os hospitais" 
ON public.hospitais 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE usuarios.id = auth.uid() 
        AND usuarios.tipo_acesso = 'administrador'
    )
);

-- Gestores podem ver apenas seu hospital
CREATE POLICY "Gestores podem ver seu hospital" 
ON public.hospitais 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE usuarios.id = auth.uid() 
        AND usuarios.hospital_id = hospitais.id
        AND usuarios.tipo_acesso IN ('gestor_diretor', 'gestor_medico')
    )
);

-- Administradores podem inserir hospitais
CREATE POLICY "Administradores podem inserir hospitais" 
ON public.hospitais 
FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE usuarios.id = auth.uid() 
        AND usuarios.tipo_acesso = 'administrador'
    )
);

-- Administradores podem atualizar hospitais
CREATE POLICY "Administradores podem atualizar hospitais" 
ON public.hospitais 
FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE usuarios.id = auth.uid() 
        AND usuarios.tipo_acesso = 'administrador'
    )
);

-- Políticas para tabela usuarios
-- Administradores podem ver todos os usuários
CREATE POLICY "Administradores podem ver todos os usuários" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u 
        WHERE u.id = auth.uid() 
        AND u.tipo_acesso = 'administrador'
    )
);

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Gestores diretores podem ver usuários do mesmo hospital
CREATE POLICY "Gestores diretores podem ver usuários do mesmo hospital" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u 
        WHERE u.id = auth.uid() 
        AND u.tipo_acesso = 'gestor_diretor'
        AND u.hospital_id = usuarios.hospital_id
    )
);

-- Administradores podem inserir usuários
CREATE POLICY "Administradores podem inserir usuários" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios u 
        WHERE u.id = auth.uid() 
        AND u.tipo_acesso = 'administrador'
    )
);

-- Administradores podem atualizar usuários
CREATE POLICY "Administradores podem atualizar usuários" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u 
        WHERE u.id = auth.uid() 
        AND u.tipo_acesso = 'administrador'
    )
);

-- Usuários podem atualizar seu próprio perfil (exceto tipo_acesso e hospital_id)
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    AND tipo_acesso = (SELECT tipo_acesso FROM public.usuarios WHERE id = auth.uid())
    AND hospital_id = (SELECT hospital_id FROM public.usuarios WHERE id = auth.uid())
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_hospitais_updated_at
    BEFORE UPDATE ON public.hospitais
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();