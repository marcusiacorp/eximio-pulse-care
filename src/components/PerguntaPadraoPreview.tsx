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
  const [selectedSetor, setSelectedSetor] = useState<string>("Pronto Socorro")
  
  // Respostas das perguntas padrão por setor
  const [npsScorePadrao, setNpsScorePadrao] = useState<number | null>(null)
  const [oQueAgradouPadrao, setOQueAgradouPadrao] = useState("")
  
  // Respostas direcionadas por setor
  const [avaliacaoSetor, setAvaliacaoSetor] = useState<number | null>(null)
  const [satisfacaoSetor, setSatisfacaoSetor] = useState("")
  const [influencias, setInfluencias] = useState<string[]>([])
  const [sugestoes, setSugestoes] = useState("")

  const setoresDisponiveis = ["Pronto Socorro", "Ambulatório", "Unidade de Internação"]
  
  const opcoesInfluencia = [
    "Atendimento da equipe médica",
    "Atendimento prestado pelas equipes de apoio, como enfermagem, recepção e demais setores",
    "Comunicação e informações recebidas",
    "Tempos de espera",
    "Resolução do Problema",
    "Estrutura e Conforto",
    "Higiene e Limpeza"
  ]

  const handleSetorChange = (setor: string) => {
    setSelectedSetor(setor)
    // Reset das respostas quando trocar de setor
    setNpsScorePadrao(null)
    setOQueAgradouPadrao("")
    setAvaliacaoSetor(null)
    setSatisfacaoSetor("")
    setInfluencias([])
    setSugestoes("")
  }

  const handleInfluenciaToggle = (opcao: string) => {
    setInfluencias(prev => 
      prev.includes(opcao) 
        ? prev.filter(item => item !== opcao)
        : [...prev, opcao]
    )
  }

  const handleSubmitResponse = () => {
    const respostaCompleta = {
      setor: selectedSetor,
      perguntasPadrao: {
        npsScore: npsScorePadrao,
        oQueAgradou: oQueAgradouPadrao
      },
      perguntasDirecionadas: {
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

  const canSubmit = () => {
    return npsScorePadrao !== null && 
           oQueAgradouPadrao.trim() !== "" && 
           avaliacaoSetor !== null && 
           satisfacaoSetor.trim() !== "" && 
           sugestoes.trim() !== ""
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

      {/* Seleção de Setor */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecione o Setor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha o setor onde você foi atendido para responder as perguntas específicas
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedSetor}
            onValueChange={handleSetorChange}
            disabled={!isPublicMode}
          >
            {setoresDisponiveis.map((setor) => (
              <div key={setor} className="flex items-center space-x-2">
                <RadioGroupItem value={setor} id={setor} />
                <Label htmlFor={setor} className="cursor-pointer">
                  {setor}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Formulário do Setor Selecionado */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliação - {selectedSetor}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Perguntas Padrão */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Perguntas Padrão - {selectedSetor}</h4>
            
            {/* NPS Padrão */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                De 0 a 10, o quanto você recomendaria o {hospitalName} para amigos e familiares?
              </Label>
              
              <div className="grid grid-cols-11 gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setNpsScorePadrao(i)}
                    className={`
                      w-12 h-12 rounded-full font-bold text-sm cursor-pointer
                      ${getScaleColor(i, npsScorePadrao === i, false)}
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

            {/* O que agradou padrão */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                O que mais te agradou em sua experiência conosco?
              </Label>
              <Textarea
                value={oQueAgradouPadrao}
                onChange={(e) => setOQueAgradouPadrao(e.target.value)}
                placeholder="Conte-nos sobre sua experiência..."
                rows={3}
                disabled={!isPublicMode}
              />
            </div>
          </div>

          {/* Perguntas Direcionadas */}
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100">Perguntas Direcionadas - {selectedSetor}</h4>
            
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
          </div>

          {isPublicMode && (
            <Button 
              onClick={handleSubmitResponse} 
              className="w-full mt-6"
              disabled={!canSubmit()}
            >
              Finalizar Avaliação
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}