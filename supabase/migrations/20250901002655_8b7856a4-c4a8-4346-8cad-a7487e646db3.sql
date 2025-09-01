-- Criar tabela para dados anônimos de pesquisas públicas
CREATE TABLE public.dados_anonimos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id uuid NOT NULL,
  nome_respondente text,
  email_respondente text,
  telefone_respondente text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.dados_anonimos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública em campanhas ativas
CREATE POLICY "Permitir inserção pública de dados anônimos" 
ON public.dados_anonimos 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.campanhas 
  WHERE campanhas.id = dados_anonimos.campanha_id 
  AND campanhas.ativa = true
));

-- Política para usuários autenticados visualizarem dados do seu hospital
CREATE POLICY "Usuários podem ver dados anônimos do seu hospital" 
ON public.dados_anonimos 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM public.campanhas c
  JOIN public.usuarios u ON u.id = auth.uid()
  WHERE c.id = dados_anonimos.campanha_id 
  AND (
    u.tipo_acesso = ANY(ARRAY['administrador'::tipo_acesso, 'gestor_diretor'::tipo_acesso, 'gestor_eximio'::tipo_acesso])
    OR (u.tipo_acesso = 'gestor_supervisor'::tipo_acesso AND u.hospital_id = c.hospital_id)
  )
));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_dados_anonimos_updated_at
  BEFORE UPDATE ON public.dados_anonimos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Remover colunas de dados pessoais da tabela respostas_pesquisa
ALTER TABLE public.respostas_pesquisa 
DROP COLUMN IF EXISTS nome_respondente,
DROP COLUMN IF EXISTS email_respondente,
DROP COLUMN IF EXISTS telefone_respondente;