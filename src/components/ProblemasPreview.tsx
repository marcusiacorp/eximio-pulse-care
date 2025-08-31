import React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { getScaleColor } from "@/lib/utils"

interface ProblemasPreviewProps {
  problemasAtivos: boolean
  nomeHospital?: string
  isPublicMode?: boolean
  onResponse?: (data: any) => void
}

export const ProblemasPreview = ({ problemasAtivos, nomeHospital, isPublicMode = false, onResponse }: ProblemasPreviewProps) => {
  const [teveProblema, setTeveProblema] = React.useState<boolean | null>(null)
  const [descricaoProblema, setDescricaoProblema] = React.useState("")
  const [problemaResolvido, setProblemaResolvido] = React.useState<boolean | null>(null)
  const [notaAtendimento, setNotaAtendimento] = React.useState<number | null>(null)

  // Enviar dados para o parent via callback
  const enviarResposta = () => {
    if (onResponse) {
      onResponse({
        problemas: {
          teve_problema: teveProblema,
          descricao: descricaoProblema,
          foi_resolvido: problemaResolvido,
          nota_atendimento: notaAtendimento
        }
      })
    }
  }

  // Chamar callback quando dados mudarem (para modo público)
  React.useEffect(() => {
    if (isPublicMode) {
      enviarResposta()
    }
  }, [teveProblema, descricaoProblema, problemaResolvido, notaAtendimento])
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
          {nomeHospital || "Nome do Hospital"}
        </h2>
      </div>

      <Card className="border-2">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Você teve algum problema com a gente?</h3>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button 
                variant={teveProblema === true ? "default" : "outline"} 
                className="px-8" 
                disabled={!problemasAtivos}
                onClick={() => setTeveProblema(true)}
              >
                SIM
              </Button>
              <Button 
                variant={teveProblema === false ? "default" : "outline"} 
                className="px-8" 
                disabled={!problemasAtivos}
                onClick={() => setTeveProblema(false)}
              >
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
                disabled={!problemasAtivos}
                value={descricaoProblema}
                onChange={(e) => setDescricaoProblema(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">{descricaoProblema.length}/280 caracteres</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Seu problema foi resolvido?</h4>
              <div className="flex gap-4">
                <Button 
                  variant={problemaResolvido === true ? "default" : "outline"} 
                  size="sm" 
                  disabled={!problemasAtivos}
                  onClick={() => setProblemaResolvido(true)}
                >
                  SIM
                </Button>
                <Button 
                  variant={problemaResolvido === false ? "default" : "outline"} 
                  size="sm" 
                  disabled={!problemasAtivos}
                  onClick={() => setProblemaResolvido(false)}
                >
                  NÃO
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Qual a sua nota para a forma com que você foi atendido?</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    className={`
                      w-10 h-10 rounded-full text-sm font-medium
                      ${getScaleColor(i, notaAtendimento === i, !problemasAtivos)}
                    `}
                    disabled={!problemasAtivos}
                    onClick={() => setNotaAtendimento(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}