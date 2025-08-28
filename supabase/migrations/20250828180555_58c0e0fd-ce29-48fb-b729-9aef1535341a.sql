-- Criar trigger para sincronizar usuários do auth.users com a tabela usuarios
-- Função que será executada quando um usuário for criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email, tipo_acesso)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email,
    'administrador'::tipo_acesso
  );
  RETURN new;
END;
$$;

-- Trigger que executa a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();