-- Primeiro atualizar o registro existente para um email válido
UPDATE hospitais 
SET sponsor = 'marcus.azevedo@eximio.med.br' 
WHERE sponsor = 'Marcus Vinícius Medeiros Azevedo';

-- Agora adicionar a constraint para validar emails futuros
ALTER TABLE hospitais 
ADD CONSTRAINT sponsor_email_format CHECK (sponsor ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Atualizar o enum tipo_acesso para ter nomes mais claros
ALTER TYPE tipo_acesso RENAME VALUE 'gestor_admin' TO 'gestor_eximio';