-- Atualizar o enum tipo_acesso para ter nomes mais claros
ALTER TYPE tipo_acesso RENAME VALUE 'gestor_admin' TO 'gestor_eximio';

-- Modificar o campo sponsor para ser email ao invés de nome
ALTER TABLE hospitais 
ALTER COLUMN sponsor TYPE text,
ADD CONSTRAINT sponsor_email_format CHECK (sponsor ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Atualizar o registro existente para usar email
UPDATE hospitais 
SET sponsor = 'marcus.azevedo@eximio.med.br' 
WHERE nome = 'Hospital Teste';