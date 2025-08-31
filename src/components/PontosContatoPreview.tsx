import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PontoContato } from "@/components/PontosContatoForm"
import { getScaleColor } from "@/lib/utils"

interface PontosContatoPreviewProps {
  pontosContatoAtivos: boolean
  pontosContato: PontoContato[]
  nomeHospital?: string
  isPublicMode?: boolean
  onResponse?: (data: any) => void
}

export const PontosContatoPreview = ({
  pontosContatoAtivos,
  pontosContato,
  nomeHospital = "Nome do Hospital",
  isPublicMode = false,
  onResponse
}: PontosContatoPreviewProps) => {
  const [selectedScores, setSelectedScores] = useState<{[key: string]: number}>({})
  const [feedbackPositivo, setFeedbackPositivo] = useState("")
  const [influenciaSelecionada, setInfluenciaSelecionada] = useState<string[]>([])
  const [sugestaoFinal, setSugestaoFinal] = useState("")
  const [novaOpcaoInfluencia, setNovaOpcaoInfluencia] = useState("")
  const [opcoesInfluenciaCustom, setOpcoesInfluenciaCustom] = useState<string[]>([])

  const pontosAtivos = pontosContato.filter(ponto => ponto.ativo)
  const temPontoComNotaAlta = Object.values(selectedScores).some(score => score >= 9)

  const opcoesInfluenciaPadrao = [
    "Atendimento da equipe médica",
    "Atendimento prestado pelas equipes de apoio, como enfermagem, recepção e demais setores",
    "Comunicação e informações recebidas",
    "Atendimento rápido",
    "Resolução do problema",
    "Estrutura e conforto",
    "Higiene e Limpeza"
  ]

  const todasOpcoesInfluencia = [...opcoesInfluenciaPadrao, ...opcoesInfluenciaCustom]

  const handleScoreSelect = (pontoId: string, score: number) => {
    setSelectedScores(prev => ({
      ...prev,
      [pontoId]: score
    }))
  }

  const handleInfluenciaToggle = (opcao: string) => {
    setInfluenciaSelecionada(prev => 
      prev.includes(opcao) 
        ? prev.filter(item => item !== opcao)
        : [...prev, opcao]
    )
  }

  const handleAdicionarOpcaoInfluencia = () => {
    if (!novaOpcaoInfluencia.trim() || opcoesInfluenciaCustom.includes(novaOpcaoInfluencia.trim())) return
    
    setOpcoesInfluenciaCustom(prev => [...prev, novaOpcaoInfluencia.trim()])
    setNovaOpcaoInfluencia("")
  }

  const handleRemoverOpcaoInfluencia = (opcao: string) => {
    setOpcoesInfluenciaCustom(prev => prev.filter(item => item !== opcao))
    setInfluenciaSelecionada(prev => prev.filter(item => item !== opcao))
  }


  // Enviar dados para o parent via callback
  const enviarResposta = () => {
    if (onResponse) {
      onResponse({
        pontos_contato: {
          scores: selectedScores,
          feedback_positivo: feedbackPositivo,
          influencias_selecionadas: influenciaSelecionada,
          sugestao_final: sugestaoFinal
        }
      })
    }
  }

  // Chamar callback quando dados mudarem (para modo público)
  React.useEffect(() => {
    if (isPublicMode) {
      enviarResposta()
    }
  }, [selectedScores, feedbackPositivo, influenciaSelecionada, sugestaoFinal])

  if (!pontosContatoAtivos) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {nomeHospital}
            </h3>
            
            <p className="text-muted-foreground">
              Para completar sua avaliação, dê uma nota de 0 a 10 para cada um dos pontos abaixo.
            </p>
            
            <div className="inline-block px-4 py-2 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                N/A - Não avaliar
              </span>
            </div>
            
            <div className="space-y-4">
              {["PRONTO SOCORRO", "AMBULATÓRIO", "UNIDADE DE INTERNAÇÃO"].map((setor) => (
                <div key={setor} className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    De 0 a 10, como você avalia sua experiência durante sua passagem no setor <strong>{setor}</strong>?
                  </p>
                  <div className="flex gap-1 justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        className={`
                          w-8 h-8 rounded-full text-sm font-medium
                          ${getScaleColor(score, false, true)}
                        `}
                        disabled
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (pontosAtivos.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>Selecione ao menos um ponto de contato para visualizar o preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">
            {nomeHospital}
          </h3>
          
          <p className="text-foreground">
            Para completar sua avaliação, dê uma nota de 0 a 10 para cada um dos pontos abaixo.
          </p>
        </div>

        <div className="space-y-6">
          {pontosAtivos.map((ponto) => (
            <div key={ponto.id} className="space-y-3">
              <p className="text-sm font-medium">
                De 0 a 10, como você avalia sua experiência durante sua passagem no setor <strong>{ponto.nome}</strong>?
              </p>
              
              <div className="flex gap-1 justify-center flex-wrap">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    className={`
                      w-8 h-8 rounded-full text-sm font-medium
                      ${getScaleColor(score, selectedScores[ponto.id] === score)}
                    `}
                    onClick={() => handleScoreSelect(ponto.id, score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
              
              <Separator />
            </div>
          ))}
        </div>

        {temPontoComNotaAlta && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?
            </p>
            <Textarea
              value={feedbackPositivo}
              onChange={(e) => setFeedbackPositivo(e.target.value)}
              placeholder="Conte-nos o que mais contribuiu para sua satisfação..."
              maxLength={280}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {feedbackPositivo.length}/280 caracteres
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm font-medium">
            O que mais influenciou sua experiência no hospital?
          </p>
          
          <div className="space-y-2">
            {todasOpcoesInfluencia.map((opcao) => (
              <div key={opcao} className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={opcao}
                    checked={influenciaSelecionada.includes(opcao)}
                    onCheckedChange={() => handleInfluenciaToggle(opcao)}
                  />
                  <label
                    htmlFor={opcao}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {opcao}
                  </label>
                </div>
                
                {!isPublicMode && opcoesInfluenciaCustom.includes(opcao) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoverOpcaoInfluencia(opcao)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            
            {!isPublicMode && (
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Input
                  value={novaOpcaoInfluencia}
                  onChange={(e) => setNovaOpcaoInfluencia(e.target.value)}
                  placeholder="Adicionar nova opção de influência"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdicionarOpcaoInfluencia()}
                />
                <Button 
                  onClick={handleAdicionarOpcaoInfluencia} 
                  variant="outline" 
                  size="sm"
                  disabled={!novaOpcaoInfluencia.trim()}
                >
                  Adicionar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">
            Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.
          </p>
          <Textarea
            value={sugestaoFinal}
            onChange={(e) => setSugestaoFinal(e.target.value)}
            placeholder="Compartilhe suas sugestões ou comentários adicionais..."
            className="resize-none"
            rows={3}
          />
        </div>

      </CardContent>
    </Card>
  )
}