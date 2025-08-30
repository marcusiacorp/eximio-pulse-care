import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormulariosAdicionaisPreviewProps {
  formulariosAdicionaisAtivos: boolean
  nomeHospital?: string
}

export const FormulariosAdicionaisPreview = ({ 
  formulariosAdicionaisAtivos, 
  nomeHospital 
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
        </div>
      </CardContent>
    </Card>
  )
}