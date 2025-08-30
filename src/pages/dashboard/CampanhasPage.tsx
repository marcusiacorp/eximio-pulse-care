import { useState } from "react"
import { Plus, Mail, Link, Network, Zap, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CampanhasPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    console.log("Tipo de campanha selecionado:", typeId)
    setIsDialogOpen(false)
    // Aqui será implementada a lógica para criar a campanha do tipo selecionado
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
            <CardDescription>
              Você ainda não possui campanhas criadas. Clique em "Nova Campanha" para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Network className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhuma campanha encontrada</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CampanhasPage