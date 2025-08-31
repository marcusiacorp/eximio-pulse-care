import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getScaleColor } from "@/lib/utils"

interface PerguntaPadraoPreviewProps {
  boasVindas: string
  bannerPadraoUrl: string
  hospitalName?: string
  isPublicMode?: boolean
  onResponse?: (respostaData: any) => void
}

export const PerguntaPadraoPreview = ({
  boasVindas,
  bannerPadraoUrl,
  hospitalName = "Hospital",
  isPublicMode = false,
  onResponse
}: PerguntaPadraoPreviewProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSetor, setSelectedSetor] = useState<string>("")
  
  // Respostas das perguntas padrão
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [oQueAgradou, setOQueAgradou] = useState("")
  const [areasAtendimento, setAreasAtendimento] = useState<string[]>([])
  
  // Respostas específicas por setor
  const [avaliacaoSetor, setAvaliacaoSetor] = useState<number | null>(null)
  const [satisfacaoSetor, setSatisfacaoSetor] = useState("")
  const [influencias, setInfluencias] = useState<string[]>([])
  const [sugestoes, setSugestoes] = useState("")

  const setoresDisponiveis = ["Pronto Socorro", "Ambulatório", "Unidade de Internação"]
  const areasHospital = [
    "Ambulatório",
    "Pronto Socorro", 
    "Unidade de Internação",
    "Unidade de Terapia Intensiva",
    "Centro Cirúrgico",
    "Exames e procedimentos"
  ]
  
  const opcoesInfluencia = [
    "Atendimento da equipe médica",
    "Atendimento prestado pelas equipes de apoio, como enfermagem, recepção e demais setores",
    "Comunicação e informações recebidas",
    "Tempos de espera",
    "Resolução do Problema",
    "Estrutura e Conforto",
    "Higiene e Limpeza"
  ]

  const handleAreaToggle = (area: string) => {
    setAreasAtendimento(prev => 
      prev.includes(area) 
        ? prev.filter(item => item !== area)
        : [...prev, area]
    )
  }

  const handleInfluenciaToggle = (opcao: string) => {
    setInfluencias(prev => 
      prev.includes(opcao) 
        ? prev.filter(item => item !== opcao)
        : [...prev, opcao]
    )
  }

  const handleNextStep = () => {
    if (currentStep === 0 && areasAtendimento.length > 0) {
      // Determinar o setor principal baseado na seleção
      const setorPrincipal = setoresDisponiveis.find(setor => 
        areasAtendimento.includes(setor)
      )
      if (setorPrincipal) {
        setSelectedSetor(setorPrincipal)
        setCurrentStep(1)
      }
    } else if (currentStep === 1) {
      // Enviar resposta final
      const respostaCompleta = {
        perguntasPadrao: {
          npsScore,
          oQueAgradou,
          areasAtendimento
        },
        perguntasSetor: {
          setor: selectedSetor,
          avaliacaoSetor,
          satisfacaoSetor,
          influencias,
          sugestoes
        }
      }
      
      if (onResponse) {
        onResponse(respostaCompleta)
      }
    }
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return npsScore !== null && oQueAgradou.trim() !== "" && areasAtendimento.length > 0
    }
    if (currentStep === 1) {
      return avaliacaoSetor !== null && satisfacaoSetor.trim() !== "" && sugestoes.trim() !== ""
    }
    return false
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background">
      {/* Banner e Boas Vindas */}
      <div className="mb-8">
        {bannerPadraoUrl && (
          <div className="mb-6">
            <img
              src={bannerPadraoUrl}
              alt="Banner do hospital"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{hospitalName}</h1>
          {boasVindas && (
            <p className="text-muted-foreground">{boasVindas}</p>
          )}
        </div>
      </div>

      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pergunta NPS */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                De 0 a 10, o quanto você recomendaria o {hospitalName} para amigos e familiares?
              </Label>
              
              <div className="grid grid-cols-11 gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setNpsScore(i)}
                    className={`
                      w-12 h-12 rounded-full font-bold text-sm cursor-pointer
                      ${getScaleColor(i, npsScore === i, false)}
                    `}
                    disabled={!isPublicMode}
                  >
                    {i}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Não recomendaria</span>
                <span>Recomendaria totalmente</span>
              </div>
            </div>

            <Separator />

            {/* O que agradou */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                O que mais te agradou em sua experiência conosco?
              </Label>
              <Textarea
                value={oQueAgradou}
                onChange={(e) => setOQueAgradou(e.target.value)}
                placeholder="Conte-nos sobre sua experiência..."
                rows={3}
                disabled={!isPublicMode}
              />
            </div>

            <Separator />

            {/* Áreas de atendimento */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Em qual área do hospital você foi atendido?
              </Label>
              <div className="space-y-2">
                {areasHospital.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={areasAtendimento.includes(area)}
                      onCheckedChange={() => handleAreaToggle(area)}
                      disabled={!isPublicMode}
                    />
                    <Label htmlFor={area} className="cursor-pointer">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {isPublicMode && (
              <Button 
                onClick={handleNextStep} 
                className="w-full mt-6"
                disabled={!canProceed()}
              >
                Continuar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && selectedSetor && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Específica - {selectedSetor}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avaliação do setor */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                De 0 a 10, como você avalia sua experiência durante seu atendimento no {selectedSetor}?
              </Label>
              
              <div className="grid grid-cols-11 gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setAvaliacaoSetor(i)}
                    className={`
                      w-12 h-12 rounded-full font-bold text-sm cursor-pointer
                      ${getScaleColor(i, avaliacaoSetor === i, false)}
                    `}
                    disabled={!isPublicMode}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Satisfação */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?
              </Label>
              <Textarea
                value={satisfacaoSetor}
                onChange={(e) => setSatisfacaoSetor(e.target.value)}
                placeholder="Compartilhe o que mais contribuiu para sua satisfação..."
                rows={3}
                disabled={!isPublicMode}
              />
            </div>

            <Separator />

            {/* Influências */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                O que mais influenciou sua experiência no hospital?
              </Label>
              <div className="space-y-2">
                {opcoesInfluencia.map((opcao) => (
                  <div key={opcao} className="flex items-center space-x-2">
                    <Checkbox
                      id={opcao}
                      checked={influencias.includes(opcao)}
                      onCheckedChange={() => handleInfluenciaToggle(opcao)}
                      disabled={!isPublicMode}
                    />
                    <Label htmlFor={opcao} className="cursor-pointer text-sm">
                      {opcao}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sugestões */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.
              </Label>
              <Textarea
                value={sugestoes}
                onChange={(e) => setSugestoes(e.target.value)}
                placeholder="Suas sugestões são muito importantes para nós..."
                rows={3}
                disabled={!isPublicMode}
              />
            </div>

            {isPublicMode && (
              <Button 
                onClick={handleNextStep} 
                className="w-full mt-6"
                disabled={!canProceed()}
              >
                Finalizar Avaliação
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}