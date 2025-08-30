import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface Hospital {
  id: string
  nome: string
  sponsor: string
  localizacao?: string
}

interface HospitalContextType {
  hospitals: Hospital[]
  selectedHospital: Hospital | null
  setSelectedHospital: (hospital: Hospital | null) => void
  loading: boolean
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined)

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHospitals()
    }
  }, [user])

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitais")
        .select("id, nome, sponsor, localizacao")
        .order("nome")

      if (error) {
        console.error("Erro ao buscar hospitais:", error)
        return
      }

      setHospitals(data || [])
      
      // Se houver hospitais e nenhum selecionado, selecionar o primeiro
      if (data && data.length > 0 && !selectedHospital) {
        setSelectedHospital(data[0])
      }
    } catch (error) {
      console.error("Erro ao buscar hospitais:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <HospitalContext.Provider
      value={{
        hospitals,
        selectedHospital,
        setSelectedHospital,
        loading,
      }}
    >
      {children}
    </HospitalContext.Provider>
  )
}

export function useHospital() {
  const context = useContext(HospitalContext)
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalProvider")
  }
  return context
}