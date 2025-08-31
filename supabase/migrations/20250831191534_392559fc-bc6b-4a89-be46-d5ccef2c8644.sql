-- Criar funções para calcular métricas de campanhas

-- Função para obter métricas gerais de uma campanha específica
CREATE OR REPLACE FUNCTION get_campanha_metrics(campanha_uuid UUID)
RETURNS TABLE (
  campanha_id UUID,
  campanha_nome TEXT,
  tipo_campanha TEXT,
  total_envios BIGINT,
  total_respondidas BIGINT,
  aguardando_resposta BIGINT,
  taxa_resposta NUMERIC(5,2)
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id as campanha_id,
    c.nome as campanha_nome,
    c.tipo_campanha,
    COALESCE(COUNT(e.id), 0) as total_envios,
    COALESCE(COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END), 0) as total_respondidas,
    COALESCE(COUNT(CASE WHEN e.respondido_em IS NULL THEN 1 END), 0) as aguardando_resposta,
    CASE 
      WHEN COUNT(e.id) > 0 THEN 
        ROUND((COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END)::NUMERIC / COUNT(e.id)::NUMERIC) * 100, 2)
      ELSE 0
    END as taxa_resposta
  FROM campanhas c
  LEFT JOIN envios_pesquisa e ON c.id = e.campanha_id
  WHERE c.id = campanha_uuid
  GROUP BY c.id, c.nome, c.tipo_campanha;
$$;

-- Função para obter métricas de todas as campanhas de um hospital
CREATE OR REPLACE FUNCTION get_hospital_campanhas_metrics(hospital_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  campanha_id UUID,
  campanha_nome TEXT,
  tipo_campanha TEXT,
  data_criacao DATE,
  ativa BOOLEAN,
  total_envios BIGINT,
  total_respondidas BIGINT,
  aguardando_resposta BIGINT,
  taxa_resposta NUMERIC(5,2),
  nps_medio NUMERIC(5,2)
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id as campanha_id,
    c.nome as campanha_nome,
    c.tipo_campanha,
    c.data_criacao,
    c.ativa,
    COALESCE(COUNT(e.id), 0) as total_envios,
    COALESCE(COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END), 0) as total_respondidas,
    COALESCE(COUNT(CASE WHEN e.respondido_em IS NULL THEN 1 END), 0) as aguardando_resposta,
    CASE 
      WHEN COUNT(e.id) > 0 THEN 
        ROUND((COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END)::NUMERIC / COUNT(e.id)::NUMERIC) * 100, 2)
      ELSE 0
    END as taxa_resposta,
    COALESCE(ROUND(AVG(r.nps_score)::NUMERIC, 2), 0) as nps_medio
  FROM campanhas c
  LEFT JOIN envios_pesquisa e ON c.id = e.campanha_id
  LEFT JOIN respostas_pesquisa r ON e.id = r.envio_id
  WHERE (hospital_uuid IS NULL OR c.hospital_id = hospital_uuid)
  GROUP BY c.id, c.nome, c.tipo_campanha, c.data_criacao, c.ativa
  ORDER BY c.created_at DESC;
$$;

-- Função para obter métricas consolidadas por tipo de campanha
CREATE OR REPLACE FUNCTION get_campanhas_by_type_metrics(hospital_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  tipo_campanha TEXT,
  total_campanhas BIGINT,
  total_envios BIGINT,
  total_respondidas BIGINT,
  taxa_resposta_media NUMERIC(5,2)
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.tipo_campanha,
    COUNT(DISTINCT c.id) as total_campanhas,
    COALESCE(COUNT(e.id), 0) as total_envios,
    COALESCE(COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END), 0) as total_respondidas,
    CASE 
      WHEN COUNT(e.id) > 0 THEN 
        ROUND((COUNT(CASE WHEN e.respondido_em IS NOT NULL THEN 1 END)::NUMERIC / COUNT(e.id)::NUMERIC) * 100, 2)
      ELSE 0
    END as taxa_resposta_media
  FROM campanhas c
  LEFT JOIN envios_pesquisa e ON c.id = e.campanha_id
  WHERE (hospital_uuid IS NULL OR c.hospital_id = hospital_uuid)
  GROUP BY c.tipo_campanha
  ORDER BY total_envios DESC;
$$;