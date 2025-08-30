import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LayoutEnvioPreviewProps {
  assuntoEmail: string
  bannerUrl: string
  mensagemPersonalizada: string
  permitirDescadastro: boolean
  nomeHospital?: string
}

export const LayoutEnvioPreview = ({
  assuntoEmail,
  bannerUrl,
  mensagemPersonalizada,
  permitirDescadastro,
  nomeHospital
}: LayoutEnvioPreviewProps) => {
  const textoPadrao = "Nós valorizamos muito nosso relacionamento e o serviço aos nossos clientes e queremos melhorar a cada dia. Pedimos que você use apenas alguns minutos para nos dar sua sincera opinião sobre sua experiência conosco."

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preview do Email</h3>
      </div>

      {/* Email mockup */}
      <Card className="max-w-md mx-auto bg-background border">
        <CardHeader className="text-center pb-2">
          <div className="text-sm text-muted-foreground">
            <strong>De:</strong> {nomeHospital || "[Nome do Hospital]"} &lt;pesquisa@hospital.com.br&gt;
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Assunto:</strong> {assuntoEmail || "Digite o assunto do email"}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Banner */}
          {bannerUrl ? (
            <div className="text-center">
              <img 
                src={bannerUrl} 
                alt="Banner da campanha" 
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ) : (
            <div className="bg-muted h-24 rounded flex items-center justify-center text-muted-foreground text-sm">
              [Banner da campanha]
            </div>
          )}

          {/* Mensagem personalizada */}
          {mensagemPersonalizada && (
            <div className="text-sm text-foreground p-3 bg-primary/5 rounded">
              {mensagemPersonalizada}
            </div>
          )}

          {/* Texto padrão */}
          <div className="text-sm text-muted-foreground">
            {textoPadrao}
          </div>

          {/* Botão de ação */}
          <div className="text-center py-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Responder Pesquisa
            </Button>
          </div>

          {/* Link de descadastro */}
          {permitirDescadastro && (
            <div className="text-center text-xs text-muted-foreground border-t pt-2">
              <p>Não deseja mais receber nossas pesquisas?</p>
              <a href="#" className="text-primary hover:underline">
                Clique aqui para se descadastrar
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}