import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CampanhaMetrics } from "@/hooks/useCampanhaMetrics"
import { 
  Mail, 
  Link2, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Star
} from "lucide-react"

interface CampanhaMetricsCardProps {
  metrics: CampanhaMetrics
}

export const CampanhaMetricsCard = ({ metrics }: CampanhaMetricsCardProps) => {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "link": 
        return <Link2 className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "email":
        return "Email"
      case "link":
        return "Link Público"
      default:
        return tipo
    }
  }

  const getNpsColor = (nps: number) => {
    if (nps >= 70) return "text-green-600"
    if (nps >= 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getNpsBadgeVariant = (nps: number): "default" | "secondary" | "destructive" | "outline" => {
    if (nps >= 70) return "default"
    if (nps >= 30) return "secondary"
    return "destructive"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {metrics.campanha_nome}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {getTipoIcon(metrics.tipo_campanha)}
              {getTipoLabel(metrics.tipo_campanha)}
              {!metrics.ativa && (
                <Badge variant="outline" className="text-xs">
                  Inativa
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {new Date(metrics.data_criacao).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Métricas de Envio */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {metrics.total_envios}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total Enviados</p>
          </div>

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {metrics.total_respondidas}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Respondidas</p>
          </div>

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {metrics.aguardando_resposta}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </div>
        </div>

        {/* Taxa de Resposta */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Taxa de Resposta</span>
            </div>
            <span className="text-sm font-bold">
              {metrics.taxa_resposta}%
            </span>
          </div>
          <Progress value={metrics.taxa_resposta} className="h-2" />
        </div>

        {/* NPS Médio */}
        {metrics.nps_medio > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">NPS Médio</span>
            </div>
            <Badge variant={getNpsBadgeVariant(metrics.nps_medio)}>
              <span className={getNpsColor(metrics.nps_medio)}>
                {metrics.nps_medio}
              </span>
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}