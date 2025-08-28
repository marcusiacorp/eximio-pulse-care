-- Criar ENUM apenas se não existir
DO $$ BEGIN
    CREATE TYPE public.tipo_acesso AS ENUM ('administrador', 'gestor_diretor', 'gestor_medico');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela Hospitais
CREATE TABLE IF NOT EXISTS public.hospitais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela Usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
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

-- Função security definer para obter o tipo de acesso do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_tipo_acesso()
RETURNS public.tipo_acesso AS $$
    SELECT tipo_acesso FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Função security definer para obter o hospital_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_hospital_id()
RETURNS UUID AS $$
    SELECT hospital_id FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas para tabela hospitais
CREATE POLICY "Administradores podem ver todos os hospitais" 
ON public.hospitais 
FOR SELECT 
TO authenticated
USING (public.get_current_user_tipo_acesso() = 'administrador');

CREATE POLICY "Gestores podem ver seu hospital" 
ON public.hospitais 
FOR SELECT 
TO authenticated
USING (
    public.get_current_user_tipo_acesso() IN ('gestor_diretor', 'gestor_medico')
    AND id = public.get_current_user_hospital_id()
);

CREATE POLICY "Administradores podem inserir hospitais" 
ON public.hospitais 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_tipo_acesso() = 'administrador');

CREATE POLICY "Administradores podem atualizar hospitais" 
ON public.hospitais 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_tipo_acesso() = 'administrador');

-- Políticas para tabela usuarios
CREATE POLICY "Administradores podem ver todos os usuários" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (public.get_current_user_tipo_acesso() = 'administrador');

CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Gestores diretores podem ver usuários do mesmo hospital" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (
    public.get_current_user_tipo_acesso() = 'gestor_diretor'
    AND hospital_id = public.get_current_user_hospital_id()
);

CREATE POLICY "Administradores podem inserir usuários" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_tipo_acesso() = 'administrador');

CREATE POLICY "Administradores podem atualizar usuários" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_tipo_acesso() = 'administrador');

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
DROP TRIGGER IF EXISTS update_hospitais_updated_at ON public.hospitais;
CREATE TRIGGER update_hospitais_updated_at
    BEFORE UPDATE ON public.hospitais
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();