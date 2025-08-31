import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EnvioModal } from "@/components/EnvioModal"
import { Checkbox } from "@/components/ui/checkbox"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { useAuth } from "@/contexts/AuthContext"
import { useHospital } from "@/contexts/HospitalContext"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { NPSPreview } from "@/components/NPSPreview"
import { PontosContatoForm, PontoContato } from "@/components/PontosContatoForm"
import { PontosContatoPreview } from "@/components/PontosContatoPreview"
import { ProblemasPreview } from "@/components/ProblemasPreview"
import { FormulariosAdicionaisPreview } from "@/components/FormulariosAdicionaisPreview"
import { NovoFormularioModal } from "@/components/NovoFormularioModal"
import { LayoutEnvioPreview } from "@/components/LayoutEnvioPreview"

const CriarCampanhaPage = () => {
  const { tipo, id } = useParams<{ tipo: string; id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selectedHospital } = useHospital()
  
  const [isExistingCampaign, setIsExistingCampaign] = useState(!!id)
  const [loadingCampaign, setLoadingCampaign] = useState(false)
  
  const [campaignName, setCampaignName] = useState("")
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR'))
  
  // Estados do formulário
  const [trechoPergunta, setTrechoPergunta] = useState("")
  const [recomendacao, setRecomendacao] = useState("")
  const [autorizacao, setAutorizacao] = useState("")
  const [oQueAgradou, setOQueAgradou] = useState("")
  const [setoresHospital, setSetoresHospital] = useState<string[]>([])
  const [bannerUrl, setBannerUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState("pergunta-definitiva")
  
  // Estados dos pontos de contato
  const [pontosContatoAtivos, setPontosContatoAtivos] = useState(false)
  const [pontosContato, setPontosContato] = useState<PontoContato[]>([])
  
  // Estados dos problemas
  const [problemasAtivos, setProblemasAtivos] = useState(false)
  
  // Estados dos formulários adicionais
  const [formulariosAdicionaisAtivos, setFormulariosAdicionaisAtivos] = useState(false)
  const [formulariosCriados, setFormulariosCriados] = useState<any[]>([])
  
  // Estados do layout de envio
  const [assuntoEmail, setAssuntoEmail] = useState("")
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("")
  const [mensagem, setMensagem] = useState("Nós valorizamos muito nosso relacionamento e o serviço aos nossos clientes e queremos melhorar a cada dia. Pedimos que você use apenas alguns minutos para nos dar sua sincera opinião sobre sua experiência conosco.")
  const [permitirDescadastro, setPermitirDescadastro] = useState(true)
  const [showEnvioModal, setShowEnvioModal] = useState(false)
  
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

  // Carregar dados da campanha se for edição
  useEffect(() => {
    if (id && user) {
      loadExistingCampaign()
    }
  }, [id, user])

  const loadExistingCampaign = async () => {
    if (!id) return
    
    setLoadingCampaign(true)
    try {
      // Buscar dados da campanha
      const { data: campanhaData, error: campanhaError } = await supabase
        .from('campanhas')
        .select('*')
        .eq('id', id)
        .single()

      if (campanhaError) throw campanhaError

      // Buscar configuração da campanha
      const { data: configData, error: configError } = await supabase
        .from('campanha_configuracao')
        .select('*')
        .eq('campanha_id', id)
        .single()

      if (configError) throw configError

      // Popular os estados com os dados carregados
      setCampaignName(campanhaData.nome)
      setTrechoPergunta(configData.trecho_pergunta || "")
      setRecomendacao(configData.recomendacao || "")
      setAutorizacao(configData.autorizacao || "")
      setOQueAgradou(configData.o_que_agradou || "")
      setSetoresHospital(configData.setores_selecionados || [])
      setBannerUrl(configData.banner_url || "")
      
      // Popular outros dados do JSON
      const layoutEnvio = configData.layout_envio as any || {}
      setAssuntoEmail(layoutEnvio.assuntoEmail || "")
      setMensagemPersonalizada(layoutEnvio.mensagemPersonalizada || "")
      setMensagem(layoutEnvio.mensagem || "Nós valorizamos muito nosso relacionamento e o serviço aos nossos clientes e queremos melhorar a cada dia. Pedimos que você use apenas alguns minutos para nos dar sua sincera opinião sobre sua experiência conosco.")
      setPermitirDescadastro(layoutEnvio.permitirDescadastro ?? true)
      
      // Popular pontos de contato
      if (configData.pontos_contato) {
        setPontosContatoAtivos(true)
        setPontosContato(configData.pontos_contato as any)
      }
      
      // Popular problemas
      if (configData.problemas) {
        setProblemasAtivos(true)
      }
      
      // Popular formulários adicionais
      if (configData.formularios_adicionais) {
        setFormulariosAdicionaisAtivos(true)
        setFormulariosCriados(configData.formularios_adicionais as any)
      }

      console.log('DEBUGGING BANNER - Dados carregados:', {
        banner_url: configData.banner_url,
        layout_envio: configData.layout_envio
      });

      toast.success("Dados da campanha carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao carregar campanha:", error)
      toast.error("Erro ao carregar dados da campanha")
      navigate('/dashboard/campanhas')
    } finally {
      setLoadingCampaign(false)
    }
  }


  const setoresDisponiveis = [
    "AMBULATÓRIO",
    "PRONTO SOCORRO", 
    "UNIDADE DE INTERNAÇÃO",
    "UNIDADE DE TERAPIA INTENSIVA",
    "CENTRO CIRÚRGICO",
    "EXAMES E PROCEDIMENTOS"
  ]

  const handleSetorToggle = (setor: string) => {
    setSetoresHospital(prev => 
      prev.includes(setor) 
        ? prev.filter(item => item !== setor)
        : [...prev, setor]
    )
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
              {isExistingCampaign ? 'Editar' : 'Criar'} Campanha - {getTipoTitle(tipo!)}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Header com nome e data */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {loadingCampaign ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando dados da campanha...</p>
              </div>
            ) : (
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
            )}
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
              {loadingCampaign && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              )}
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="grid w-full grid-rows-7 h-auto">
                  <TabsTrigger value="pergunta-definitiva" className="justify-start">
                    Pergunta Definitiva
                  </TabsTrigger>
                  <TabsTrigger value="pontos-contato" className="justify-start">
                    Pontos de Contato
                  </TabsTrigger>
                  <TabsTrigger value="problemas" className="justify-start">
                    Problemas
                  </TabsTrigger>
                  <TabsTrigger value="formularios-adicionais" className="justify-start">
                    Formulários Adicionais
                  </TabsTrigger>
                  {(tipo === "email" || tipo === "multiple") && (
                    <TabsTrigger value="layout-envio" className="justify-start">
                      Layout de Envio
                    </TabsTrigger>
                  )}
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
                      <Label htmlFor="o-que-agradou">O que mais te agradou em sua experiência conosco? *</Label>
                      <Textarea
                        id="o-que-agradou"
                        value={oQueAgradou}
                        onChange={(e) => setOQueAgradou(e.target.value)}
                        placeholder="Ex: O que mais te chamou atenção durante seu atendimento?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Em qual área do hospital você foi atendido?</Label>
                      <div className="space-y-2 mt-2">
                        {setoresDisponiveis.map((setor) => (
                          <div key={setor} className="flex items-center space-x-2">
                            <Checkbox
                              id={setor}
                              checked={setoresHospital.includes(setor)}
                              onCheckedChange={() => handleSetorToggle(setor)}
                            />
                            <Label
                              htmlFor={setor}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {setor}
                            </Label>
                          </div>
                        ))}
                      </div>
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

                  <TabsContent value="problemas" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        Pergunte aos seus clientes se eles tiveram algum tipo de problema
                      </p>
                      
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Você deseja perguntar aos seus clientes se eles tiveram algum tipo de problema?
                        </Label>
                        
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="problemas-sim"
                              checked={problemasAtivos}
                              onCheckedChange={(checked) => setProblemasAtivos(checked as boolean)}
                            />
                            <Label htmlFor="problemas-sim" className="cursor-pointer">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="problemas-nao"
                              checked={!problemasAtivos}
                              onCheckedChange={(checked) => setProblemasAtivos(!(checked as boolean))}
                            />
                            <Label htmlFor="problemas-nao" className="cursor-pointer">
                              Não
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="formularios-adicionais" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        Crie formulários para pedir mais detalhes sobre as respostas de seus clientes
                      </p>
                      
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Você gostaria de fazer perguntas adicionais aos seus clientes?
                        </Label>
                        
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="formularios-sim"
                              checked={formulariosAdicionaisAtivos}
                              onCheckedChange={(checked) => setFormulariosAdicionaisAtivos(checked as boolean)}
                            />
                            <Label htmlFor="formularios-sim" className="cursor-pointer">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="formularios-nao"
                              checked={!formulariosAdicionaisAtivos}
                              onCheckedChange={(checked) => setFormulariosAdicionaisAtivos(!(checked as boolean))}
                            />
                            <Label htmlFor="formularios-nao" className="cursor-pointer">
                              Não
                            </Label>
                          </div>
                        </div>
                        
                        {formulariosAdicionaisAtivos && (
                          <div className="mt-4">
                            <NovoFormularioModal onSave={(formulario) => setFormulariosCriados(prev => [...prev, formulario])}>
                              <Button variant="outline" className="w-full">
                                + Novo formulário
                              </Button>
                            </NovoFormularioModal>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="layout-envio" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        O que seu cliente vai receber
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="assunto-email">Assunto do email</Label>
                          <Input
                            id="assunto-email"
                            value={assuntoEmail}
                            onChange={(e) => setAssuntoEmail(e.target.value)}
                            placeholder="Digite o assunto do email"
                          />
                        </div>

                        <div>
                          <Label htmlFor="banner-upload">Banner da campanha</Label>
                          <div className="mt-2">
                            <Input
                              id="banner-upload"
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file && selectedHospital) {
                                  try {
                                    // Upload para o Supabase Storage
                                    const fileExt = file.name.split('.').pop()
                                    const fileName = `${selectedHospital.id}_${Date.now()}.${fileExt}`
                                    
                                     const { data, error } = await supabase.storage
                                       .from('banners')
                                       .upload(fileName, file)
                                     
                                     if (error) throw error
                                     
                                     // Get public URL
                                     const { data: { publicUrl } } = supabase.storage
                                       .from('banners')
                                       .getPublicUrl(fileName)
                                     
                                      console.log('Banner uploaded successfully:', publicUrl)
                                      setBannerUrl(publicUrl)
                                      console.log('Banner URL set no estado:', publicUrl)
                                     toast.success("Banner enviado com sucesso!")
                                  } catch (error) {
                                    console.error('Erro ao fazer upload do banner:', error)
                                    toast.error("Erro ao fazer upload do banner")
                                  }
                                }
                              }}
                            />
                            {bannerUrl && (
                              <div className="mt-2 flex items-center gap-2">
                                <img src={bannerUrl} alt="Banner preview" className="h-20 w-auto rounded" />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBannerUrl("")}
                                >
                                  Remover
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="mensagem-personalizada">Mensagem personalizada (até 144 caracteres)</Label>
                          <Textarea
                            id="mensagem-personalizada"
                            value={mensagemPersonalizada}
                            onChange={(e) => {
                              if (e.target.value.length <= 144) {
                                setMensagemPersonalizada(e.target.value)
                              }
                            }}
                            placeholder="Digite sua mensagem personalizada"
                            rows={3}
                            maxLength={144}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {mensagemPersonalizada.length}/144 caracteres
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="mensagem">Mensagem *</Label>
                          <Textarea
                            id="mensagem"
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Nós valorizamos muito nosso relacionamento e o serviço aos nossos clientes e queremos melhorar a cada dia. Pedimos que você use apenas alguns minutos para nos dar sua sincera opinião sobre sua experiência conosco."
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label className="text-base font-medium">Permitir que o paciente se descadastre das campanhas?</Label>
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="descadastro-sim"
                                checked={permitirDescadastro}
                                onCheckedChange={(checked) => setPermitirDescadastro(checked as boolean)}
                              />
                              <Label htmlFor="descadastro-sim" className="cursor-pointer">
                                Sim
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="descadastro-nao"
                                checked={!permitirDescadastro}
                                onCheckedChange={(checked) => setPermitirDescadastro(!(checked as boolean))}
                              />
                              <Label htmlFor="descadastro-nao" className="cursor-pointer">
                                Não
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  ) : activeTab === "problemas" ? (
                    <ProblemasPreview
                      problemasAtivos={problemasAtivos}
                      nomeHospital={selectedHospital?.nome}
                    />
                  ) : activeTab === "formularios-adicionais" ? (
                    <FormulariosAdicionaisPreview
                      formulariosAdicionaisAtivos={formulariosAdicionaisAtivos}
                      nomeHospital={selectedHospital?.nome}
                      formulariosCriados={formulariosCriados}
                    />
                  ) : activeTab === "layout-envio" ? (
                    <LayoutEnvioPreview
                      bannerUrl={bannerUrl}
                      mensagemPersonalizada={mensagemPersonalizada}
                      mensagem={mensagem}
                      permitirDescadastro={permitirDescadastro}
                      nomeHospital={selectedHospital?.nome}
                    />
                  ) : (
                    <NPSPreview
                      trechoPergunta={trechoPergunta}
                      recomendacao={recomendacao}
                      autorizacao={autorizacao}
                      oQueAgradou={oQueAgradou}
                      setoresHospital={setoresHospital}
                      logoUrl={bannerUrl}
                      nomeHospital={selectedHospital?.nome || "Hospital"}
                      onBannerUpload={(url) => {
                        console.log('Banner URL recebida no CriarCampanha:', url)
                        setBannerUrl(url || "")
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" className="text-muted-foreground">
            Passo 1/2
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              console.log('DEBUGGING BANNER - Banner URL antes de abrir modal:', bannerUrl)
              setShowEnvioModal(true)
            }}
          >
            Passo 2 - incluir envios
          </Button>
        </div>
      </div>

      {/* Modal de Envios */}
        <EnvioModal 
          isOpen={showEnvioModal}
          onClose={() => setShowEnvioModal(false)}
            campaignData={{
              id: isExistingCampaign ? id : undefined,
              nome: campaignName,
              tipo: tipo!,
              perguntaDefinitiva: {
                trechoPergunta,
                recomendacao,
                autorizacao,
                oQueAgradou,
                setoresHospital
              },
              pontosContato: pontosContatoAtivos ? pontosContato : null,
              problemas: problemasAtivos,
              formulariosAdicionais: formulariosAdicionaisAtivos ? formulariosCriados : null,
              layoutEnvio: {
                assuntoEmail,
                bannerUrl,
                mensagemPersonalizada,
                mensagem,
                permitirDescadastro
              },
              bannerUrl // Passar o bannerUrl separadamente para garantir que seja salvo na coluna banner_url
            }}
        />
    </div>
  )
}

export default CriarCampanhaPage