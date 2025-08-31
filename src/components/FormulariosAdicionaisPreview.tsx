import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormulariosAdicionaisPreviewProps {
  formulariosAdicionaisAtivos: boolean
  nomeHospital?: string
  formulariosCriados?: any[]
  isPublicMode?: boolean
  onResponse?: (data: any) => void
}

export const FormulariosAdicionaisPreview = ({ 
  formulariosAdicionaisAtivos, 
  nomeHospital,
  formulariosCriados = [],
  isPublicMode = false,
  onResponse
}: FormulariosAdicionaisPreviewProps) => {
  return (
    <Card className={`w-full max-w-2xl mx-auto ${!formulariosAdicionaisAtivos ? 'opacity-50 grayscale' : ''}`}>
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {nomeHospital || "Nome do Hospital"}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Informações adicionais
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conte-nos um pouco mais de como foi sua experiencia com o produto ou serviço.
            </p>
          </div>

          {formulariosCriados.length > 0 ? (
            <div className="space-y-4">
              {formulariosCriados.map((formulario, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {formulario.pergunta}
                    {formulario.obrigatorio && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {formulario.descricao && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {formulario.descricao}
                    </p>
                  )}
                  
                  {formulario.tipo === "multiplas-opcoes" ? (
                    <RadioGroup disabled={!formulariosAdicionaisAtivos}>
                      {formulario.opcoes.map((opcao: string, opcaoIndex: number) => (
                        <div key={opcaoIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={opcao} />
                          <Label className="text-sm">{opcao}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Textarea
                      placeholder="Sua resposta..."
                      className="w-full min-h-[80px] resize-none"
                      disabled={!formulariosAdicionaisAtivos}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="experiencia" className="text-sm font-medium">
                Sua experiência:
              </Label>
              <Textarea
                id="experiencia"
                placeholder="Descreva sua experiência..."
                className="w-full min-h-[120px] resize-none"
                disabled={!formulariosAdicionaisAtivos}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}