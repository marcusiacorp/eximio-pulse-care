-- FASE 1: Migrar dados do banner do JSONB para a nova coluna
UPDATE campanha_configuracao 
SET banner_url = layout_envio->>'bannerUrl'
WHERE layout_envio->>'bannerUrl' IS NOT NULL AND layout_envio->>'bannerUrl' != '';

-- FASE 2: Corrigir políticas RLS para permitir inserção pública

-- Política para permitir inserção pública de envios
CREATE POLICY "Permitir inserção pública de envios" 
ON envios_pesquisa 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Política para permitir inserção pública de respostas  
CREATE POLICY "Permitir inserção pública de respostas"
ON respostas_pesquisa
FOR INSERT 
TO public
WITH CHECK (true);

-- Política para permitir atualização pública de envios (para marcar como respondido)
CREATE POLICY "Permitir atualização pública de envios"
ON envios_pesquisa
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);