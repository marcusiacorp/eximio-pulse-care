import { useState, useRef } from "react"
import { Upload, Star, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface NPSPreviewProps {
  trechoPergunta: string
  recomendacao: string
  autorizacao: string
  oQueAgradou?: string
  setoresHospital?: string[]
  nomeHospital?: string
  isPublicMode?: boolean
  logoUrl?: string
  onResponse?: (data: any) => void
}

export const NPSPreview = ({
  trechoPergunta = "",
  recomendacao = "",
  autorizacao = "",
  oQueAgradou = "",
  setoresHospital = [],
  nomeHospital = "",
  isPublicMode = false,
  logoUrl
}: NPSPreviewProps) => {
  console.log('NPSPreview recebeu logoUrl:', logoUrl)
  console.log('NPSPreview logoUrl existe?', !!logoUrl)
  console.log('NPSPreview isPublicMode:', isPublicMode)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [selectedAuthorization, setSelectedAuthorization] = useState<boolean | null>(null)
  const [selectedRecomendacao, setSelectedRecomendacao] = useState<boolean | null>(null)
  const [respostaAgradou, setRespostaAgradou] = useState("")
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showLogoDialog, setShowLogoDialog] = useState(false)
  const [tempLogoFile, setTempLogoFile] = useState<File | null>(null)
  const [tempLogoPreview, setTempLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setTempLogoFile(file)
        setTempLogoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveLogo = () => {
    if (tempLogoFile && tempLogoPreview) {
      setLogoFile(tempLogoFile)
      setLogoPreview(tempLogoPreview)
    }
    setShowLogoDialog(false)
    setTempLogoFile(null)
    setTempLogoPreview(null)
  }

  const handleCancelLogo = () => {
    setShowLogoDialog(false)
    setTempLogoFile(null)
    setTempLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setShowLogoDialog(false)
    setTempLogoFile(null)
    setTempLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

  const handleSetorToggle = (setor: string) => {
    setSetoresSelecionados(prev => 
      prev.includes(setor) 
        ? prev.filter(item => item !== setor)
        : [...prev, setor]
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-lg shadow-sm p-6 space-y-6">
      {/* Logo do Hospital */}
      <div className="flex justify-center">
        {(logoUrl || logoPreview) ? (
          <div className="w-32 h-16 rounded-lg flex items-center justify-center">
            <img 
              src={logoUrl || logoPreview} 
              alt="Logo do Hospital" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', logoUrl)
                console.log('URL do banner:', logoUrl)
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', logoUrl || logoPreview)
              }}
            />
          </div>
        ) : isPublicMode ? (
          <div className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">Banner não configurado</p>
              <p className="text-xs text-red-500">URL: {logoUrl || 'undefined'}</p>
            </div>
          </div>
        ) : !isPublicMode ? (
          <div 
            className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowLogoDialog(true)}
          >
            <div className="text-center">
              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Logo do Hospital</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Nome do Hospital */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{nomeHospital}</h2>
      </div>

      {/* Pergunta Principal */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {trechoPergunta}
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

      {/* Pergunta sobre o que agradou */}
      {oQueAgradou && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {oQueAgradou}
          </p>
          <Textarea
            value={respostaAgradou}
            onChange={(e) => setRespostaAgradou(e.target.value.slice(0, 280))}
            placeholder="Digite sua resposta aqui..."
            className="resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 text-right">
            {respostaAgradou.length}/280 caracteres
          </p>
        </div>
      )}

      {/* Seleção de setores */}
      {setoresHospital.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Em qual área do hospital você foi atendido?
          </p>
          <div className="space-y-2">
            {setoresHospital.map((setor) => (
              <div key={setor} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={setor}
                  checked={setoresSelecionados.includes(setor)}
                  onChange={() => handleSetorToggle(setor)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={setor}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {setor}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

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
              variant={selectedRecomendacao === true ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedRecomendacao(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Sim
            </Button>
            <Button
              variant={selectedRecomendacao === false ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedRecomendacao(false)}
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


      {!isPublicMode && (
        <>
          {/* Input oculto para upload de arquivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Dialog de upload de logo */}
          <Dialog open={showLogoDialog} onOpenChange={setShowLogoDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Logo do Hospital</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Área de upload */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {tempLogoPreview ? (
                    <div className="space-y-2">
                      <div className="w-32 h-32 mx-auto border rounded-lg overflow-hidden">
                        <img 
                          src={tempLogoPreview} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600">Clique para trocar a imagem</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clique para fazer upload</p>
                        <p className="text-xs text-gray-500">PNG ou JPG (tamanho recomendado: 170x170px)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações sobre o arquivo selecionado */}
                {tempLogoFile && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{tempLogoFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(tempLogoFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                {logoPreview && (
                  <Button
                    variant="destructive"
                    onClick={handleRemoveLogo}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remover
                  </Button>
                )}
                <Button variant="outline" onClick={handleCancelLogo}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveLogo} 
                  disabled={!tempLogoFile}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}