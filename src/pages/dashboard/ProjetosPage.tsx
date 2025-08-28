const ProjetosPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os hospitais e instituições sob sua responsabilidade
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-card-foreground mb-2">Hospital São Lucas</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NPS Atual:</span>
              <span className="font-medium text-primary">72</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pesquisas este mês:</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Resposta:</span>
              <span className="font-medium">68%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-card-foreground mb-2">Clínica Central</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NPS Atual:</span>
              <span className="font-medium text-primary">68</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pesquisas este mês:</span>
              <span className="font-medium">856</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Resposta:</span>
              <span className="font-medium">72%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-card-foreground mb-2">Instituto Médico</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NPS Atual:</span>
              <span className="font-medium text-primary">75</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pesquisas este mês:</span>
              <span className="font-medium">2,145</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de Resposta:</span>
              <span className="font-medium">71%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold text-card-foreground mb-4">Adicionar Novo Projeto</h3>
        <p className="text-sm text-muted-foreground">
          Funcionalidade para adicionar novos hospitais será implementada aqui
        </p>
      </div>
    </div>
  )
}

export default ProjetosPage