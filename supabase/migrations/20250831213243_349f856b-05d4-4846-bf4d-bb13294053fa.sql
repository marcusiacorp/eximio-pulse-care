-- Adicionar campo banner_padrao_url na tabela campanha_configuracao
ALTER TABLE campanha_configuracao 
ADD COLUMN banner_padrao_url text;

-- Adicionar campo pergunta_padrao na tabela campanha_configuracao para armazenar dados da nova seção
ALTER TABLE campanha_configuracao 
ADD COLUMN pergunta_padrao jsonb DEFAULT '{}'::jsonb;