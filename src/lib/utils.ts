import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para obter cores em degradê de 0 (vermelho) a 10 (verde)
export function getScaleColor(score: number, isSelected: boolean = false, isDisabled: boolean = false) {
  if (isDisabled) {
    return "bg-muted text-muted-foreground border-muted"
  }

  // Cores de fundo em degradê baseado na imagem de referência
  const backgroundColors = [
    'bg-red-600',      // 0 - vermelho mais forte
    'bg-red-500',      // 1 - vermelho
    'bg-orange-600',   // 2 - laranja avermelhado
    'bg-orange-500',   // 3 - laranja
    'bg-orange-400',   // 4 - laranja claro
    'bg-yellow-500',   // 5 - amarelo
    'bg-yellow-400',   // 6 - amarelo claro
    'bg-lime-500',     // 7 - verde limão
    'bg-green-400',    // 8 - verde claro
    'bg-green-500',    // 9 - verde
    'bg-green-600'     // 10 - verde forte
  ]

  // Cores mais claras para não selecionados - mantém o degradê visível
  const lightColors = [
    'bg-red-300',      // 0 - vermelho claro
    'bg-red-300',      // 1 - vermelho claro
    'bg-orange-300',   // 2 - laranja claro
    'bg-orange-300',   // 3 - laranja claro
    'bg-orange-200',   // 4 - laranja mais claro
    'bg-yellow-300',   // 5 - amarelo claro
    'bg-yellow-200',   // 6 - amarelo mais claro
    'bg-lime-300',     // 7 - verde limão claro
    'bg-green-300',    // 8 - verde claro
    'bg-green-300',    // 9 - verde claro
    'bg-green-400'     // 10 - verde médio
  ]

  const bgColor = isSelected ? backgroundColors[score] : lightColors[score]
  const textColor = isSelected ? 'text-white' : 'text-gray-600'
  const scale = isSelected ? 'scale-110' : 'scale-100'
  const border = isSelected ? 'border-2 border-white shadow-lg' : 'border border-gray-300'
  const transition = 'transition-all duration-200'

  return `${bgColor} ${textColor} ${scale} ${border} ${transition} hover:scale-105`
}
