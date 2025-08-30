import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { useAuth } from "@/contexts/AuthContext"
import { useHospital } from "@/contexts/HospitalContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { NPSPreview } from "@/components/NPSPreview"
import { PontosContatoForm, PontoContato } from "@/components/PontosContatoForm"
import { PontosContatoPreview } from "@/components/PontosContatoPreview"

const CriarCampanhaPage = () => {
  const { tipo } = useParams<{ tipo: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedHospital } = useHospital()
  const { toast } = useToast()
  
  const [campaignName, setCampaignName] = useState("")
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR'))
  
  // Estados do formulário
  const [trechoPergunta, setTrechoPergunta] = useState("")
  const [recomendacao, setRecomendacao] = useState("")
  const [autorizacao, setAutorizacao] = useState("")
  const [activeTab, setActiveTab] = useState("pergunta-definitiva")
  
  // Estados dos pontos de contato
  const [pontosContatoAtivos, setPontosContatoAtivos] = useState(false)
  const [pontosContato, setPontosContato] = useState<PontoContato[]>([])
  
  // Estados do usuário
  const [userHospitalId, setUserHospitalId] = useState<string | null>(null)
  
  useEffect(() => {
    if (!user) return
    
    const fetchUserData = async () => {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('hospital_id')
        .eq('id', user.id)
        .single()
      
      if (userData) {
        setUserHospitalId(userData.hospital_id)
      }
    }
    
    fetchUserData()
  }, [user])

  const handleSave = async () => {
    if (!user || !userHospitalId) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado ou hospital não definido",
        variant: "destructive"
      })
      return
    }

    if (!campaignName.trim() || !trechoPergunta.trim() || !recomendacao.trim() || !autorizacao.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      // Criar campanha
      const { data: campanha, error: campanhaError } = await supabase
        .from('campanhas')
        .insert({
          nome: campaignName,
          tipo_campanha: tipo!,
          usuario_id: user.id,
          hospital_id: userHospitalId
        })
        .select()
        .single()

      if (campanhaError) throw campanhaError

      // Criar configuração da campanha
      const { error: configError } = await supabase
        .from('campanha_configuracao')
        .insert({
          campanha_id: campanha.id,
          trecho_pergunta: trechoPergunta,
          recomendacao: recomendacao,
          autorizacao: autorizacao
        })

      if (configError) throw configError

      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso!"
      })

      navigate('/dashboard/campanhas')
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar campanha",
        variant: "destructive"
      })
    }
  }

  const getTipoTitle = (tipo: string) => {
    const tipos = {
      email: "E-mail",
      link: "Link",
      embed: "Implantar no site",
      multiple: "Múltiplos canais",
      custom: "Envio próprio"
    }
    return tipos[tipo as keyof typeof tipos] || tipo
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/campanhas')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Criar Campanha - {getTipoTitle(tipo!)}
            </h1>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Salvar Campanha
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Header com nome e data */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Campanha NPS</Label>
                <Input
                  id="nome"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Digite o nome da campanha"
                />
              </div>
              <div>
                <Label>Data de Criação</Label>
                <Input value={currentDate} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout principal - Painéis redimensionáveis */}
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] rounded-lg border"
        >
          {/* Painel esquerdo - Formulário */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="grid w-full grid-rows-7 h-auto">
                  <TabsTrigger value="pergunta-definitiva" className="justify-start">
                    Pergunta Definitiva
                  </TabsTrigger>
                  <TabsTrigger value="pontos-contato" className="justify-start">
                    Pontos de Contato
                  </TabsTrigger>
                  <TabsTrigger value="problemas" className="justify-start" disabled>
                    Problemas
                  </TabsTrigger>
                  <TabsTrigger value="formularios-adicionais" className="justify-start" disabled>
                    Formulários Adicionais
                  </TabsTrigger>
                  <TabsTrigger value="layout-envio" className="justify-start" disabled>
                    Layout de Envio
                  </TabsTrigger>
                  <TabsTrigger value="lembrete" className="justify-start" disabled>  
                    Lembrete
                  </TabsTrigger>
                  <TabsTrigger value="confirmacao-envio" className="justify-start" disabled>
                    Confirmação de Envio
                  </TabsTrigger>
                </TabsList>

                <div className="ml-6">
                  <TabsContent value="pergunta-definitiva" className="space-y-4">
                    <div>
                      <Label htmlFor="trecho-pergunta">Trecho da Pergunta *</Label>
                      <Textarea
                        id="trecho-pergunta"
                        value={trechoPergunta}
                        onChange={(e) => setTrechoPergunta(e.target.value)}
                        placeholder="Ex: Como você avalia a qualidade do atendimento recebido?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="recomendacao">Recomendação *</Label>
                      <Textarea
                        id="recomendacao"
                        value={recomendacao}
                        onChange={(e) => setRecomendacao(e.target.value)}
                        placeholder="Ex: Com base na sua experiência, você nos recomendaria para amigos e familiares?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="autorizacao">Autorização *</Label>
                      <Textarea
                        id="autorizacao"
                        value={autorizacao}
                        onChange={(e) => setAutorizacao(e.target.value)}
                        placeholder="Ex: Você autoriza o uso do seu depoimento em nossas comunicações?"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pontos-contato">
                    <PontosContatoForm
                      pontosContatoAtivos={pontosContatoAtivos}
                      setPontosContatoAtivos={setPontosContatoAtivos}
                      pontosContato={pontosContato}
                      setPontosContato={setPontosContato}
                    />
                  </TabsContent>

                  <TabsContent value="problemas">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Esta seção será implementada em breve</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="formularios-adicionais">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Esta seção será implementada em breve</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="layout-envio">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Esta seção será implementada em breve</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="lembrete">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Esta seção será implementada em breve</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="confirmacao-envio">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Esta seção será implementada em breve</p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Painel direito - Preview */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview da Pesquisa</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTab === "pontos-contato" ? (
                    <PontosContatoPreview
                      pontosContatoAtivos={pontosContatoAtivos}
                      pontosContato={pontosContato}
                      nomeHospital={selectedHospital?.nome}
                    />
                  ) : (
                    <NPSPreview
                      trechoPergunta={trechoPergunta}
                      recomendacao={recomendacao}
                      autorizacao={autorizacao}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default CriarCampanhaPage