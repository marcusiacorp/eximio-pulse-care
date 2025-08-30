-- Corrigir função has_admin_access() removendo 'gestor_admin' e adicionando 'gestor_eximio'
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
  );
$function$;

-- Corrigir função can_view_hospital() removendo 'gestor_admin' e adicionando 'gestor_eximio'
CREATE OR REPLACE FUNCTION public.can_view_hospital(hospital_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
      OR (tipo_acesso = 'gestor_supervisor' AND hospital_id = hospital_uuid)
    )
  );
$function$;