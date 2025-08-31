import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Mail, Link, Network, Zap, QrCode, ExternalLink, Calendar, BarChart3, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useHospital } from "@/contexts/HospitalContext"
import { toast } from "sonner"

interface Campanha {
  id: string
  nome: string
  tipo_campanha: string
  data_criacao: string
  ativa: boolean
  link_campanha?: string
}

const CampanhasPage = () => {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedHospital } = useHospital()

  useEffect(() => {
    carregarCampanhas()
  }, [selectedHospital])

  const carregarCampanhas = async () => {
    if (!selectedHospital?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .eq('hospital_id', selectedHospital.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar campanhas:', error)
        toast.error('Erro ao carregar campanhas')
      } else {
        setCampanhas(data || [])
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro inesperado ao carregar campanhas')
    } finally {
      setLoading(false)
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return Mail
      case 'link': return Link
      case 'embed': return QrCode
      case 'multiple': return Network
      default: return Network
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'email': return 'E-mail'
      case 'link': return 'Link'
      case 'embed': return 'Embed'
      case 'multiple': return 'Múltiplos canais'
      default: return tipo
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleAbrirLink = (linkCampanha: string) => {
    window.open(linkCampanha, '_blank')
  }

  const campaignTypes = [
    {
      id: "email",
      title: "E-mail",
      description: "Mais utilizado e com altas taxas de respostas",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "link",
      title: "Link",
      description: "Gere links e QR codes de suas pesquisas",
      icon: Link,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "embed",
      title: "Implantar no meu site / software",
      description: "Indicado para e-commerce, aplicativos, SASS com área logada e similares.",
      icon: QrCode,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "multiple",
      title: "Múltiplos canais",
      description: "Sua pesquisa poderá ser enviada por email, sms, whatsapp e envio próprio ao mesmo tempo",
      icon: Network,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "custom",
      title: "Envio próprio",
      description: "Use sua própria ferramenta de envio utilizando nossa api.",
      icon: Zap,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      disabled: true,
    },
  ]

  const handleCampaignTypeSelect = (typeId: string) => {
    setIsDialogOpen(false)
    navigate(`/dashboard/campanhas/criar/${typeId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas de pesquisa NPS
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Criar pesquisa</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {campaignTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/20 ${
                    type.disabled ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !type.disabled && handleCampaignTypeSelect(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${type.bgColor}`}>
                        <type.icon className={`h-6 w-6 ${type.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">{type.title}</h3>
                          {type.disabled && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Não integrado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de campanhas existentes */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suas Campanhas</CardTitle>
            {!selectedHospital ? (
              <CardDescription>
                Selecione um hospital para visualizar as campanhas.
              </CardDescription>
            ) : loading ? (
              <CardDescription>
                Carregando campanhas...
              </CardDescription>
            ) : campanhas.length === 0 ? (
              <CardDescription>
                Você ainda não possui campanhas criadas. Clique em "Nova Campanha" para começar.
              </CardDescription>
            ) : (
              <CardDescription>
                {campanhas.length} campanha(s) encontrada(s) para {selectedHospital.nome}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando campanhas...</p>
              </div>
            ) : campanhas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Network className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhuma campanha encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campanhas.map((campanha) => {
                  const TipoIcon = getTipoIcon(campanha.tipo_campanha)
                  return (
                    <div key={campanha.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-muted">
                          <TipoIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{campanha.nome}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Criada em {formatarData(campanha.data_criacao)}</span>
                            <Badge variant={campanha.ativa ? "default" : "secondary"}>
                              {campanha.ativa ? "Ativa" : "Inativa"}
                            </Badge>
                            <Badge variant="outline">
                              {getTipoLabel(campanha.tipo_campanha)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/campanhas/criar/${campanha.tipo_campanha}/${campanha.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        {campanha.link_campanha && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirLink(campanha.link_campanha!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Abrir Link
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/campanhas/${campanha.id}/resultados`)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Resultados
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CampanhasPage