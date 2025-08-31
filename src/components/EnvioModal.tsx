import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Upload, Copy, QrCode } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useHospital } from "@/contexts/HospitalContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import QRCode from "qrcode"

interface CampanhaData {
  nome: string
  tipo: string
  perguntaDefinitiva: any
  pontosContato: any
  problemas: any
  formulariosAdicionais: any
  layoutEnvio: {
    assuntoEmail: string
    bannerUrl: string
    mensagemPersonalizada: string
    mensagem: string
    permitirDescadastro: boolean
  }
}

interface EnvioModalProps {
  isOpen: boolean
  onClose: () => void
  campanha: CampanhaData
}

interface Paciente {
  id: string
  nome: string
  email: string
  telefone: string
}

export function EnvioModal({ isOpen, onClose, campanha }: EnvioModalProps) {
  const [activeTab, setActiveTab] = useState("selecionar")
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [selectedPacientes, setSelectedPacientes] = useState<string[]>([])
  const [novoPaciente, setNovoPaciente] = useState({ nome: "", email: "", telefone: "" })
  const [loading, setLoading] = useState(false)
  const [campanhaId, setCampanhaId] = useState<string>("")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const { selectedHospital } = useHospital()
  const { user } = useAuth()

  // Gerar link da campanha
  const linkCampanha = campanhaId ? `${window.location.origin}/pesquisa/${campanhaId}` : ""

  // Salvar campanha e gerar QR code para campanhas do tipo link
  const handleSalvarCampanha = async () => {
    if (!selectedHospital || !user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("campanhas")
        .insert({
          nome: campanha.nome,
          tipo_campanha: campanha.tipo,
          hospital_id: selectedHospital.id,
          usuario_id: user.id,
          ativa: false
        })
        .select()
        .single()

      if (error) throw error

      setCampanhaId(data.id)

      // Salvar configuração da campanha
      const { error: configError } = await supabase
        .from("campanha_configuracao")
        .insert({
          campanha_id: data.id,
          pontos_contato: campanha.pontosContato,
          problemas: campanha.problemas,
          formularios_adicionais: campanha.formulariosAdicionais,
          layout_envio: campanha.layoutEnvio
        })

      if (configError) throw configError

      // Gerar QR code para campanhas do tipo link
      if (campanha.tipo === 'link') {
        const link = `${window.location.origin}/pesquisa/${data.id}`
        const qrCodeDataUrl = await QRCode.toDataURL(link, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          }
        })
        setQrCodeUrl(qrCodeDataUrl)
      }

      toast.success("Campanha salva com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar campanha:", error)
      toast.error("Erro ao salvar campanha")
    } finally {
      setLoading(false)
    }
  }

  // Copiar link para clipboard
  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkCampanha)
      toast.success("Link copiado para a área de transferência!")
    } catch (error) {
      toast.error("Erro ao copiar link")
    }
  }

  // Carregar pacientes ao abrir o modal (apenas para campanhas que não são do tipo link)
  const loadPacientes = async () => {
    if (!selectedHospital) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("hospital_id", selectedHospital.id)
        .order("nome")

      if (error) throw error
      setPacientes(data || [])
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error)
      toast.error("Erro ao carregar pacientes")
    } finally {
      setLoading(false)
    }
  }

  // Cadastrar novo paciente
  const handleCadastrarPaciente = async () => {
    if (!novoPaciente.nome || !novoPaciente.email) {
      toast.error("Nome e email são obrigatórios")
      return
    }

    if (!selectedHospital) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .insert({
          nome: novoPaciente.nome,
          email: novoPaciente.email,
          telefone: novoPaciente.telefone,
          hospital_id: selectedHospital.id
        })
        .select()
        .single()

      if (error) throw error

      setPacientes([...pacientes, data])
      setNovoPaciente({ nome: "", email: "", telefone: "" })
      toast.success("Paciente cadastrado com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error)
      toast.error("Erro ao cadastrar paciente")
    } finally {
      setLoading(false)
    }
  }

  // Deletar paciente
  const handleDeletarPaciente = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("pacientes")
        .delete()
        .eq("id", id)

      if (error) throw error

      setPacientes(pacientes.filter(p => p.id !== id))
      setSelectedPacientes(selectedPacientes.filter(pId => pId !== id))
      toast.success("Paciente removido com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar paciente:", error)
      toast.error("Erro ao deletar paciente")
    } finally {
      setLoading(false)
    }
  }

  // Processar planilha
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      
      // Validar se tem pelo menos nome e email
      if (lines.length < 2) {
        toast.error("Planilha deve conter pelo menos cabeçalho e uma linha de dados")
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const nomeIndex = headers.findIndex(h => h.includes('nome'))
      const emailIndex = headers.findIndex(h => h.includes('email'))
      
      if (nomeIndex === -1 || emailIndex === -1) {
        toast.error("Planilha deve conter colunas 'nome' e 'email'")
        return
      }

      const telefoneIndex = headers.findIndex(h => h.includes('telefone'))

      // Processar dados
      const novosPacientes: Omit<Paciente, 'id'>[] = []
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',')
        if (row.length >= 2 && row[nomeIndex] && row[emailIndex]) {
          novosPacientes.push({
            nome: row[nomeIndex].trim(),
            email: row[emailIndex].trim(),
            telefone: telefoneIndex >= 0 ? row[telefoneIndex]?.trim() || "" : ""
          })
        }
      }

      // Inserir pacientes em lote
      insertPacientesLote(novosPacientes)
    }
    
    reader.readAsText(file)
  }

  // Inserir pacientes em lote
  const insertPacientesLote = async (novosPacientes: Omit<Paciente, 'id'>[]) => {
    if (!selectedHospital) return

    setLoading(true)
    try {
      const pacientesComHospital = novosPacientes.map(p => ({
        ...p,
        hospital_id: selectedHospital.id
      }))

      const { data, error } = await supabase
        .from("pacientes")
        .insert(pacientesComHospital)
        .select()

      if (error) throw error

      setPacientes([...pacientes, ...data])
      toast.success(`${data.length} pacientes adicionados com sucesso!`)
    } catch (error) {
      console.error("Erro ao inserir pacientes:", error)
      toast.error("Erro ao processar planilha")
    } finally {
      setLoading(false)
    }
  }

  // Enviar pesquisa
  const handleEnviarPesquisa = async () => {
    if (selectedPacientes.length === 0) {
      toast.error("Selecione pelo menos um paciente")
      return
    }

    // Aqui implementaremos o envio da pesquisa
    toast.success(`Pesquisa será enviada para ${selectedPacientes.length} pacientes`)
    onClose()
  }

  // Carregar pacientes ao abrir modal para campanhas que não são do tipo link
  useEffect(() => {
    if (isOpen && campanha.tipo !== 'link') {
      loadPacientes()
    }
  }, [isOpen, campanha.tipo])

  // Se for campanha do tipo link, mostrar interface diferente
  if (campanha.tipo === 'link') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Link da Pesquisa - {campanha.nome}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Envie o mesmo link para diversos clientes. Eles podem se cadastrar ou não dependendo da sua configuração.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p>Gerando link da campanha...</p>
              </div>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label>Link da Pesquisa</Label>
                      <div className="flex gap-2 mt-2">
                        <Input 
                          value={linkCampanha} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button 
                          onClick={handleCopiarLink}
                          variant="outline"
                          size="icon"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {qrCodeUrl && (
                      <div className="text-center space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Use este QR Code em seus projetos</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ideal para utilizar em qualquer tipo de material impresso.
                          </p>
                          <div className="flex justify-center">
                            <img src={qrCodeUrl} alt="QR Code da pesquisa" className="border rounded" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={onClose}>
                    Acompanhar Envios
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Envio da Pesquisa - {campanha.nome}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="selecionar">Selecionar Pessoas</TabsTrigger>
            <TabsTrigger value="cadastrar">Cadastrar Pessoas</TabsTrigger>
            <TabsTrigger value="planilha">Incluir Planilha</TabsTrigger>
          </TabsList>

          <TabsContent value="selecionar" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pacientes Cadastrados</h3>
              <Button onClick={loadPacientes} disabled={loading}>
                {loading ? "Carregando..." : "Atualizar Lista"}
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input 
                          type="checkbox"
                          checked={selectedPacientes.length === pacientes.length && pacientes.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPacientes(pacientes.map(p => p.id))
                            } else {
                              setSelectedPacientes([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pacientes.map((paciente) => (
                      <TableRow key={paciente.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPacientes.includes(paciente.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPacientes([...selectedPacientes, paciente.id])
                              } else {
                                setSelectedPacientes(selectedPacientes.filter(id => id !== paciente.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{paciente.nome}</TableCell>
                        <TableCell>{paciente.email}</TableCell>
                        <TableCell>{paciente.telefone || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletarPaciente(paciente.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pacientes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum paciente cadastrado. Use a aba "Cadastrar Pessoas" para adicionar.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cadastrar" className="space-y-4">
            <h3 className="text-lg font-semibold">Cadastrar Novo Paciente</h3>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoPaciente.nome}
                    onChange={(e) => setNovoPaciente({...novoPaciente, nome: e.target.value})}
                    placeholder="Nome completo do paciente"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoPaciente.email}
                    onChange={(e) => setNovoPaciente({...novoPaciente, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novoPaciente.telefone}
                    onChange={(e) => setNovoPaciente({...novoPaciente, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <Button 
                  onClick={handleCadastrarPaciente}
                  disabled={loading || !novoPaciente.nome || !novoPaciente.email}
                >
                  {loading ? "Cadastrando..." : "Cadastrar Paciente"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planilha" className="space-y-4">
            <h3 className="text-lg font-semibold">Importar Planilha CSV</h3>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="text-sm text-muted-foreground">
                  <p>A planilha deve conter as colunas: <strong>nome</strong> e <strong>email</strong> (obrigatórias)</p>
                  <p>Opcionalmente pode conter: <strong>telefone</strong></p>
                  <p>Formato aceito: CSV separado por vírgulas</p>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      Selecionar Arquivo CSV
                    </div>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedPacientes.length} pacientes selecionados
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEnviarPesquisa}
              disabled={selectedPacientes.length === 0 || loading}
              className="bg-primary"
            >
              Enviar Pesquisa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}