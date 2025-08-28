const HomePage = () => {
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Bom dia" : currentTime < 18 ? "Boa tarde" : "Boa noite"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, Gestor
        </h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao seu painel de controle do NPS
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Visão Geral</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho dos seus projetos de forma centralizada
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Últimas Pesquisas</h3>
          <p className="text-sm text-muted-foreground">
            Visualize as pesquisas mais recentes e suas respectivas notas
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">Alertas</h3>
          <p className="text-sm text-muted-foreground">
            Monitore alertas de baixa satisfação e tome ações imediatas
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage