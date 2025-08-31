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

  // Cores de fundo em degradê
  const backgroundColors = [
    'bg-red-500',    // 0
    'bg-red-400',    // 1
    'bg-red-300',    // 2
    'bg-orange-400', // 3
    'bg-orange-300', // 4
    'bg-yellow-400', // 5
    'bg-yellow-300', // 6
    'bg-lime-400',   // 7
    'bg-lime-300',   // 8
    'bg-green-400',  // 9
    'bg-green-500'   // 10
  ]

  // Cores mais claras para não selecionados
  const lightColors = [
    'bg-red-200',     // 0
    'bg-red-150',     // 1
    'bg-red-100',     // 2
    'bg-orange-200',  // 3
    'bg-orange-150',  // 4
    'bg-yellow-200',  // 5
    'bg-yellow-150',  // 6
    'bg-lime-200',    // 7
    'bg-lime-150',    // 8
    'bg-green-200',   // 9
    'bg-green-300'    // 10
  ]

  const bgColor = isSelected ? backgroundColors[score] : lightColors[score]
  const textColor = isSelected ? 'text-white' : 'text-gray-600'
  const scale = isSelected ? 'scale-110' : 'scale-100'
  const border = isSelected ? 'border-2 border-white shadow-lg' : 'border border-gray-300'
  const transition = 'transition-all duration-200'

  return `${bgColor} ${textColor} ${scale} ${border} ${transition} hover:scale-105`
}
