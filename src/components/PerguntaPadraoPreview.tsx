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
  // Estado para área selecionada
  const [areaSelecionada, setAreaSelecionada] = useState<string>("")
  
  // Estados para perguntas padrão globais
  const [npsScoreGlobal, setNpsScoreGlobal] = useState<number | null>(null)
  const [oQueAgradouGlobal, setOQueAgradouGlobal] = useState<string>("")
  
  // Respostas por setor (só perguntas direcionadas)
  const [respostasSetores, setRespostasSetores] = useState<{[key: string]: any}>({
    "Pronto Socorro": {
      avaliacaoSetor: null,
      satisfacaoSetor: "",
      influencias: [],
      sugestoes: ""
    },
    "Ambulatório": {
      avaliacaoSetor: null,
      satisfacaoSetor: "",
      influencias: [],
      sugestoes: ""
    },
    "Unidade de Internação": {
      avaliacaoSetor: null,
      satisfacaoSetor: "",
      influencias: [],
      sugestoes: ""
    }
  })

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

  const areasHospital = [
    "Ambulatório",
    "Pronto Socorro", 
    "Unidade de Internação",
    "Unidade de Terapia Intensiva (UTI)",
    "Centro Cirúrgico",
    "Exames e procedimentos"
  ]

  const updateRespostaSetor = (setor: string, campo: string, valor: any) => {
    setRespostasSetores(prev => ({
      ...prev,
      [setor]: {
        ...prev[setor],
        [campo]: valor
      }
    }))
  }

  const handleInfluenciaToggle = (setor: string, opcao: string) => {
    const influenciasAtuais = respostasSetores[setor].influencias
    const novasInfluencias = influenciasAtuais.includes(opcao)
      ? influenciasAtuais.filter((item: string) => item !== opcao)
      : [...influenciasAtuais, opcao]
    
    updateRespostaSetor(setor, 'influencias', novasInfluencias)
  }

  const handleSubmitResponse = () => {
    const respostaCompleta = {
      areaSelecionada,
      npsScoreGlobal,
      oQueAgradouGlobal,
      respostasSetores
    }
    
    if (onResponse) {
      onResponse(respostaCompleta)
    }
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

      {/* Pergunta Padrão - Caixa Única */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pergunta Padrão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avaliação Geral */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Avaliação Geral</h4>
            
            {/* NPS Global */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                De 0 a 10, o quanto você recomendaria o {hospitalName} para amigos e familiares?
              </Label>
              
              <div className="grid grid-cols-11 gap-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setNpsScoreGlobal(i)}
                    className={`
                      w-12 h-12 rounded-full font-bold text-sm cursor-pointer
                      ${getScaleColor(i, npsScoreGlobal === i, false)}
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

            {/* O que agradou global */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                O que mais te agradou em sua experiência conosco?
              </Label>
              <Textarea
                value={oQueAgradouGlobal}
                onChange={(e) => setOQueAgradouGlobal(e.target.value)}
                placeholder="Conte-nos sobre sua experiência..."
                rows={3}
                disabled={!isPublicMode}
              />
            </div>
          </div>

          {/* Identificação da Área */}
          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Identificação da Área</h4>
            <Label className="text-base font-medium mb-4 block">
              Em qual área do hospital você foi atendido?
            </Label>
            <RadioGroup 
              value={areaSelecionada} 
              onValueChange={setAreaSelecionada}
              disabled={!isPublicMode}
            >
              {areasHospital.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <RadioGroupItem value={area} id={area} />
                  <Label htmlFor={area} className="cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações por Setor */}
      <div className="space-y-8">
        {setoresDisponiveis.map((setor, index) => (
          <Card key={setor}>
            <CardHeader>
              <CardTitle>Avaliação - {setor}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Perguntas Direcionadas */}
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Avaliação Específica - {setor}</h4>
                
                {/* Avaliação do setor */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    De 0 a 10, como você avalia sua experiência durante seu atendimento no {setor}?
                  </Label>
                  
                  <div className="grid grid-cols-11 gap-2">
                    {Array.from({ length: 11 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => updateRespostaSetor(setor, 'avaliacaoSetor', i)}
                        className={`
                          w-12 h-12 rounded-full font-bold text-sm cursor-pointer
                          ${getScaleColor(i, respostasSetores[setor].avaliacaoSetor === i, false)}
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
                    value={respostasSetores[setor].satisfacaoSetor}
                    onChange={(e) => updateRespostaSetor(setor, 'satisfacaoSetor', e.target.value)}
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
                          id={`${setor}-${opcao}`}
                          checked={respostasSetores[setor].influencias.includes(opcao)}
                          onCheckedChange={() => handleInfluenciaToggle(setor, opcao)}
                          disabled={!isPublicMode}
                        />
                        <Label htmlFor={`${setor}-${opcao}`} className="cursor-pointer text-sm">
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
                    value={respostasSetores[setor].sugestoes}
                    onChange={(e) => updateRespostaSetor(setor, 'sugestoes', e.target.value)}
                    placeholder="Suas sugestões são muito importantes para nós..."
                    rows={3}
                    disabled={!isPublicMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {isPublicMode && (
          <Button 
            onClick={handleSubmitResponse} 
            className="w-full mt-6"
          >
            Finalizar Avaliação
          </Button>
        )}
      </div>
    </div>
  )
}