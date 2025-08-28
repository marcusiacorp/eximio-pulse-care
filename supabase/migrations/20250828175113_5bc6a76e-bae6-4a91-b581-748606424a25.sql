-- Adicionar novos campos à tabela hospitais para o cadastro completo
ALTER TABLE public.hospitais 
ADD COLUMN localizacao TEXT,
ADD COLUMN inicio_projeto DATE,
ADD COLUMN sponsor TEXT;