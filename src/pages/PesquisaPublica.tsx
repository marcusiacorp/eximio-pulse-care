import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { NPSPreview } from "@/components/NPSPreview"
import { PontosContatoPreview } from "@/components/PontosContatoPreview"
import { ProblemasPreview } from "@/components/ProblemasPreview"
import { FormulariosAdicionaisPreview } from "@/components/FormulariosAdicionaisPreview"

interface CampanhaData {
  id: string
  nome: string
  tipo_campanha: string
  hospital_id: string
  configuracao?: {
    trecho_pergunta?: string
    recomendacao?: string
    autorizacao?: string
    pontos_contato?: any
    problemas?: any
    formularios_adicionais?: any
    layout_envio?: any
  }
}

export default function PesquisaPublica() {
  const { campanhaId } = useParams()
  const [campanha, setCampanha] = useState<CampanhaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [etapas, setEtapas] = useState<string[]>([])

  // Carregar dados da campanha
  useEffect(() => {
    const carregarCampanha = async () => {
      if (!campanhaId) return

      try {
        const { data: campanhaData, error: campanhaError } = await supabase
          .from("campanhas")
          .select("*")
          .eq("id", campanhaId)
          .single()

        if (campanhaError) throw campanhaError

        const { data: configData, error: configError } = await supabase
          .from("campanha_configuracao")
          .select("*")
          .eq("campanha_id", campanhaId)
          .single()

        if (configError) throw configError

        setCampanha({
          ...campanhaData,
          configuracao: configData
        })

        // Definir etapas baseadas na configuração
        const etapasDisponiveis = ["pergunta_definitiva"]
        
        if (configData.pontos_contato && typeof configData.pontos_contato === 'object' && (configData.pontos_contato as any)?.ativo) {
          etapasDisponiveis.push("pontos_contato")
        }
        if (configData.problemas && typeof configData.problemas === 'object' && (configData.problemas as any)?.ativo) {
          etapasDisponiveis.push("problemas")
        }
        if (configData.formularios_adicionais && typeof configData.formularios_adicionais === 'object' && (configData.formularios_adicionais as any)?.ativo) {
          etapasDisponiveis.push("formularios_adicionais")
        }
        
        setEtapas(etapasDisponiveis)
      } catch (error) {
        console.error("Erro ao carregar campanha:", error)
        toast.error("Pesquisa não encontrada")
      } finally {
        setLoading(false)
      }
    }

    carregarCampanha()
  }, [campanhaId])

  const handleProximaEtapa = () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1)
    } else {
      // Na última etapa, mostrar mensagem de agradecimento
      toast.success("Resposta enviada com sucesso! Obrigado pela sua participação.")
      setEtapaAtual(999) // Tela de agradecimento
    }
  }

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando pesquisa...</p>
      </div>
    )
  }

  if (!campanha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Pesquisa não encontrada</h2>
            <p>Esta pesquisa não existe ou foi removida.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de agradecimento
  if (etapaAtual === 999) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Obrigado!</h2>
            <p>Sua resposta foi enviada com sucesso. Agradecemos pela sua participação!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const etapaAtualNome = etapas[etapaAtual]
  const isUltimaEtapa = etapaAtual === etapas.length - 1

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Renderizar o componente de preview apropriado para cada etapa */}
        {etapaAtualNome === "pergunta_definitiva" && (
          <NPSPreview
            trechoPergunta={campanha.configuracao?.trecho_pergunta || ""}
            recomendacao={campanha.configuracao?.recomendacao || ""}
            autorizacao={campanha.configuracao?.autorizacao || ""}
            nomeHospital={campanha.nome}
            isPublicMode={true}
            logoUrl={(campanha.configuracao?.layout_envio as any)?.logo_url}
          />
        )}

        {etapaAtualNome === "pontos_contato" && campanha.configuracao?.pontos_contato && (
          <PontosContatoPreview
            pontosContatoAtivos={true}
            pontosContato={(campanha.configuracao.pontos_contato as any)?.pontos || []}
            nomeHospital={campanha.nome}
            isPublicMode={true}
          />
        )}

        {etapaAtualNome === "problemas" && (
          <ProblemasPreview
            problemasAtivos={true}
            nomeHospital={campanha.nome}
            isPublicMode={true}
          />
        )}

        {etapaAtualNome === "formularios_adicionais" && (
          <FormulariosAdicionaisPreview
            formulariosAdicionaisAtivos={true}
            formulariosCriados={(campanha.configuracao?.formularios_adicionais as any)?.formularios || []}
            nomeHospital={campanha.nome}
            isPublicMode={true}
          />
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6 max-w-2xl mx-auto">
          {etapaAtual > 0 ? (
            <Button variant="outline" onClick={handleEtapaAnterior}>
              Voltar
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button onClick={handleProximaEtapa}>
            {isUltimaEtapa ? "Enviar Resposta" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  )
}