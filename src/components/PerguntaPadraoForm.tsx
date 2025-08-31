import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface PerguntaPadraoFormProps {
  boasVindas: string
  setBoasVindas: (value: string) => void
  bannerPadraoUrl: string
  setBannerPadraoUrl: (value: string) => void
  hospitalName?: string
  setoresSelecionados: string[]
  setSetoresSelecionados: (setores: string[]) => void
}

export const PerguntaPadraoForm = ({
  boasVindas,
  setBoasVindas,
  bannerPadraoUrl,
  setBannerPadraoUrl,
  hospitalName = "Hospital",
  setoresSelecionados,
  setSetoresSelecionados
}: PerguntaPadraoFormProps) => {
  const [uploading, setUploading] = useState(false)

  const handleBannerUpload = async (file: File) => {
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `banner-padrao-${Date.now()}.${fileExt}`

    setUploading(true)
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName)

      setBannerPadraoUrl(publicUrl)
      toast.success("Banner carregado com sucesso!")
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast.error("Erro ao carregar banner")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveBanner = async () => {
    if (bannerPadraoUrl) {
      try {
        const fileName = bannerPadraoUrl.split('/').pop()
        if (fileName) {
          await supabase.storage.from('banners').remove([fileName])
        }
      } catch (error) {
        console.error("Erro ao remover banner:", error)
      }
    }
    setBannerPadraoUrl("")
    toast.success("Banner removido")
  }

  const setoresData = [
    {
      id: 1,
      nome: "Pronto Socorro",
      perguntas: {
        experiencia: `De 0 a 10, como você avalia sua experiência durante seu atendimento no Pronto Socorro?`,
        satisfacao: `Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?`,
        influencia: `O que mais influenciou sua experiência no hospital?`,
        sugestoes: `Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.`
      }
    },
    {
      id: 2,
      nome: "Ambulatório",
      perguntas: {
        experiencia: `De 0 a 10, como você avalia sua experiência durante seu atendimento no Ambulatório?`,
        satisfacao: `Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?`,
        influencia: `O que mais influenciou sua experiência no hospital?`,
        sugestoes: `Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.`
      }
    },
    {
      id: 3,
      nome: "Unidade de Internação",
      perguntas: {
        experiencia: `De 0 a 10, como você avalia sua experiência durante seu atendimento na Unidade de Internação?`,
        satisfacao: `Que bom saber que sua experiência foi positiva! O que mais contribuiu para sua satisfação?`,
        influencia: `O que mais influenciou sua experiência no hospital?`,
        sugestoes: `Se houver algo mais que você gostaria de compartilhar ou sugerir, por favor, nos conte.`
      }
    }
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

  const areasHospital = [
    "Ambulatório",
    "Pronto Socorro", 
    "Unidade de Internação",
    "Unidade de Terapia Intensiva (UTI)",
    "Centro Cirúrgico",
    "Exames e procedimentos"
  ]

  const handleSetorToggle = (setor: string) => {
    setSetoresSelecionados(
      setoresSelecionados.includes(setor)
        ? setoresSelecionados.filter(item => item !== setor)
        : [...setoresSelecionados, setor]
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campo de Boas Vindas */}
          <div>
            <Label htmlFor="boas-vindas">Mensagem de Boas Vindas *</Label>
            <Textarea
              id="boas-vindas"
              value={boasVindas}
              onChange={(e) => setBoasVindas(e.target.value)}
              placeholder="Digite uma mensagem de boas vindas para os pacientes..."
              rows={3}
            />
          </div>

          {/* Upload do Banner */}
          <div>
            <Label>Banner Padrão</Label>
            <div className="mt-2">
              {bannerPadraoUrl ? (
                <div className="relative">
                  <img
                    src={bannerPadraoUrl}
                    alt="Banner padrão"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveBanner}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div className="mt-4">
                      <Label
                        htmlFor="banner-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        {uploading ? "Carregando..." : "Selecionar Banner"}
                      </Label>
                      <Input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleBannerUpload(file)
                        }}
                        disabled={uploading}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG ou JPEG até 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pergunta Padrão - Caixa Única */}
      <Card>
        <CardHeader>
          <CardTitle>Pergunta Padrão</CardTitle>
          <p className="text-sm text-muted-foreground">
            Avaliação geral e identificação da área de atendimento
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avaliação Geral */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Avaliação Geral</h4>
            
            <div>
              <Badge variant="outline">Pergunta NPS</Badge>
              <p className="mt-2 text-sm">
                De 0 a 10, o quanto você recomendaria o {hospitalName} para amigos e familiares?
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Badge variant="outline">Campo Aberto</Badge>
              <p className="mt-2 text-sm">
                O que mais te agradou em sua experiência conosco?
              </p>
            </div>
          </div>

          {/* Identificação da Área */}
          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">Identificação da Área</h4>
            
            <div>
              <Badge variant="outline">Múltipla Escolha</Badge>
              <p className="mt-2 text-sm font-medium">Em qual área do hospital você foi atendido?</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {areasHospital.map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Seleção de Setores para Análise */}
          <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4">Setores para Análise</h4>
            <Label className="text-base font-medium mb-4 block">
              Selecione quais setores você deseja analisar nesta campanha:
            </Label>
            <div className="space-y-2">
              {areasHospital.map((setor) => (
                <div key={setor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`setor-${setor}`}
                    checked={setoresSelecionados.includes(setor)}
                    onCheckedChange={() => handleSetorToggle(setor)}
                  />
                  <Label htmlFor={`setor-${setor}`} className="cursor-pointer">
                    {setor}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Mesmo selecionando setores específicos, a pergunta padrão e identificação da área sempre serão exibidas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações por Setor */}
      {setoresData.filter(setor => setoresSelecionados.includes(setor.nome)).map((setor) => (
        <Card key={setor.id}>
          <CardHeader>
            <CardTitle>Avaliação - {setor.nome}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Perguntas específicas para pacientes atendidos no {setor.nome}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Perguntas Direcionadas do Setor */}
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Perguntas Direcionadas - {setor.nome}</h4>
              
              <div>
                <Badge variant="outline">Avaliação (0-10)</Badge>
                <p className="mt-2 text-sm">{setor.perguntas.experiencia}</p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="outline">Campo Aberto</Badge>
                <p className="mt-2 text-sm">{setor.perguntas.satisfacao}</p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="outline">Múltipla Escolha</Badge>
                <p className="mt-2 text-sm font-medium">{setor.perguntas.influencia}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {opcoesInfluencia.map((opcao) => (
                    <Badge key={opcao} variant="secondary" className="text-xs">
                      {opcao}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="outline">Campo Aberto</Badge>
                <p className="mt-2 text-sm">{setor.perguntas.sugestoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}