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
import { useCampanhaMetrics, useCampanhasByTypeMetrics } from "@/hooks/useCampanhaMetrics"
import { CampanhaMetricsCard } from "@/components/CampanhaMetricsCard"
import { ResultadosDetalhados } from "@/components/ResultadosDetalhados"

const CampanhasPage = () => {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [resultadosModalOpen, setResultadosModalOpen] = useState(false)
  const [campanhaIdSelecionada, setCampanhaIdSelecionada] = useState<string | null>(null)
  const { selectedHospital } = useHospital()
  
  // Usar o hook para buscar métricas das campanhas
  const { 
    data: campanhasMetrics, 
    isLoading: loadingMetrics, 
    error: errorMetrics 
  } = useCampanhaMetrics(selectedHospital?.id)
  
  const { 
    data: typeMetrics, 
    isLoading: loadingTypeMetrics 
  } = useCampanhasByTypeMetrics(selectedHospital?.id)

  useEffect(() => {
    if (errorMetrics) {
      console.error('Erro ao carregar métricas:', errorMetrics)
      toast.error('Erro ao carregar métricas das campanhas')
    }
  }, [errorMetrics])

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

  const handleAbrirResultados = (campanhaId: string) => {
    setCampanhaIdSelecionada(campanhaId)
    setResultadosModalOpen(true)
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

      {/* Métricas consolidadas por tipo */}
      {typeMetrics && typeMetrics.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Resumo por Tipo de Campanha</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeMetrics.map((type) => (
              <Card key={type.tipo_campanha}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getTipoIcon(type.tipo_campanha) && (() => {
                      const IconComponent = getTipoIcon(type.tipo_campanha)
                      return <IconComponent className="h-4 w-4" />
                    })()}
                    {getTipoLabel(type.tipo_campanha)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Campanhas</p>
                      <p className="font-semibold">{type.total_campanhas}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Envios</p>
                      <p className="font-semibold">{type.total_envios}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Respostas</p>
                      <p className="font-semibold">{type.total_respondidas}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taxa</p>
                      <p className="font-semibold">{type.taxa_resposta_media}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lista detalhada de campanhas com métricas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Campanhas Detalhadas</h2>
          {campanhasMetrics && (
            <p className="text-sm text-muted-foreground">
              {campanhasMetrics.length} campanha(s) encontrada(s)
            </p>
          )}
        </div>
        
        {!selectedHospital ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                Selecione um hospital para visualizar as campanhas.
              </p>
            </CardContent>
          </Card>
        ) : loadingMetrics ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando métricas das campanhas...</p>
              </div>
            </CardContent>
          </Card>
        ) : !campanhasMetrics || campanhasMetrics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
              <Network className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Nenhuma campanha encontrada
                </p>
                <p className="text-sm text-muted-foreground">
                  Clique em "Nova Campanha" para começar
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campanhasMetrics.map((metrics) => (
              <div key={metrics.campanha_id} className="relative">
                <CampanhaMetricsCard metrics={metrics} />
                
                {/* Botões de ação sobrepostos */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/campanhas/criar/${metrics.tipo_campanha}/${metrics.campanha_id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAbrirResultados(metrics.campanha_id)}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Resultados
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Resultados Detalhados */}
      <ResultadosDetalhados
        campanhaId={campanhaIdSelecionada}
        isOpen={resultadosModalOpen}
        onClose={() => {
          setResultadosModalOpen(false)
          setCampanhaIdSelecionada(null)
        }}
      />
    </div>
  )
}

export default CampanhasPage