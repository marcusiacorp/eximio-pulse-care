import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface ProblemasPreviewProps {
  problemasAtivos: boolean
  nomeHospital?: string
}

export const ProblemasPreview = ({ problemasAtivos, nomeHospital }: ProblemasPreviewProps) => {
  return (
    <div className={`space-y-6 p-4 ${!problemasAtivos ? 'opacity-50 grayscale' : ''}`}>
      {!problemasAtivos && (
        <div className="bg-muted/50 border border-dashed rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground text-center">
            Seção de problemas não será utilizada na campanha
          </p>
        </div>
      )}
      
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
              <Button variant="outline" className="px-8" disabled={!problemasAtivos}>
                SIM
              </Button>
              <Button variant="outline" className="px-8" disabled={!problemasAtivos}>
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
                <Button variant="outline" size="sm" disabled={!problemasAtivos}>
                  SIM
                </Button>
                <Button variant="outline" size="sm" disabled={!problemasAtivos}>
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
                    disabled={!problemasAtivos}
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