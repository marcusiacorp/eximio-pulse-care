-- Corrigir política RLS para permitir inserção de envios para campanhas ativas
-- A política atual está verificando campanhas_publicas, mas deveria verificar campanhas

DROP POLICY IF EXISTS "Permitir inserção de envios para campanhas ativas" ON envios_pesquisa;
DROP POLICY IF EXISTS "Permitir atualização de envios para campanhas ativas" ON envios_pesquisa;

-- Criar nova política de inserção que verifica a tabela campanhas
CREATE POLICY "Permitir inserção de envios para campanhas ativas" 
ON envios_pesquisa 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);

-- Criar nova política de atualização que verifica a tabela campanhas
CREATE POLICY "Permitir atualização de envios para campanhas ativas" 
ON envios_pesquisa 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM campanhas 
    WHERE campanhas.id = envios_pesquisa.campanha_id 
    AND campanhas.ativa = true
  )
);