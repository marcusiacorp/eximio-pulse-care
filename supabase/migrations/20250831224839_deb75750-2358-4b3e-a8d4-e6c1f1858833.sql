-- Adicionar campos para pergunta padrão na tabela respostas_pesquisa
ALTER TABLE public.respostas_pesquisa 
ADD COLUMN area_selecionada text,
ADD COLUMN nps_score_global integer,
ADD COLUMN resposta_o_que_agradou_global text,
ADD COLUMN respostas_setores jsonb DEFAULT '{}'::jsonb;

-- Adicionar campos para perguntas padrão na tabela campanha_configuracao
ALTER TABLE public.campanha_configuracao 
ADD COLUMN pergunta_nps_global text DEFAULT 'Como você avalia sua experiência geral no hospital?',
ADD COLUMN pergunta_o_que_agradou_global text DEFAULT 'O que mais te agradou durante o atendimento?',
ADD COLUMN pergunta_area_atendimento text DEFAULT 'Em qual área você foi atendido?',
ADD COLUMN perguntas_setores jsonb DEFAULT '{
  "Pronto Socorro": {
    "avaliacaoSetor": "Como você avalia o atendimento no Pronto Socorro?",
    "satisfacao": "Você ficou satisfeito com o tempo de espera?",
    "sugestoes": "Alguma sugestão para melhorar o atendimento?"
  },
  "Ambulatório": {
    "avaliacaoSetor": "Como você avalia o atendimento no Ambulatório?", 
    "satisfacao": "Você ficou satisfeito com o tempo de espera?",
    "sugestoes": "Alguma sugestão para melhorar o atendimento?"
  },
  "Unidade de Internação": {
    "avaliacaoSetor": "Como você avalia o atendimento na Unidade de Internação?",
    "satisfacao": "Você ficou satisfeito com o tempo de espera?", 
    "sugestoes": "Alguma sugestão para melhorar o atendimento?"
  }
}'::jsonb;