-- 1. Adicionar coluna link_campanha na tabela campanhas
ALTER TABLE public.campanhas 
ADD COLUMN link_campanha TEXT;

-- 2. Alterar o padrão da coluna ativa para true
ALTER TABLE public.campanhas 
ALTER COLUMN ativa SET DEFAULT true;

-- 3. Atualizar campanhas existentes para ativas
UPDATE public.campanhas 
SET ativa = true 
WHERE ativa = false;