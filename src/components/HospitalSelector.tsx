import { Building2, ChevronDown } from "lucide-react"
import { useHospital } from "@/contexts/HospitalContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function HospitalSelector() {
  const { hospitals, selectedHospital, setSelectedHospital, loading } = useHospital()

  if (loading || hospitals.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedHospital?.nome || "Selecionar Unidade"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
        {hospitals.map((hospital) => (
          <DropdownMenuItem
            key={hospital.id}
            onClick={() => setSelectedHospital(hospital)}
            className={`cursor-pointer p-3 ${
              selectedHospital?.id === hospital.id 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-muted"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{hospital.nome}</span>
              {hospital.localizacao && (
                <span className="text-sm text-muted-foreground">
                  {hospital.localizacao}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}