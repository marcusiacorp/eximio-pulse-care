-- Criar tabela de campanhas
CREATE TABLE public.campanhas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo_campanha TEXT NOT NULL CHECK (tipo_campanha IN ('email', 'link', 'embed', 'multiple', 'custom')),
  data_criacao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usuario_id UUID NOT NULL,
  hospital_id UUID REFERENCES public.hospitais(id),
  ativa BOOLEAN NOT NULL DEFAULT false
);

-- Criar tabela de configuração de campanhas
CREATE TABLE public.campanha_configuracao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  
  -- Pergunta definitiva
  trecho_pergunta TEXT,
  recomendacao TEXT,
  autorizacao TEXT,
  
  -- Pontos de contato (para implementar depois)
  pontos_contato JSONB DEFAULT '{}',
  
  -- Problemas (para implementar depois)
  problemas JSONB DEFAULT '{}',
  
  -- Formulários adicionais (para implementar depois)
  formularios_adicionais JSONB DEFAULT '{}',
  
  -- Layout de envio (para implementar depois)
  layout_envio JSONB DEFAULT '{}',
  
  -- Lembrete (para implementar depois)
  lembrete JSONB DEFAULT '{}',
  
  -- Confirmação de envio (para implementar depois)
  confirmacao_envio JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanha_configuracao ENABLE ROW LEVEL SECURITY;

-- Políticas para campanhas
CREATE POLICY "Usuários podem ver campanhas do seu hospital" 
ON public.campanhas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
      OR (tipo_acesso = 'gestor_supervisor' AND hospital_id = campanhas.hospital_id)
    )
  )
);

CREATE POLICY "Usuários podem criar campanhas" 
ON public.campanhas 
FOR INSERT 
WITH CHECK (
  auth.uid() = usuario_id AND
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin', 'gestor_supervisor')
    )
  )
);

CREATE POLICY "Usuários podem atualizar campanhas do seu hospital" 
ON public.campanhas 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
      OR (tipo_acesso = 'gestor_supervisor' AND hospital_id = campanhas.hospital_id)
    )
  )
);

-- Políticas para configuração de campanhas
CREATE POLICY "Usuários podem ver configurações das campanhas do seu hospital" 
ON public.campanha_configuracao 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = campanha_id
    AND (
      u.tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
      OR (u.tipo_acesso = 'gestor_supervisor' AND u.hospital_id = c.hospital_id)
    )
  )
);

CREATE POLICY "Usuários podem criar configurações de campanhas" 
ON public.campanha_configuracao 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = campanha_id
    AND c.usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar configurações das campanhas do seu hospital" 
ON public.campanha_configuracao 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = campanha_id
    AND (
      u.tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_admin')
      OR (u.tipo_acesso = 'gestor_supervisor' AND u.hospital_id = c.hospital_id)
    )
  )
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_campanhas_updated_at
BEFORE UPDATE ON public.campanhas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campanha_configuracao_updated_at
BEFORE UPDATE ON public.campanha_configuracao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();