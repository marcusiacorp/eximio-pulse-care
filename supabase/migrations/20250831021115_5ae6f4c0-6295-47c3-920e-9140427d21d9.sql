-- Adicionar campo pergunta_definitiva para armazenar dados específicos da pergunta definitiva
ALTER TABLE public.campanha_configuracao 
ADD COLUMN pergunta_definitiva jsonb DEFAULT '{}'::jsonb;