-- Adicionar coluna email_diretor na tabela hospitais
-- Como email do diretor é diferente do sponsor, deixamos nullable inicialmente
ALTER TABLE public.hospitais 
ADD COLUMN email_diretor TEXT;

-- Adicionar constraint para validar formato de email quando não for nulo
ALTER TABLE public.hospitais 
ADD CONSTRAINT email_diretor_format CHECK (email_diretor IS NULL OR email_diretor ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');