const GoalsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Metas</h1>
        <p className="text-muted-foreground mt-2">
          Defina e acompanhe suas metas de NPS
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Meta Atual</h3>
          <div className="text-2xl font-bold text-primary mb-1">NPS 70</div>
          <p className="text-sm text-muted-foreground">Meta estabelecida para este trimestre</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Progresso</h3>
          <div className="text-2xl font-bold text-primary mb-1">65%</div>
          <p className="text-sm text-muted-foreground">Do caminho até a meta</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Previsão</h3>
          <div className="text-2xl font-bold text-primary mb-1">NPS 68</div>
          <p className="text-sm text-muted-foreground">Baseada na tendência atual</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold text-card-foreground mb-4">Definir Nova Meta</h3>
        <p className="text-sm text-muted-foreground">
          Funcionalidade para definir e ajustar metas será implementada aqui
        </p>
      </div>
    </div>
  )
}

export default GoalsPage