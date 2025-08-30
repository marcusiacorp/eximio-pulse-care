import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NPSData {
  hospital_id: string;
  hospital_nome: string;
  nps_atual: number;
  pesquisas_mes: number;
  taxa_resposta: number;
}

const ProjetosPage = () => {
  const { hospitals, selectedHospital } = useHospital();
  const [npsData, setNpsData] = useState<NPSData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando dados de NPS por enquanto
    // Em uma implementação real, estes dados viriam de uma API/tabela específica
    const mockNPSData: NPSData[] = hospitals.map((hospital, index) => ({
      hospital_id: hospital.id,
      hospital_nome: hospital.nome,
      nps_atual: [72, 68, 75, 69, 71][index % 5],
      pesquisas_mes: [1234, 856, 2145, 987, 1456][index % 5],
      taxa_resposta: [68, 72, 71, 65, 69][index % 5],
    }));
    
    setNpsData(mockNPSData);
    setLoading(false);
  }, [hospitals]);

  // Filtrar dados baseado no hospital selecionado
  const filteredData = selectedHospital 
    ? npsData.filter(data => data.hospital_id === selectedHospital.id)
    : npsData;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground mt-2">
              Carregando dados...
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground mt-2">
            {selectedHospital 
              ? `Dados de NPS para ${selectedHospital.nome}`
              : "Gerencie os hospitais e instituições sob sua responsabilidade"
            }
          </p>
        </div>
        <Button asChild>
          <NavLink to="/dashboard/projetos/cadastro">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Hospital
          </NavLink>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.length > 0 ? (
          filteredData.map((data) => (
            <div key={data.hospital_id} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-card-foreground mb-2">{data.hospital_nome}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NPS Atual:</span>
                  <span className="font-medium text-primary">{data.nps_atual}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pesquisas este mês:</span>
                  <span className="font-medium">{data.pesquisas_mes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Resposta:</span>
                  <span className="font-medium">{data.taxa_resposta}%</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              {selectedHospital ? 'Nenhum dado encontrado para esta unidade.' : 'Nenhum hospital cadastrado.'}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="font-semibold text-card-foreground mb-2">Adicionar Novo Projeto</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clique no botão acima para cadastrar um novo hospital
        </p>
        <Button asChild variant="outline">
          <NavLink to="/dashboard/projetos/cadastro">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Hospital
          </NavLink>
        </Button>
      </div>
    </div>
  )
}

export default ProjetosPage