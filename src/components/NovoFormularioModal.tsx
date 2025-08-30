import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface NovoFormularioModalProps {
  children: React.ReactNode
  onSave?: (formulario: any) => void
}

export const NovoFormularioModal = ({ children, onSave }: NovoFormularioModalProps) => {
  const [open, setOpen] = useState(false)
  const [pergunta, setPergunta] = useState("")
  const [descricao, setDescricao] = useState("")
  const [obrigatorio, setObrigatorio] = useState(false)
  const [tipo, setTipo] = useState("")
  const [opcoes, setOpcoes] = useState<string[]>([""])

  const handleAddOpcao = () => {
    setOpcoes(prev => [...prev, ""])
  }

  const handleRemoveOpcao = (index: number) => {
    setOpcoes(prev => prev.filter((_, i) => i !== index))
  }

  const handleOpcaoChange = (index: number, value: string) => {
    setOpcoes(prev => prev.map((opcao, i) => i === index ? value : opcao))
  }

  const handleSave = () => {
    if (!pergunta.trim()) {
      return
    }

    const formulario = {
      pergunta: pergunta.trim(),
      descricao: descricao.trim(),
      obrigatorio,
      tipo,
      opcoes: tipo === "multiplas-opcoes" ? opcoes.filter(op => op.trim()) : []
    }

    onSave?.(formulario)
    
    // Reset form
    setPergunta("")
    setDescricao("")
    setObrigatorio(false)
    setTipo("")
    setOpcoes([""])
    setOpen(false)
  }

  const handleCancel = () => {
    // Reset form
    setPergunta("")
    setDescricao("")
    setObrigatorio(false)
    setTipo("")
    setOpcoes([""])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Cadastrar formulário adicional</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="pergunta" className="text-sm font-medium">
              Pergunta *
            </Label>
            <Input
              id="pergunta"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Digite sua pergunta"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="descricao" className="text-sm font-medium">
              Descrição da pergunta
            </Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a pergunta (opcional)"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Configurações:</Label>
            
              <div className="space-y-4 pl-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Obrigatório?</Label>
                  <RadioGroup 
                    value={obrigatorio ? "sim" : "nao"} 
                    onValueChange={(value) => setObrigatorio(value === "sim")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="obrigatorio-sim" />
                      <Label htmlFor="obrigatorio-sim" className="text-sm cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="obrigatorio-nao" />
                      <Label htmlFor="obrigatorio-nao" className="text-sm cursor-pointer">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tipo de pergunta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiplas-opcoes">Múltiplas opções</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipo === "multiplas-opcoes" && (
                <div>
                  <Label className="text-sm font-medium">Múltiplas opções</Label>
                  <div className="space-y-2 mt-2">
                    {opcoes.map((opcao, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={opcao}
                          onChange={(e) => handleOpcaoChange(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                          className="flex-1"
                        />
                        {opcoes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOpcao(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOpcao}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova opção
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!pergunta.trim()}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}