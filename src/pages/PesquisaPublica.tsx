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
  const [mostrandoDadosPessoais, setMostrandoDadosPessoais] = useState(false)
  const [coletandoDadosFinais, setColetandoDadosFinais] = useState(false)

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

          // Definir etapas baseadas na configuração e ativação
          const etapasDisponiveis: string[] = []
          
          const config = data.configuracao?.[0] // Access first element of array
          console.log('DEBUG - Configuração completa:', config)
          
          // Verificar sessões ativas no layout_envio
          const layoutEnvio = config?.layout_envio as any
          const sessoesAtivas = layoutEnvio?.sessoes_ativas || {}
          console.log('DEBUG - Sessões ativas:', sessoesAtivas)
          
          // Adicionar pergunta definitiva se ativa (padrão true se não especificado)
          if (sessoesAtivas.pergunta_definitiva !== false) {
            etapasDisponiveis.push("pergunta_definitiva")
          }
          
          // Adicionar pergunta padrão se ativa
          if (sessoesAtivas.pergunta_padrao === true && config?.pergunta_padrao) {
            etapasDisponiveis.push("pergunta_padrao")
          }
          
          // Verificar pontos de contato
          if (sessoesAtivas.pontos_contato === true && config?.pontos_contato) {
            // Se é boolean true, adiciona a seção
            if (config.pontos_contato === true) {
              etapasDisponiveis.push("pontos_contato")
            }
            // Se é objeto, verifica se tem pontos ativos
            else if (typeof config.pontos_contato === 'object' && config.pontos_contato !== null) {
              const pontosData = config.pontos_contato as any
              // Verificar se tem pontos configurados (qualquer estrutura)
              if (pontosData?.pontos && Array.isArray(pontosData.pontos)) {
                const temPontosAtivos = pontosData.pontos.some((ponto: any) => ponto?.ativo === true)
                if (temPontosAtivos) {
                  etapasDisponiveis.push("pontos_contato")
                }
              }
              // Ou se tem propriedades que indicam configuração ativa
              else if (Object.keys(pontosData).length > 0) {
                etapasDisponiveis.push("pontos_contato")
              }
            }
          }
          
          // Verificar problemas
          if (sessoesAtivas.problemas === true && config?.problemas) {
            // Se é boolean true ou qualquer objeto não nulo, adiciona
            if (config.problemas === true || (typeof config.problemas === 'object' && config.problemas !== null)) {
              etapasDisponiveis.push("problemas")
            }
          }
          
          // Verificar formulários adicionais
          if (sessoesAtivas.formularios_adicionais === true && config?.formularios_adicionais) {
            // Se é boolean true, adiciona a seção
            if (config.formularios_adicionais === true) {
              etapasDisponiveis.push("formularios_adicionais")
            }
            // Se é objeto, verifica se tem formulários
            else if (typeof config.formularios_adicionais === 'object' && config.formularios_adicionais !== null) {
              const formulariosData = config.formularios_adicionais as any
              // Verificar se tem formulários configurados
              if (formulariosData?.formularios && Array.isArray(formulariosData.formularios) && formulariosData.formularios.length > 0) {
                etapasDisponiveis.push("formularios_adicionais")
              }
              // Ou se tem outras propriedades que indicam configuração
              else if (Object.keys(formulariosData).length > 0) {
                etapasDisponiveis.push("formularios_adicionais")
              }
            }
          }
          
          console.log('DEBUG - Etapas calculadas:', etapasDisponiveis)
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
      // Na última etapa, mostrar coleta de dados pessoais
      setColetandoDadosFinais(true)
    }
  }

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1)
    }
  }

  const handleDadosPessoaisFinais = async (dados: { nome: string; email: string; telefone: string }) => {
    try {
      console.log('Salvando dados pessoais finais:', dados)
      
      setDadosPessoais(dados)
      
      // Agora salvar resposta com os dados pessoais
      const sucesso = await salvarResposta(dados)
      if (sucesso) {
        toast.success("Resposta enviada com sucesso! Obrigado pela sua participação.")
        setEtapaAtual(999) // Tela de agradecimento
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar dados finais:', error)
      toast.error('Erro inesperado ao salvar dados')
    }
  }

  // Função para coletar dados dos componentes
  const handleResponse = (data: any) => {
    console.log('DEBUG - Recebendo resposta do componente:', data)
    console.log('DEBUG - Etapa atual:', etapaAtualNome)
    
    setRespostas(prev => {
      const novasRespostas = {
        ...prev,
        ...data
      }
      console.log('DEBUG - Respostas atualizadas:', novasRespostas)
      return novasRespostas
    })
  }

  // Função para salvar resposta no Supabase
  const salvarResposta = async (dadosPessoaisFinais?: { nome: string; email: string; telefone: string }) => {
    if (!campanhaId) return false

    try {
      console.log('Iniciando salvamento de resposta:', respostas)
      console.log('Dados pessoais finais:', dadosPessoaisFinais)
      
      // Criar novo envio sem paciente_id (pesquisa pública)
      const envioData = {
        campanha_id: campanhaId,
        paciente_id: null, // Pesquisa pública não tem paciente cadastrado
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
        toast.error(`Erro ao criar envio: ${envioError.message}`)
        return false
      }

      console.log('Envio criado com sucesso:', novoEnvio)
      const currentEnvioId = novoEnvio.id

      // Preparar dados normalizados com dados pessoais
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
        formularios_adicionais: respostas.formularios_adicionais || null,
        // Adicionar dados pessoais do respondente
        nome_respondente: dadosPessoaisFinais?.nome || null,
        email_respondente: dadosPessoaisFinais?.email || null,
        telefone_respondente: dadosPessoaisFinais?.telefone || null
      }

      console.log('Salvando resposta com dados:', dadosResposta)

      // Salvar resposta
      const { error: respostaError } = await supabase
        .from('respostas_pesquisa')
        .insert(dadosResposta)

      if (respostaError) {
        console.error('Erro detalhado ao salvar resposta:', respostaError)
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

  // Se está coletando dados pessoais no final, mostrar formulário
  if (coletandoDadosFinais) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto max-w-4xl px-4 flex items-center justify-center min-h-[80vh]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Quase terminamos!
            </h1>
            <p className="text-muted-foreground mb-6">
              Para finalizar, gostaríamos de saber seus dados de contato (opcional)
            </p>
            <DadosPessoaisForm 
              onSubmit={handleDadosPessoaisFinais}
              loading={false}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Indicador de progresso dinâmico */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Passo {etapaAtual + 1} de {etapas.length} • {etapaAtualNome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <div className="w-full bg-secondary rounded-full h-2 mt-2 max-w-md mx-auto">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((etapaAtual + 1) / etapas.length) * 100}%` }}
            />
          </div>
        </div>


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

        {etapaAtualNome === "pergunta_padrao" && campanha.configuracao?.[0]?.pergunta_padrao && (() => {
          const perguntaPadraoData = campanha.configuracao[0].pergunta_padrao as any
          console.log('DEBUG - Renderizando pergunta padrão:', perguntaPadraoData)
          
          return (
            <PerguntaPadraoPreview
              boasVindas={perguntaPadraoData.boasVindas || ""}
              bannerPadraoUrl={campanha.configuracao[0].banner_padrao_url || ""}
              hospitalName={campanha.nome}
              isPublicMode={true}
              onResponse={handleResponse}
            />
          )
        })()}
        {etapaAtualNome === "pontos_contato" && campanha.configuracao?.[0]?.pontos_contato && (() => {
          const pontosData = campanha.configuracao[0].pontos_contato as any
          const pontosAtivos = (pontosData?.pontos || []).filter((ponto: any) => ponto?.ativo === true)
          console.log('DEBUG - Renderizando pontos de contato:', { pontosData, pontosAtivos })
          
          return (
            <PontosContatoPreview
              pontosContatoAtivos={true}
              pontosContato={pontosAtivos}
              nomeHospital={campanha.nome}
              isPublicMode={true}
              onResponse={handleResponse}
            />
          )
        })()}

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