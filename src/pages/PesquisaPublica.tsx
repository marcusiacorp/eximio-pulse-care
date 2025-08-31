import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CampanhaData {
  id: string
  nome: string
  tipo_campanha: string
  hospital_id: string
  configuracao?: {
    trecho_pergunta?: string
    recomendacao?: string
    autorizacao?: string
    pontos_contato?: any
    problemas?: any
    formularios_adicionais?: any
    layout_envio?: any
  }
}

export default function PesquisaPublica() {
  const { campanhaId } = useParams()
  const [campanha, setCampanha] = useState<CampanhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Estados das respostas
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [dadosPaciente, setDadosPaciente] = useState({ nome: "", email: "", telefone: "" })
  const [etapaAtual, setEtapaAtual] = useState(0)
  
  // Estados para pontos de contato
  const [selectedScores, setSelectedScores] = useState<{[key: string]: number}>({})
  const [feedbackPositivo, setFeedbackPositivo] = useState("")
  const [influenciaSelecionada, setInfluenciaSelecionada] = useState<string[]>([])
  const [sugestaoFinal, setSugestaoFinal] = useState("")
  
  // Estados para problemas
  const [temProblema, setTemProblema] = useState<boolean | null>(null)
  const [descricaoProblema, setDescricaoProblema] = useState("")
  const [problemaResolvido, setProblemaResolvido] = useState<boolean | null>(null)
  const [notaAtendimento, setNotaAtendimento] = useState<number | null>(null)
  
  // Estados para formulários adicionais
  const [respostasFormularios, setRespostasFormularios] = useState<{[key: number]: string}>({})

  // Lista de etapas disponíveis
  const [etapas, setEtapas] = useState<string[]>([])

  const opcoesInfluencia = [
    "Atendimento da equipe médica",
    "Atendimento prestado pelas equipes de apoio, como enfermagem, recepção e demais setores",
    "Comunicação e informações recebidas",
    "Atendimento rápido",
    "Resolução do problema",
    "Estrutura e conforto",
    "Higiene e Limpeza"
  ]

  // Carregar dados da campanha
  useEffect(() => {
    const carregarCampanha = async () => {
      if (!campanhaId) return

      try {
        const { data: campanhaData, error: campanhaError } = await supabase
          .from("campanhas")
          .select("*")
          .eq("id", campanhaId)
          .single()

        if (campanhaError) throw campanhaError

        const { data: configData, error: configError } = await supabase
          .from("campanha_configuracao")
          .select("*")
          .eq("campanha_id", campanhaId)
          .single()

        if (configError) throw configError

        setCampanha({
          ...campanhaData,
          configuracao: configData
        })

        // Definir etapas baseadas na configuração
        const etapasDisponiveis = ["pergunta_definitiva"]
        
        if (configData.pontos_contato && typeof configData.pontos_contato === 'object' && (configData.pontos_contato as any)?.ativo) {
          etapasDisponiveis.push("pontos_contato")
        }
        if (configData.problemas && typeof configData.problemas === 'object' && (configData.problemas as any)?.ativo) {
          etapasDisponiveis.push("problemas")
        }
        if (configData.formularios_adicionais && typeof configData.formularios_adicionais === 'object' && (configData.formularios_adicionais as any)?.ativo) {
          etapasDisponiveis.push("formularios_adicionais")
        }
        
        setEtapas(etapasDisponiveis)
      } catch (error) {
        console.error("Erro ao carregar campanha:", error)
        toast.error("Pesquisa não encontrada")
      } finally {
        setLoading(false)
      }
    }

    carregarCampanha()
  }, [campanhaId])

  const handleProximaEtapa = () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1)
    } else {
      handleEnviarResposta()
    }
  }

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1)
    }
  }

  // Enviar resposta
  const handleEnviarResposta = async () => {
    if (!campanha || npsScore === null) return

    setSubmitting(true)
    try {
      // Primeiro, inserir ou encontrar o paciente
      let pacienteId = null
      
      if (dadosPaciente.nome && dadosPaciente.email) {
        // Tentar encontrar paciente existente
        const { data: pacienteExistente } = await supabase
          .from("pacientes")
          .select("id")
          .eq("email", dadosPaciente.email)
          .eq("hospital_id", campanha.hospital_id)
          .maybeSingle()

        if (pacienteExistente) {
          pacienteId = pacienteExistente.id
        } else {
          // Criar novo paciente
          const { data: novoPaciente, error: pacienteError } = await supabase
            .from("pacientes")
            .insert({
              nome: dadosPaciente.nome,
              email: dadosPaciente.email,
              telefone: dadosPaciente.telefone,
              hospital_id: campanha.hospital_id
            })
            .select("id")
            .single()

          if (pacienteError) throw pacienteError
          pacienteId = novoPaciente.id
        }
      }

      // Criar envio da pesquisa
      const { data: envio, error: envioError } = await supabase
        .from("envios_pesquisa")
        .insert({
          campanha_id: campanha.id,
          paciente_id: pacienteId,
          status: "respondido",
          respondido_em: new Date().toISOString()
        })
        .select("id")
        .single()

      if (envioError) throw envioError

      // Preparar dados das respostas
      const perguntaDefinitiva = {
        nps_score: npsScore,
        feedback: feedback,
        ...(campanha.configuracao?.autorizacao && { 
          autorizacao: true // ou false baseado na resposta do usuário
        })
      }

      const pontosContatoResposta = etapas.includes("pontos_contato") ? {
        scores: selectedScores,
        feedback_positivo: feedbackPositivo,
        influencia: influenciaSelecionada,
        sugestao_final: sugestaoFinal
      } : {}

      const problemasResposta = etapas.includes("problemas") ? {
        tem_problema: temProblema,
        descricao: descricaoProblema,
        resolvido: problemaResolvido,
        nota_atendimento: notaAtendimento
      } : {}

      const formulariosResposta = etapas.includes("formularios_adicionais") ? 
        respostasFormularios : {}

      // Salvar resposta - NPS score vai no pergunta_definitiva
      const { error: respostaError } = await supabase
        .from("respostas_pesquisa")
        .insert({
          envio_id: envio.id,
          nps_score: npsScore,
          pergunta_definitiva: perguntaDefinitiva,
          pontos_contato: pontosContatoResposta,
          problemas: problemasResposta,
          formularios_adicionais: formulariosResposta
        })

      if (respostaError) throw respostaError

      toast.success("Resposta enviada com sucesso! Obrigado pela sua participação.")
      setEtapaAtual(999) // Tela de agradecimento
    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
      toast.error("Erro ao enviar resposta. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleScoreSelect = (pontoId: string, score: number) => {
    setSelectedScores(prev => ({
      ...prev,
      [pontoId]: score
    }))
  }

  const handleInfluenciaToggle = (opcao: string) => {
    setInfluenciaSelecionada(prev => 
      prev.includes(opcao) 
        ? prev.filter(item => item !== opcao)
        : [...prev, opcao]
    )
  }

  const getNPSColor = (score: number, isSelected: boolean) => {
    if (isSelected) {
      if (score <= 6) return "bg-red-500 text-white"
      if (score <= 8) return "bg-yellow-500 text-white"
      return "bg-green-500 text-white"
    }
    if (score <= 6) return "bg-red-500/10 hover:bg-red-500/20"
    if (score <= 8) return "bg-yellow-500/10 hover:bg-yellow-500/20"
    return "bg-green-500/10 hover:bg-green-500/20"
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Etapa: Pergunta Definitiva (NPS) */}
            {etapaAtualNome === "pergunta_definitiva" && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">
                    {campanha.configuracao?.trecho_pergunta || "Em uma escala de 0 a 10, o quanto você recomendaria nossos serviços?"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    0 = Não recomendaria | 10 = Recomendaria com certeza
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="grid grid-cols-11 gap-2">
                    {Array.from({ length: 11 }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className={`w-12 h-12 ${getNPSColor(i, npsScore === i)}`}
                        onClick={() => setNpsScore(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="feedback">Você poderia compartilhar conosco o porquê da sua nota?</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value.slice(0, 280))}
                    placeholder="Digite seu feedback aqui..."
                    className="resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {feedback.length}/280 caracteres
                  </p>
                </div>

                {/* Dados do paciente (opcionais) */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="text-md font-medium">Seus dados (opcional)</h4>
                  <p className="text-sm text-muted-foreground">
                    Você pode preencher seus dados para que possamos entrar em contato se necessário.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={dadosPaciente.nome}
                        onChange={(e) => setDadosPaciente({...dadosPaciente, nome: e.target.value})}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={dadosPaciente.email}
                        onChange={(e) => setDadosPaciente({...dadosPaciente, email: e.target.value})}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={dadosPaciente.telefone}
                        onChange={(e) => setDadosPaciente({...dadosPaciente, telefone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa: Pontos de Contato */}
            {etapaAtualNome === "pontos_contato" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Para completar sua avaliação, dê uma nota de 0 a 10 para cada um dos pontos abaixo.
                  </h3>
                </div>

                <div className="space-y-6">
                  {campanha.configuracao?.pontos_contato?.pontos?.map((ponto: any) => (
                    <div key={ponto.id} className="space-y-3">
                      <p className="text-sm font-medium">
                        De 0 a 10, como você avalia sua experiência durante sua passagem no setor <strong>{ponto.nome}</strong>?
                      </p>
                      
                      <div className="flex gap-1 justify-center flex-wrap">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                          <Button
                            key={score}
                            size="sm"
                            variant="outline"
                            className={`w-8 h-8 p-0 ${
                              selectedScores[ponto.id] === score 
                                ? getNPSColor(score, true)
                                : "hover:bg-accent"
                            }`}
                            onClick={() => handleScoreSelect(ponto.id, score)}
                          >
                            {score}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {Object.values(selectedScores).some(score => score >= 9) && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?
                    </p>
                    <Textarea
                      value={feedbackPositivo}
                      onChange={(e) => setFeedbackPositivo(e.target.value.slice(0, 280))}
                      placeholder="Conte-nos o que mais contribuiu para sua satisfação..."
                      maxLength={280}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {feedbackPositivo.length}/280 caracteres
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    O que mais influenciou sua experiência no hospital?
                  </p>
                  
                  <div className="space-y-2">
                    {opcoesInfluencia.map((opcao) => (
                      <div key={opcao} className="flex items-center space-x-2">
                        <Checkbox
                          id={opcao}
                          checked={influenciaSelecionada.includes(opcao)}
                          onCheckedChange={() => handleInfluenciaToggle(opcao)}
                        />
                        <Label htmlFor={opcao} className="text-sm cursor-pointer">
                          {opcao}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.
                  </p>
                  <Textarea
                    value={sugestaoFinal}
                    onChange={(e) => setSugestaoFinal(e.target.value)}
                    placeholder="Compartilhe suas sugestões ou comentários adicionais..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Etapa: Problemas */}
            {etapaAtualNome === "problemas" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Você teve algum problema com a gente?</h3>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <Button 
                      variant={temProblema === true ? "default" : "outline"} 
                      className="px-8"
                      onClick={() => setTemProblema(true)}
                    >
                      SIM
                    </Button>
                    <Button 
                      variant={temProblema === false ? "default" : "outline"} 
                      className="px-8"
                      onClick={() => setTemProblema(false)}
                    >
                      NÃO
                    </Button>
                  </div>
                </div>

                {temProblema && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">O que aconteceu?</h4>
                        <p className="text-sm text-muted-foreground mb-3">Seus motivos em detalhes</p>
                        <Textarea
                          value={descricaoProblema}
                          onChange={(e) => setDescricaoProblema(e.target.value.slice(0, 280))}
                          placeholder="Descreva o que aconteceu... (máximo 280 caracteres)"
                          maxLength={280}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">{descricaoProblema.length}/280 caracteres</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Seu problema foi resolvido?</h4>
                        <div className="flex gap-4">
                          <Button 
                            variant={problemaResolvido === true ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setProblemaResolvido(true)}
                          >
                            SIM
                          </Button>
                          <Button 
                            variant={problemaResolvido === false ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setProblemaResolvido(false)}
                          >
                            NÃO
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Qual a sua nota para a forma com que você foi atendido?</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: 11 }, (_, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className={`w-10 h-10 p-0 ${
                                notaAtendimento === i 
                                  ? getNPSColor(i, true)
                                  : "hover:bg-accent"
                              }`}
                              onClick={() => setNotaAtendimento(i)}
                            >
                              {i}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Etapa: Formulários Adicionais */}
            {etapaAtualNome === "formularios_adicionais" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Informações adicionais
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conte-nos um pouco mais de como foi sua experiencia com o produto ou serviço.
                  </p>
                </div>

                {campanha.configuracao?.formularios_adicionais?.formularios?.length > 0 ? (
                  <div className="space-y-4">
                    {campanha.configuracao.formularios_adicionais.formularios.map((formulario: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm font-medium">
                          {formulario.pergunta}
                          {formulario.obrigatorio && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {formulario.descricao && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {formulario.descricao}
                          </p>
                        )}
                        
                        {formulario.tipo === "multiplas-opcoes" ? (
                          <RadioGroup 
                            value={respostasFormularios[index]} 
                            onValueChange={(value) => setRespostasFormularios(prev => ({...prev, [index]: value}))}
                          >
                            {formulario.opcoes?.map((opcao: string, opcaoIndex: number) => (
                              <div key={opcaoIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={opcao} />
                                <Label className="text-sm">{opcao}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Textarea
                            value={respostasFormularios[index] || ""}
                            onChange={(e) => setRespostasFormularios(prev => ({...prev, [index]: e.target.value}))}
                            placeholder="Sua resposta..."
                            className="w-full min-h-[80px] resize-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="experiencia" className="text-sm font-medium">
                      Sua experiência:
                    </Label>
                    <Textarea
                      id="experiencia"
                      value={respostasFormularios[0] || ""}
                      onChange={(e) => setRespostasFormularios(prev => ({...prev, [0]: e.target.value}))}
                      placeholder="Descreva sua experiência..."
                      className="w-full min-h-[120px] resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between pt-6">
              {etapaAtual > 0 ? (
                <Button variant="outline" onClick={handleEtapaAnterior}>
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button 
                onClick={handleProximaEtapa}
                disabled={
                  (etapaAtualNome === "pergunta_definitiva" && npsScore === null) ||
                  submitting
                }
              >
                {submitting ? "Enviando..." : isUltimaEtapa ? "Enviar Resposta" : "Continuar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}