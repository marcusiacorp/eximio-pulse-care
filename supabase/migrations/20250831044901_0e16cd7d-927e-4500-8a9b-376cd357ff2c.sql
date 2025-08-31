-- Corrigir política RLS para envios_pesquisa
-- Remover a política atual de INSERT que está causando problemas
DROP POLICY IF EXISTS "Permitir inserção pública de envios" ON public.envios_pesquisa;

-- Criar nova política simples para permitir inserções públicas
CREATE POLICY "Permitir inserção pública de envios simplificada" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (true);