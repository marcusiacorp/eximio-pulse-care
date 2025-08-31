import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CampanhaData {
  id: string
  nome: string
  tipo_campanha: string
  hospital_id: string
  configuracao?: {
    pontos_contato: any
    problemas: any
    formularios_adicionais: any
    layout_envio: any
  }
}

interface RespostaFormulario {
  nps_score?: number
  pontos_contato?: any
  problemas?: any
  formularios_adicionais?: any
  pergunta_definitiva?: any
}

export default function PesquisaPublica() {
  const { campanhaId } = useParams()
  const [campanha, setCampanha] = useState<CampanhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [respostas, setRespostas] = useState<RespostaFormulario>({})
  const [dadosPaciente, setDadosPaciente] = useState({ nome: "", email: "", telefone: "" })
  const [etapaAtual, setEtapaAtual] = useState(0)

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
      } catch (error) {
        console.error("Erro ao carregar campanha:", error)
        toast.error("Pesquisa não encontrada")
      } finally {
        setLoading(false)
      }
    }

    carregarCampanha()
  }, [campanhaId])

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
          .single()

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

      // Salvar resposta
      const { error: respostaError } = await supabase
        .from("respostas_pesquisa")
        .insert({
          envio_id: envio.id,
          nps_score: npsScore,
          pontos_contato: respostas.pontos_contato || {},
          problemas: respostas.problemas || {},
          formularios_adicionais: respostas.formularios_adicionais || {},
          pergunta_definitiva: respostas.pergunta_definitiva || {}
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">{campanha.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Etapa 1: Dados pessoais (opcional) */}
            {etapaAtual === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seus dados (opcional)</h3>
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

                <div className="flex justify-end">
                  <Button onClick={() => setEtapaAtual(1)}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Etapa 2: Pergunta NPS */}
            {etapaAtual === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Em uma escala de 0 a 10, o quanto você recomendaria nossos serviços?
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
                        variant={npsScore === i ? "default" : "outline"}
                        className="w-12 h-12"
                        onClick={() => setNpsScore(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEtapaAtual(0)}>
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleEnviarResposta}
                    disabled={npsScore === null || submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar Resposta"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}