const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-2">
          Gráfico de evolução do NPS e análises detalhadas
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold text-card-foreground mb-4">Evolução do NPS</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">Gráfico de evolução do NPS será implementado aqui</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">NPS por Especialidade</h3>
          <p className="text-sm text-muted-foreground">
            Compare o desempenho entre diferentes áreas
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-card-foreground mb-2">NPS por Médico</h3>
          <p className="text-sm text-muted-foreground">
            Avalie a performance individual de cada profissional
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage