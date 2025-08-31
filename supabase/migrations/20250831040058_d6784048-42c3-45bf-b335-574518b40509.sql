-- Remover política conflitante que impede inserção pública
DROP POLICY IF EXISTS "Usuários podem inserir envios para campanhas do seu hospital" ON envios_pesquisa;

-- Garantir que temos as políticas corretas para acesso público
DROP POLICY IF EXISTS "Permitir inserção pública de envios" ON envios_pesquisa;
DROP POLICY IF EXISTS "Permitir atualização pública de envios" ON envios_pesquisa;
DROP POLICY IF EXISTS "Permitir inserção pública de respostas" ON respostas_pesquisa;

-- Recriar políticas para permitir acesso público total
CREATE POLICY "Permitir inserção pública de envios" 
ON envios_pesquisa 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de envios"
ON envios_pesquisa
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir inserção pública de respostas"
ON respostas_pesquisa
FOR INSERT 
TO public
WITH CHECK (true);