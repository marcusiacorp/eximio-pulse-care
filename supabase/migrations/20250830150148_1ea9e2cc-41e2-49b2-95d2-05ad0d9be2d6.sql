-- Adicionar coluna email_diretor na tabela hospitais
ALTER TABLE public.hospitais 
ADD COLUMN email_diretor TEXT NOT NULL DEFAULT '';

-- Adicionar constraint para validar formato de email
ALTER TABLE public.hospitais 
ADD CONSTRAINT email_diretor_format CHECK (email_diretor ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');