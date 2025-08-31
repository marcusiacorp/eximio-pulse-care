-- Corrigir search_path das funções para segurança
CREATE OR REPLACE FUNCTION public.get_user_type()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT tipo_acesso::text 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_hospital()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT hospital_id 
    FROM usuarios 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;