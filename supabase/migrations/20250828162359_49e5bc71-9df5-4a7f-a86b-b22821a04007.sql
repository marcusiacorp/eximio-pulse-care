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