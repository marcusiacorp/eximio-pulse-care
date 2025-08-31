-- Criar políticas corretas para o bucket banners

-- Verificar se o bucket existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de banners por usuários autenticados
CREATE POLICY "Usuários podem fazer upload de banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

-- Política para acesso público a banners
CREATE POLICY "Banners são publicamente acessíveis"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Política para permitir que usuários atualizem seus próprios banners
CREATE POLICY "Usuários podem atualizar banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'banners');

-- Política para permitir que usuários deletem banners
CREATE POLICY "Usuários podem deletar banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'banners');