-- Criar tabela de pacientes
CREATE TABLE public.pacientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  hospital_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de envios de pesquisa
CREATE TABLE public.envios_pesquisa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID NOT NULL,
  paciente_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'enviado',
  enviado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  respondido_em TIMESTAMP WITH TIME ZONE,
  token_resposta UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de respostas
CREATE TABLE public.respostas_pesquisa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  envio_id UUID NOT NULL,
  pergunta_definitiva JSONB,
  pontos_contato JSONB,
  problemas JSONB,
  formularios_adicionais JSONB,
  nps_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envios_pesquisa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas_pesquisa ENABLE ROW LEVEL SECURITY;

-- RLS Policies para pacientes
CREATE POLICY "Usuários podem ver pacientes do seu hospital" 
ON public.pacientes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
      OR (tipo_acesso = 'gestor_supervisor' AND usuarios.hospital_id = pacientes.hospital_id)
    )
  )
);

CREATE POLICY "Usuários podem inserir pacientes no seu hospital" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio', 'gestor_supervisor')
    )
  )
);

CREATE POLICY "Usuários podem atualizar pacientes do seu hospital" 
ON public.pacientes 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND (
      tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
      OR (tipo_acesso = 'gestor_supervisor' AND usuarios.hospital_id = pacientes.hospital_id)
    )
  )
);

-- RLS Policies para envios_pesquisa
CREATE POLICY "Usuários podem ver envios do seu hospital" 
ON public.envios_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = envios_pesquisa.campanha_id 
    AND (
      u.tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
      OR (u.tipo_acesso = 'gestor_supervisor' AND u.hospital_id = c.hospital_id)
    )
  )
);

CREATE POLICY "Usuários podem inserir envios para campanhas do seu hospital" 
ON public.envios_pesquisa 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campanhas c
    JOIN usuarios u ON u.id = auth.uid()
    WHERE c.id = envios_pesquisa.campanha_id 
    AND c.usuario_id = auth.uid()
  )
);

-- RLS Policies para respostas_pesquisa  
CREATE POLICY "Usuários podem ver respostas do seu hospital" 
ON public.respostas_pesquisa 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM envios_pesquisa e
    JOIN campanhas c ON c.id = e.campanha_id
    JOIN usuarios u ON u.id = auth.uid()
    WHERE e.id = respostas_pesquisa.envio_id 
    AND (
      u.tipo_acesso IN ('administrador', 'gestor_diretor', 'gestor_eximio')
      OR (u.tipo_acesso = 'gestor_supervisor' AND u.hospital_id = c.hospital_id)
    )
  )
);

CREATE POLICY "Permitir inserção de respostas via token público" 
ON public.respostas_pesquisa 
FOR INSERT 
WITH CHECK (true);

-- Adicionar triggers para updated_at
CREATE TRIGGER update_pacientes_updated_at
  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_envios_pesquisa_updated_at
  BEFORE UPDATE ON public.envios_pesquisa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_respostas_pesquisa_updated_at
  BEFORE UPDATE ON public.respostas_pesquisa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();