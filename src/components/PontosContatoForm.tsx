import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { GripVertical, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export interface PontoContato {
  id: string
  nome: string
  ativo: boolean
  ordem: number
}

interface PontosContatoFormProps {
  pontosContatoAtivos: boolean
  setPontosContatoAtivos: (ativo: boolean) => void
  pontosContato: PontoContato[]
  setPontosContato: (pontos: PontoContato[]) => void
}

export const PontosContatoForm = ({
  pontosContatoAtivos,
  setPontosContatoAtivos,
  pontosContato,
  setPontosContato
}: PontosContatoFormProps) => {
  const [novoPonto, setNovoPonto] = useState("")

  const pontosPreConfigurados: Omit<PontoContato, 'id' | 'ordem'>[] = [
    { nome: "PRONTO SOCORRO", ativo: true },
    { nome: "AMBULATÓRIO", ativo: true },
    { nome: "UNIDADE DE INTERNAÇÃO", ativo: true }
  ]

  const inicializarPontos = () => {
    const pontosIniciais = pontosPreConfigurados.map((ponto, index) => ({
      ...ponto,
      id: `ponto-${index}`,
      ordem: index
    }))
    setPontosContato(pontosIniciais)
  }

  const handleTogglePontosContato = (ativo: boolean) => {
    setPontosContatoAtivos(ativo)
    if (ativo && pontosContato.length === 0) {
      inicializarPontos()
    }
  }

  const handleTogglePonto = (pontoId: string, ativo: boolean) => {
    setPontosContato(pontosContato.map(ponto => 
      ponto.id === pontoId ? { ...ponto, ativo } : ponto
    ))
  }

  const handleAdicionarPonto = () => {
    if (!novoPonto.trim()) return
    
    const novoPontoObj: PontoContato = {
      id: `ponto-custom-${Date.now()}`,
      nome: novoPonto.trim().toUpperCase(),
      ativo: true,
      ordem: pontosContato.length
    }
    
    setPontosContato([...pontosContato, novoPontoObj])
    setNovoPonto("")
  }

  const handleRemoverPonto = (pontoId: string) => {
    setPontosContato(pontosContato.filter(ponto => ponto.id !== pontoId))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(pontosContato)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({
      ...item,
      ordem: index
    }))

    setPontosContato(updatedItems)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Pontos de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Você deseja perguntar ao seu cliente quais pontos de contato ele interagiu com sua empresa?
            </Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pontos-sim"
                  checked={pontosContatoAtivos}
                  onCheckedChange={() => handleTogglePontosContato(true)}
                />
                <Label htmlFor="pontos-sim">Sim</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pontos-nao"
                  checked={!pontosContatoAtivos}
                  onCheckedChange={() => handleTogglePontosContato(false)}
                />
                <Label htmlFor="pontos-nao">Não</Label>
              </div>
            </div>
          </div>

          {pontosContatoAtivos && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Pontos de Contato Disponíveis</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecione e ordene os pontos de contato que serão incluídos na pesquisa
                  </p>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="pontos-contato">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {pontosContato.map((ponto, index) => (
                          <Draggable key={ponto.id} draggableId={ponto.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-muted-foreground hover:text-foreground cursor-grab"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                
                                <Checkbox
                                  checked={ponto.ativo}
                                  onCheckedChange={(checked) => 
                                    handleTogglePonto(ponto.id, checked as boolean)
                                  }
                                />
                                
                                <span className="flex-1 font-medium">
                                  {ponto.nome}
                                </span>
                                
                                {!pontosPreConfigurados.some(p => p.nome === ponto.nome) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoverPonto(ponto.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div className="flex gap-2">
                  <Input
                    value={novoPonto}
                    onChange={(e) => setNovoPonto(e.target.value)}
                    placeholder="Adicionar novo ponto de contato"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdicionarPonto()}
                  />
                  <Button onClick={handleAdicionarPonto} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}