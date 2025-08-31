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

  // Cores baseadas nas especificações exatas do usuário
  const backgroundColors = [
    'bg-scale-0',      // 0 - #EA3432
    'bg-scale-1',      // 1 - #F74445
    'bg-scale-2',      // 2 - #FF6443
    'bg-scale-3',      // 3 - #FF8538
    'bg-scale-4',      // 4 - #FFA52A
    'bg-scale-5',      // 5 - #FFC000
    'bg-scale-6',      // 6 - #E3C400
    'bg-scale-7',      // 7 - #C0C900
    'bg-scale-8',      // 8 - #9DCB00
    'bg-scale-9',      // 9 - #79CA00
    'bg-scale-10'      // 10 - #32AE00
  ]

  // Cores mais claras para não selecionados
  const lightColors = [
    'bg-scale-0-light',      // 0 - versão clara de #EA3432
    'bg-scale-1-light',      // 1 - versão clara de #F74445
    'bg-scale-2-light',      // 2 - versão clara de #FF6443
    'bg-scale-3-light',      // 3 - versão clara de #FF8538
    'bg-scale-4-light',      // 4 - versão clara de #FFA52A
    'bg-scale-5-light',      // 5 - versão clara de #FFC000
    'bg-scale-6-light',      // 6 - versão clara de #E3C400
    'bg-scale-7-light',      // 7 - versão clara de #C0C900
    'bg-scale-8-light',      // 8 - versão clara de #9DCB00
    'bg-scale-9-light',      // 9 - versão clara de #79CA00
    'bg-scale-10-light'      // 10 - versão clara de #32AE00
  ]

  const bgColor = isSelected ? backgroundColors[score] : lightColors[score]
  const textColor = isSelected ? 'text-white' : 'text-gray-700'
  const scale = isSelected ? 'scale-110' : 'scale-100'
  const border = isSelected ? 'border-2 border-white shadow-lg' : 'border border-gray-300'
  const transition = 'transition-all duration-200'

  return `${bgColor} ${textColor} ${scale} ${border} ${transition} hover:scale-105`
}
