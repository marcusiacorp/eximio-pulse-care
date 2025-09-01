import { useState } from "react"
import { X, Download, FileSpreadsheet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRespostasDetalhadas } from "@/hooks/useRespostasDetalhadas"

interface ResultadosDetalhadosProps {
  campanhaId: string | null
  isOpen: boolean
  onClose: () => void
}

interface ColunaDados {
  key: string
  label: string
  accessor?: (resposta: any) => any
}

export const ResultadosDetalhados = ({ campanhaId, isOpen, onClose }: ResultadosDetalhadosProps) => {
  const { data, isLoading, error } = useRespostasDetalhadas(campanhaId)

  const formatarValor = (valor: any): string => {
    if (valor === null || valor === undefined) return "-"
    if (typeof valor === "boolean") return valor ? "Sim" : "Não"
    if (Array.isArray(valor)) return valor.join("; ")
    if (typeof valor === "object") {
      // Para formulários adicionais e outros objetos JSON
      if (Object.keys(valor).length === 0) return "-"
      return Object.entries(valor)
        .map(([key, val]) => `${key}: ${val}`)
        .join("; ")
    }
    return String(valor)
  }

  const gerarColunas = (): ColunaDados[] => {
    if (!data?.configuracao || !data?.respostas?.length) return []

    const colunas = []

    // Dados pessoais sempre primeiro (vindos da nova tabela)
    colunas.push({ 
      key: 'dados_anonimos.nome_respondente', 
      label: 'Nome',
      accessor: (resposta: any) => resposta.dados_anonimos?.nome_respondente || 'N/A'
    })
    colunas.push({ 
      key: 'dados_anonimos.email_respondente', 
      label: 'E-mail',
      accessor: (resposta: any) => resposta.dados_anonimos?.email_respondente || 'N/A'
    })
    colunas.push({ 
      key: 'dados_anonimos.telefone_respondente', 
      label: 'Telefone',
      accessor: (resposta: any) => resposta.dados_anonimos?.telefone_respondente || 'N/A'
    })

    // NPS sempre presente
    colunas.push({ key: 'nps_score', label: 'NPS' })

    // Por que da nota sempre presente  
    colunas.push({ key: 'resposta_porque_nota', label: 'Por que da nota?' })

    // Campos dinâmicos baseados na configuração
    if (data.configuracao.trecho_pergunta) {
      colunas.push({ key: 'resposta_trecho_pergunta', label: 'Trecho da pergunta' })
    }

    if (data.configuracao.o_que_agradou) {
      colunas.push({ key: 'resposta_o_que_agradou', label: 'O que mais agradou?' })
    }

    if (data.configuracao.setores_selecionados?.length) {
      colunas.push({ key: 'setores_atendimento', label: 'Em qual área foi atendido?' })
    }

    if (data.configuracao.pergunta_recomendacao) {
      colunas.push({ key: 'resposta_recomendacao', label: 'Recomendaria?' })
    }

    if (data.configuracao.resposta_autorizacao) {
      colunas.push({ key: 'resposta_autorizacao', label: 'Autorização' })
    }

    if (data.configuracao.pontos_contato) {
      colunas.push({ key: 'pontos_contato', label: 'Pontos de Contato' })
    }

    if (data.configuracao.problemas) {
      colunas.push({ key: 'problemas', label: 'Problemas' })
    }

    if (data.configuracao.formularios_adicionais) {
      colunas.push({ key: 'formularios_adicionais', label: 'Formulários Adicionais' })
    }

    // Data de resposta sempre por último
    colunas.push({ key: 'created_at', label: 'Data da Resposta' })

    return colunas
  }

  const exportarCSV = () => {
    if (!data?.respostas?.length) return

    const colunas = gerarColunas()
    const headers = colunas.map(col => col.label).join(',')
    
    const linhas = data.respostas.map(resposta => {
      return colunas.map(col => {
        let valor
        
        // Se a coluna tem accessor, usar ela
        if ('accessor' in col && typeof col.accessor === 'function') {
          valor = col.accessor(resposta)
        } else {
          valor = resposta[col.key as keyof typeof resposta]
        }
        
        if (col.key === 'created_at') {
          valor = new Date(valor as string).toLocaleString('pt-BR')
        }
        
        const valorFormatado = formatarValor(valor)
        // Escapar vírgulas e aspas para CSV
        return `"${valorFormatado.replace(/"/g, '""')}"`
      }).join(',')
    })

    const csv = [headers, ...linhas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `respostas_${data.campanha?.nome || 'campanha'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Resultados Detalhados
              </DialogTitle>
              {data?.campanha && (
                <p className="text-sm text-muted-foreground mt-1">
                  {data.campanha.nome} • {data.respostas?.length || 0} resposta(s)
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportarCSV}
                disabled={!data?.respostas?.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">
                  Erro ao carregar os resultados detalhados
                </p>
              </CardContent>
            </Card>
          ) : !data?.respostas?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Nenhuma resposta encontrada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Esta campanha ainda não recebeu respostas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col space-y-4">
              {/* Resumo */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resumo das Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{data.respostas.length}</p>
                      <p className="text-sm text-muted-foreground">Total de Respostas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {data.respostas.filter(r => (r.nps_score || 0) >= 9).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Promotores (9-10)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {data.respostas.filter(r => (r.nps_score || 0) >= 7 && (r.nps_score || 0) <= 8).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Neutros (7-8)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {data.respostas.filter(r => (r.nps_score || 0) <= 6).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Detratores (0-6)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela */}
              <div className="flex-1 overflow-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr>
                      {gerarColunas().map((coluna) => (
                        <th key={coluna.key} className="px-4 py-3 text-left font-medium border-r border-border">
                          {coluna.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.respostas.map((resposta, index) => (
                      <tr key={resposta.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                         {gerarColunas().map((coluna) => {
                           let valor
                           
                           // Se a coluna tem accessor, usar ela
                           if ('accessor' in coluna && typeof coluna.accessor === 'function') {
                             valor = coluna.accessor(resposta)
                           } else {
                             valor = resposta[coluna.key as keyof typeof resposta]
                           }
                           
                           if (coluna.key === 'created_at') {
                             valor = new Date(valor as string).toLocaleString('pt-BR')
                           }
                          
                          return (
                            <td key={coluna.key} className="px-4 py-3 border-r border-border max-w-xs">
                              {coluna.key === 'nps_score' && valor !== null && valor !== undefined ? (
                                <Badge variant={
                                  (valor as number) >= 9 ? "default" :
                                  (valor as number) >= 7 ? "secondary" : "destructive"
                                }>
                                  {valor}
                                </Badge>
                              ) : (
                                <div className="truncate" title={formatarValor(valor)}>
                                  {formatarValor(valor)}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}