import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface DadosPessoaisFormProps {
  onSubmit: (dados: { nome: string; email: string; telefone: string }) => void
  loading?: boolean
}

// Input validation and sanitization functions
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '') // Remove potential XSS characters
}

const validateEmail = (email: string): boolean => {
  if (!email) return true // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[\d\s\-\(\)\+\.]{10,20}$/
  return phoneRegex.test(phone)
}

const validateName = (name: string): boolean => {
  if (!name) return true // Name is optional
  const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]{1,100}$/
  return nameRegex.test(name)
}

export function DadosPessoaisForm({ onSubmit, loading }: DadosPessoaisFormProps) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [errors, setErrors] = useState<{nome?: string; email?: string; telefone?: string}>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Sanitize inputs
    const sanitizedNome = sanitizeInput(nome)
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedTelefone = sanitizeInput(telefone)
    
    // Validate inputs
    const newErrors: {nome?: string; email?: string; telefone?: string} = {}
    
    if (!validateName(sanitizedNome)) {
      newErrors.nome = "Nome deve conter apenas letras e espaços (máximo 100 caracteres)"
    }
    
    if (!validateEmail(sanitizedEmail)) {
      newErrors.email = "Por favor, insira um email válido"
    }
    
    if (!validatePhone(sanitizedTelefone)) {
      newErrors.telefone = "Por favor, insira um telefone válido (10-20 dígitos)"
    }
    
    // Check if any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Por favor, corrija os erros nos campos")
      return
    }

    onSubmit({ 
      nome: sanitizedNome, 
      email: sanitizedEmail, 
      telefone: sanitizedTelefone 
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Seus Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo (opcional)"
              maxLength={100}
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email (opcional)"
              maxLength={150}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Digite seu telefone (opcional)"
              maxLength={20}
              className={errors.telefone ? "border-destructive" : ""}
            />
            {errors.telefone && <p className="text-sm text-destructive">{errors.telefone}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Finalizar Resposta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}