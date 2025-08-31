-- Corrigir a função get_user_type para lidar com auth.uid() NULL
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Se não há usuário autenticado, retornar NULL
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN (
    SELECT tipo_acesso::text 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$function$