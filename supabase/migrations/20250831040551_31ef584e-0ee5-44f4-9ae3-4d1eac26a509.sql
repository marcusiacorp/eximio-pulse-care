-- Permitir inserção pública de pacientes para pesquisas públicas
CREATE POLICY "Permitir inserção pública de pacientes para pesquisas"
ON pacientes
FOR INSERT 
TO public
WITH CHECK (true);