import SupabaseTest from "@/components/SupabaseTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold text-primary mb-2">Eximio Analytics NPS</h1>
          <p className="text-xl text-secondary-foreground">
            Plataforma de Medição de NPS para Hospitais
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SupabaseTest />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">Funcionalidades</h2>
            <div className="space-y-2 text-secondary-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Pesquisas de NPS via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Painel de resultados para gestores</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Gerenciamento de pesquisas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Integração com n8n</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
