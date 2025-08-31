-- Allow public access to active campaigns
CREATE POLICY "Permitir acesso público a campanhas ativas" 
ON public.campanhas 
FOR SELECT 
USING (ativa = true);

-- Allow public access to configurations of active campaigns
CREATE POLICY "Permitir acesso público a configurações de campanhas ativas" 
ON public.campanha_configuracao 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM campanhas 
  WHERE campanhas.id = campanha_configuracao.campanha_id 
  AND campanhas.ativa = true
));