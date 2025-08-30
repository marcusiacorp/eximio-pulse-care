import { useState } from "react"
import { Upload, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface NPSPreviewProps {
  trechoPergunta: string
  recomendacao: string
  autorizacao: string
}

export const NPSPreview = ({ trechoPergunta, recomendacao, autorizacao }: NPSPreviewProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [selectedAuthorization, setSelectedAuthorization] = useState<boolean | null>(null)

  const getNPSColor = (score: number) => {
    if (score <= 6) return "bg-red-500 hover:bg-red-600"
    if (score <= 8) return "bg-yellow-500 hover:bg-yellow-600"
    return "bg-green-500 hover:bg-green-600"
  }

  const getNPSColorSelected = (score: number) => {
    if (score <= 6) return "bg-red-600 text-white"
    if (score <= 8) return "bg-yellow-600 text-white"
    return "bg-green-600 text-white"
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-sm p-6 space-y-6">
      {/* Logo do Hospital */}
      <div className="flex justify-center">
        <div className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-500">Logo do Hospital</p>
          </div>
        </div>
      </div>

      {/* Pergunta Principal */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {trechoPergunta || "Como você avalia a qualidade do atendimento recebido?"}
        </p>
      </div>

      {/* Escala NPS */}
      <div className="space-y-4">
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelectedScore(i)}
              className={`
                h-10 w-10 rounded-full text-sm font-medium transition-all duration-200
                ${selectedScore === i 
                  ? getNPSColorSelected(i)
                  : `${getNPSColor(i)} text-white hover:scale-105`
                }
              `}
            >
              {i}
            </button>
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Não recomendaria</span>
          <span>Recomendaria totalmente</span>
        </div>
      </div>

      {/* Pergunta de Feedback */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          Você poderia compartilhar conosco o porquê da sua nota?
        </p>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 280))}
          placeholder="Digite seu feedback aqui..."
          className="resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500 text-right">
          {feedback.length}/280 caracteres
        </p>
      </div>

      {/* Pergunta de Recomendação */}
      {recomendacao && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {recomendacao}
          </p>
          <div className="flex gap-3">
            <Button
              variant={selectedScore !== null && selectedScore >= 9 ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedScore(selectedScore || 9)}
            >
              <Star className="h-4 w-4 mr-2" />
              Sim
            </Button>
            <Button
              variant={selectedScore !== null && selectedScore <= 6 ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedScore(selectedScore || 6)}
            >
              Não
            </Button>
          </div>
        </div>
      )}

      {/* Autorização */}
      {autorizacao && (
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm text-gray-700">
            {autorizacao}
          </p>
          <div className="flex gap-3">
            <Button
              variant={selectedAuthorization === true ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedAuthorization(true)}
            >
              Sim
            </Button>
            <Button
              variant={selectedAuthorization === false ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedAuthorization(false)}
            >
              Não
            </Button>
          </div>
        </div>
      )}

      {/* Botão de Envio */}
      <div className="pt-4">
        <Button className="w-full bg-primary hover:bg-primary/90">
          Enviar Pesquisa
        </Button>
      </div>
    </div>
  )
}