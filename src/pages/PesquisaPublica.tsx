import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { NPSPreview } from "@/components/NPSPreview"
import { PontosContatoPreview } from "@/components/PontosContatoPreview"
import { ProblemasPreview } from "@/components/ProblemasPreview"
import { FormulariosAdicionaisPreview } from "@/components/FormulariosAdicionaisPreview"
import { DadosPessoaisForm } from "@/components/DadosPessoaisForm"

interface CampanhaData {
  id: string
  nome: string
  tipo_campanha: string
  hospital_id: string
  ativa: boolean
  configuracao?: Array<{
    trecho_pergunta?: string
    recomendacao?: string
    autorizacao?: string
    o_que_agradou?: string
    setores_selecionados?: string[]
    pergunta_recomendacao?: string
    resposta_autorizacao?: string
    banner_url?: string
    pergunta_definitiva?: any
    pontos_contato?: any
    problemas?: any
    formularios_adicionais?: any
    layout_envio?: any
  }>
}

export default function PesquisaPublica() {
  const { campanhaId } = useParams()
  const [campanha, setCampanha] = useState<CampanhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [etapas, setEtapas] = useState<string[]>([])
  const [respostas, setRespostas] = useState<any>({})
  const [envioId, setEnvioId] = useState<string | null>(null)
  const [dadosPessoais, setDadosPessoais] = useState<{ nome: string; email: string; telefone: string } | null>(null)
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [mostrandoDadosPessoais, setMostrandoDadosPessoais] = useState(true)

  // Carregar dados da campanha
  useEffect(() => {
    const carregarCampanha = async () => {
      if (!campanhaId) return

      try {
        setLoading(true)
        console.log('Carregando campanha:', campanhaId)
        
        const { data, error } = await supabase
          .from('campanhas')
          .select(`
            *,
            configuracao:campanha_configuracao(*)
          `)
          .eq('id', campanhaId)
          .maybeSingle()

        if (error) {
          console.error('Erro ao carregar campanha:', error)
          setCampanha(null)
          toast.error("Erro ao carregar pesquisa")
        } else if (!data) {
          console.log('Campanha não encontrada')
          setCampanha(null)
          toast.error("Pesquisa não encontrada")
        } else if (!data.ativa) {
          console.log('Campanha encontrada mas inativa')
          setCampanha(null)
          toast.error("Esta pesquisa não está mais disponível")
        } else {
          console.log('Campanha carregada:', data)
          console.log('Layout envio completo:', data.configuracao?.[0]?.layout_envio)
          console.log('Tipo do layout_envio:', typeof data.configuracao?.[0]?.layout_envio)
          
          // Debug banner URL extraction
          const layoutEnvio = data.configuracao?.[0]?.layout_envio
          const bannerUrl = (layoutEnvio as any)?.bannerUrl
          console.log('Banner URL extraído:', bannerUrl)
          console.log('Banner URL existe?', !!bannerUrl)
          
          setCampanha(data)

          // Definir etapas baseadas na configuração
          const etapasDisponiveis = ["pergunta_definitiva"]
          
          const config = data.configuracao?.[0] // Access first element of array
          if (config?.pontos_contato && typeof config.pontos_contato === 'object' && (config.pontos_contato as any)?.ativo) {
            etapasDisponiveis.push("pontos_contato")
          }
          if (config?.problemas && typeof config.problemas === 'object' && (config.problemas as any)?.ativo) {
            etapasDisponiveis.push("problemas")
          }
          if (config?.formularios_adicionais && typeof config.formularios_adicionais === 'object' && (config.formularios_adicionais as any)?.ativo) {
            etapasDisponiveis.push("formularios_adicionais")
          }
          
          setEtapas(etapasDisponiveis)
        }
      } catch (error) {
        console.error("Erro inesperado:", error)
        setCampanha(null)
        toast.error("Erro inesperado ao carregar pesquisa")
      } finally {
        setLoading(false)
      }
    }

    carregarCampanha()
  }, [campanhaId])

  const handleProximaEtapa = async () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1)
    } else {
      // Na última etapa, salvar resposta
      const sucesso = await salvarResposta()
      if (sucesso) {
        toast.success("Resposta enviada com sucesso! Obrigado pela sua participação.")
        setEtapaAtual(999) // Tela de agradecimento
      }
    }
  }

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1)
    }
  }

  const handleDadosPessoais = async (dados: { nome: string; email: string; telefone: string }) => {
    try {
      console.log('Salvando dados pessoais:', dados)
      
      // Primeiro, verificar se já existe um paciente com este email
      const { data: pacienteExistente, error: buscaError } = await supabase
        .from('pacientes')
        .select('id, nome, email, telefone')
        .eq('email', dados.email)
        .single()

      let paciente = null

      if (pacienteExistente && !buscaError) {
        // Paciente já existe, usar o existente
        console.log('Paciente já existe, usando existente:', pacienteExistente)
        paciente = pacienteExistente
      } else {
        // Paciente não existe, criar novo
        console.log('Criando novo paciente')
        const { data: novoPaciente, error: pacienteError } = await supabase
          .from('pacientes')
          .insert({
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone || null,
            hospital_id: campanha?.hospital_id || null
          })
          .select()
          .single()

        if (pacienteError) {
          console.error('Erro ao criar paciente:', pacienteError)
          toast.error(`Erro ao salvar dados: ${pacienteError.message}`)
          return
        }

        paciente = novoPaciente
        console.log('Paciente criado com sucesso:', novoPaciente)
      }

      setDadosPessoais(dados)
      setPacienteId(paciente.id)
      setMostrandoDadosPessoais(false)
      
      toast.success('Dados salvos com sucesso!')
    } catch (error) {
      console.error('Erro inesperado ao salvar dados pessoais:', error)
      toast.error('Erro inesperado ao salvar dados')
    }
  }

  // Função para coletar dados dos componentes
  const handleResponse = (data: any) => {
    setRespostas(prev => ({
      ...prev,
      ...data
    }))
  }

  // Função para salvar resposta no Supabase
  const salvarResposta = async () => {
    if (!campanhaId) return false

    try {
      console.log('Iniciando salvamento de resposta:', respostas)
      
      // Criar envio se não existir
      let currentEnvioId = envioId
      if (!currentEnvioId) {
        console.log('Criando novo envio para campanha:', campanhaId)
        
        if (!pacienteId) {
          console.error('ID do paciente não encontrado')
          toast.error('Erro: dados do paciente não encontrados')
          return false
        }
        
        const envioData = {
          campanha_id: campanhaId,
          paciente_id: pacienteId,
          status: 'respondido',
          respondido_em: new Date().toISOString()
        }
        
        console.log('Dados do envio:', envioData)
        
        const { data: novoEnvio, error: envioError } = await supabase
          .from('envios_pesquisa')
          .insert(envioData)
          .select()
          .single()

        if (envioError) {
          console.error('Erro detalhado ao criar envio:', envioError)
          console.error('Código do erro:', envioError.code)
          console.error('Detalhes do erro:', envioError.details)
          toast.error(`Erro ao criar envio: ${envioError.message}`)
          return false
        }

        console.log('Envio criado com sucesso:', novoEnvio)
        currentEnvioId = novoEnvio.id
        setEnvioId(currentEnvioId)
      }

      // Preparar dados normalizados
      const dadosResposta = {
        envio_id: currentEnvioId,
        campanha_id: campanhaId,
        nps_score: respostas.nps_score || null,
        resposta_trecho_pergunta: respostas.resposta_trecho_pergunta || null,
        resposta_o_que_agradou: respostas.resposta_o_que_agradou || null,
        resposta_porque_nota: respostas.resposta_porque_nota || null,
        setores_atendimento: respostas.setores_atendimento || null,
        resposta_recomendacao: respostas.resposta_recomendacao || null,
        resposta_autorizacao: respostas.resposta_autorizacao || null,
        pontos_contato: respostas.pontos_contato || null,
        problemas: respostas.problemas || null,
        formularios_adicionais: respostas.formularios_adicionais || null
      }

      console.log('Salvando resposta com dados:', dadosResposta)

      // Salvar resposta
      const { error: respostaError } = await supabase
        .from('respostas_pesquisa')
        .insert(dadosResposta)

      if (respostaError) {
        console.error('Erro detalhado ao salvar resposta:', respostaError)
        console.error('Código do erro:', respostaError.code)
        console.error('Detalhes do erro:', respostaError.details)
        toast.error(`Erro ao salvar resposta: ${respostaError.message}`)
        return false
      }

      console.log('Resposta salva com sucesso!')
      return true
    } catch (error) {
      console.error('Erro inesperado ao salvar resposta:', error)
      toast.error("Erro inesperado ao salvar resposta")
      return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando pesquisa...</p>
      </div>
    )
  }

  if (!campanha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Pesquisa não encontrada</h2>
            <p>Esta pesquisa não existe ou foi removida.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de agradecimento
  if (etapaAtual === 999) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Obrigado!</h2>
            <p>Sua resposta foi enviada com sucesso. Agradecemos pela sua participação!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const etapaAtualNome = etapas[etapaAtual]
  const isUltimaEtapa = etapaAtual === etapas.length - 1

  // Se ainda está coletando dados pessoais, mostrar formulário
  if (mostrandoDadosPessoais) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto max-w-4xl px-4 flex items-center justify-center min-h-[80vh]">
          <DadosPessoaisForm 
            onSubmit={handleDadosPessoais}
            loading={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Renderizar o componente de preview apropriado para cada etapa */}
        {etapaAtualNome === "pergunta_definitiva" && (() => {
          const bannerUrl = campanha.configuracao?.[0]?.banner_url
          
          console.log('DEBUGGING BANNER - PesquisaPublica:')
          console.log('- banner_url da coluna banner_url:', bannerUrl)
          console.log('- banner_url existe?', !!bannerUrl)
          console.log('- configuracao completa:', campanha.configuracao?.[0])
          
          return (
            <NPSPreview
              trechoPergunta={campanha.configuracao?.[0]?.trecho_pergunta || ""}
              recomendacao={campanha.configuracao?.[0]?.pergunta_recomendacao || campanha.configuracao?.[0]?.recomendacao || ""}
              autorizacao={campanha.configuracao?.[0]?.resposta_autorizacao || campanha.configuracao?.[0]?.autorizacao || ""}
              oQueAgradou={campanha.configuracao?.[0]?.o_que_agradou || (campanha.configuracao?.[0]?.pergunta_definitiva as any)?.oQueAgradou}
              setoresHospital={campanha.configuracao?.[0]?.setores_selecionados || (campanha.configuracao?.[0]?.pergunta_definitiva as any)?.setoresHospital || []}
              nomeHospital={campanha.nome}
              isPublicMode={true}
              logoUrl={bannerUrl}
              onResponse={handleResponse}
            />
          )
        })()}

        {etapaAtualNome === "pontos_contato" && campanha.configuracao?.[0]?.pontos_contato && (
          <PontosContatoPreview
            pontosContatoAtivos={true}
            pontosContato={(campanha.configuracao[0].pontos_contato as any)?.pontos || []}
            nomeHospital={campanha.nome}
            isPublicMode={true}
            onResponse={handleResponse}
          />
        )}

        {etapaAtualNome === "problemas" && (
          <ProblemasPreview
            problemasAtivos={true}
            nomeHospital={campanha.nome}
            isPublicMode={true}
            onResponse={handleResponse}
          />
        )}

        {etapaAtualNome === "formularios_adicionais" && (
          <FormulariosAdicionaisPreview
            formulariosAdicionaisAtivos={true}
            formulariosCriados={(campanha.configuracao?.[0]?.formularios_adicionais as any)?.formularios || []}
            nomeHospital={campanha.nome}
            isPublicMode={true}
            onResponse={handleResponse}
          />
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6 max-w-2xl mx-auto">
          {etapaAtual > 0 ? (
            <Button variant="outline" onClick={handleEtapaAnterior}>
              Voltar
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button onClick={handleProximaEtapa}>
            {isUltimaEtapa ? "Enviar Resposta" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  )
}