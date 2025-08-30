import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface ProblemasPreviewProps {
  problemasAtivos: boolean
  nomeHospital?: string
}

export const ProblemasPreview = ({ problemasAtivos, nomeHospital }: ProblemasPreviewProps) => {
  if (!problemasAtivos) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/20 rounded-lg">
        <p className="text-muted-foreground text-center">
          Seção de problemas não será utilizada na campanha
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {nomeHospital ? `Hospital ${nomeHospital}` : "Nome do Hospital"}
        </h2>
      </div>

      <Card className="border-2">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Você teve algum problema com a gente?</h3>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button variant="outline" className="px-8">
                SIM
              </Button>
              <Button variant="outline" className="px-8">
                NÃO
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">O que aconteceu?</h4>
              <p className="text-sm text-muted-foreground mb-3">Seus motivos em detalhes</p>
              <Textarea
                placeholder="Descreva o que aconteceu... (máximo 280 caracteres)"
                maxLength={280}
                className="min-h-[100px]"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">0/280 caracteres</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Seu problema foi resolvido?</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  SIM
                </Button>
                <Button variant="outline" size="sm">
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
                    className="w-10 h-10 p-0"
                  >
                    {i}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}