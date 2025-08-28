import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho Fixo */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-secondary z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              Eximio Analytics NPS
            </div>
            <nav className="flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Resultados
              </Link>
              <Button variant="outline" size="sm">
                Entrar
              </Button>
              <Button variant="default" size="sm">
                Criar Conta
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="pt-20">
        {/* Seção 2: Visão Geral do NPS */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Net Promoter Score
            </h1>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              O que é NPS?
            </h2>
            <p className="text-lg text-foreground leading-relaxed">
              Net Promoter Score®, ou NPS, é uma métrica desenvolvida para medir o grau de satisfação e lealdade de clientes com sua empresa ou marca. O NPS é utilizado pelas maiores empresas do mundo como um indicador de satisfação de seus clientes.
            </p>
          </div>
        </section>

        {/* Seção 3: Como Funciona o NPS? */}
        <section className="py-16 px-6 bg-secondary">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Como funciona o NPS?
            </h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-lg text-foreground leading-relaxed">
                A métrica serve também para comparar o desempenho de diferentes áreas de uma empresa, abrindo caminho para perguntas mais específicas sobre a experiência do cliente e outras ações pontuais para melhoria dos processos de atendimento.
              </p>
              
              <p className="text-lg text-foreground leading-relaxed">
                A pergunta utilizada para calcular a métrica, que está fortemente relacionada a indicação, satisfação e resultados de crescimento das empresas é: <strong>Em uma escala de 0 a 10, qual é a probabilidade de recomendar esta empresa a um amigo ou colega?</strong>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Segmentação:</h3>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                O cliente atribui uma nota de 0 a 10. As respostas são segmentadas em três grupos:
              </p>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <strong className="text-foreground">Respostas de 0 a 6 - Detratores</strong>
                  <p className="text-foreground">clientes insatisfeitos, não indicam sua marca e podem causar dano à reputação.</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <strong className="text-foreground">Respostas de 7 a 8 - Neutros</strong>
                  <p className="text-foreground">clientes indiferentes em relação à marca, poderiam ser facilmente seduzidos pela concorrência.</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <strong className="text-foreground">Respostas de 9 a 10 - Promotores</strong>
                  <p className="text-foreground">clientes leais que continuarão comprando e recomendando sua marca para outras pessoas.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Fórmula de Cálculo:</h3>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Depois que você enviou a pesquisa e tabulou as respostas em três grandes grupos, chega o momento de calcular o NPS, que é o resultado final e o indicador para se acompanhar ao longo do tempo.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Para isso, o percentual de clientes neutros é desconsiderado e você precisará subtrair o percentual de detratores do percentual de promotores, usando a seguinte fórmula:
              </p>
              <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center text-xl font-bold">
                NPS = %(CLIENTES PROMOTORES) – %(CLIENTES DETRATORES)
              </div>
              <p className="text-lg text-foreground leading-relaxed mt-4">
                O resultado é um número que varia de -100 a 100 que é o Net Promoter Score.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 4: Métricas e Modelos de Pesquisa */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Métricas e Modelos de Pesquisa mais Utilizados
            </h2>
            
            <p className="text-lg text-foreground leading-relaxed mb-8">
              Utilize o Modelo de Pesquisa de satisfação com sua marca, produto ou serviço. Os alertas personalizados por SMS ou e-mail, podem ajudar a monitorar o nível de satisfação em tempo real, 24 horas por dia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-secondary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modelo de Pesquisa NPS®
                </h3>
                <p className="text-foreground">
                  Avalie a lealdade e satisfação dos seus clientes com a métrica mais utilizada pelas maiores empresas do mundo.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-secondary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modelo de Pesquisa CSAT
                </h3>
                <p className="text-foreground">
                  Meça a satisfação do cliente com produtos ou serviços específicos através de perguntas diretas e objetivas.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-secondary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modelo de Pesquisa de pós-atendimento
                </h3>
                <p className="text-foreground">
                  Colete feedback imediatamente após o atendimento para identificar pontos de melhoria no processo.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-secondary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Modelo de Pesquisa de Cultura e Clima Organizacional
                </h3>
                <p className="text-foreground">
                  Avalie o ambiente de trabalho e o engajamento dos colaboradores para melhorar a produtividade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;