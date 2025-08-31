-- Testar banner em campanha existente
UPDATE campanha_configuracao 
SET layout_envio = jsonb_set(
  COALESCE(layout_envio, '{}'), 
  '{bannerUrl}', 
  '"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400"'
)
WHERE campanha_id = 'eeae9c54-f0ab-4b23-afb6-395389a7be43';