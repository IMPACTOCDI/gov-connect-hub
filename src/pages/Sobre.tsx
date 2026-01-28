import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Handshake, Users, Target, Globe2, ShieldCheck, ArrowRight } from "lucide-react";

const highlights = [
  {
    icon: Building2,
    title: "Conecta governo e mercado",
    description:
      "Aproximamos órgãos públicos de fornecedores qualificados, facilitando contratações mais ágeis, transparentes e eficientes.",
  },
  {
    icon: Handshake,
    title: "Foco em Atas e Serviços",
    description:
      "Organizamos Atas de Registro de Preços e serviços especializados em um só lugar, prontos para adesão (carona).",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade e segurança",
    description:
      "Respeito às normas de compras públicas, integridade dos dados e trilhas de auditoria claras para gestores.",
  },
];

const audience = [
  {
    title: "Órgãos Públicos",
    description:
      "Prefeituras, câmaras municipais, governos estaduais e órgãos federais que buscam contratar de forma mais rápida, estruturada e com melhor visão de mercado.",
    bullets: [
      "Localizar Atas vigentes em todo o Brasil",
      "Comparar fornecedores e condições",
      "Organizar demandas internas de compras",
    ],
  },
  {
    title: "Empresas Fornecedoras",
    description:
      "Companhias que já atuam ou desejam atuar com o setor público, oferecendo produtos e serviços competitivos e em conformidade com a legislação.",
    bullets: [
      "Divulgar Atas de Registro de Preços",
      "Receber leads qualificados de órgãos públicos",
      "Aumentar previsibilidade e recorrência de vendas",
    ],
  },
];

const steps = [
  {
    title: "1. Descoberta",
    description:
      "Gestores públicos encontram Atas, serviços e fornecedores alinhados à sua necessidade, filtrando por estado, segmento, modalidade e situação.",
  },
  {
    title: "2. Conexão",
    description:
      "A partir do interesse, abrimos um canal estruturado para que órgão e fornecedor troquem informações, sempre respeitando as regras de compras públicas.",
  },
  {
    title: "3. Acompanhamento",
    description:
      "Apoio na jornada de adesão às Atas ou estruturação de novos processos, com visão consolidada de oportunidades e histórico de interações.",
  },
];

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 md:py-20">
          <div className="container grid gap-10 md:grid-cols-[1.4fr,1fr] items-center">
            <div>
              <Badge className="mb-4 bg-secondary text-secondary-foreground border-secondary/60">
                Sobre o Gov Connect Hub
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Um hub para transformar a jornada de compras públicas.
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 max-w-xl">
                O Gov Connect Hub nasce para simplificar a conexão entre o poder público e empresas
                fornecedoras, organizando Atas, serviços e oportunidades em um único ambiente digital.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/cadastro/empresa">
                    Quero cadastrar minha empresa
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/catalogo">Explorar catálogo</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <Card className="bg-card/90 backdrop-blur border-border/60 shadow-2xl">
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Visão do Gov Connect Hub</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Mais transparência, eficiência e impacto nas compras públicas.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Queremos ajudar gestores públicos a tomarem decisões melhores, baseadas em dados, e
                    fornecedores a enxergarem com clareza onde e como podem gerar valor para a gestão pública.
                  </p>
                  <p>
                    Unimos tecnologia, inteligência de dados e conhecimento em compras públicas para reduzir
                    fricções e destravar oportunidades em todo o Brasil.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Destaques */}
        <section className="py-14 bg-background">
          <div className="container space-y-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Nosso propósito
              </h2>
              <p className="text-muted-foreground">
                Ser a ponte confiável entre quem precisa contratar bem e quem está preparado para entregar
                com qualidade, sempre respeitando a legislação de compras públicas.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.title} className="border-border shadow-card">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Para quem é */}
        <section className="py-14 bg-card border-y border-border/60">
          <div className="container space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Para quem é o Gov Connect Hub?</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {audience.map((item) => (
                <Card key={item.title} className="bg-background border-border shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-4 w-4 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-14 bg-background">
          <div className="container space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Como funciona na prática</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title} className="border-border shadow-card relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="py-14 bg-secondary/10 border-t border-secondary/20">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Vamos construir compras públicas mais inteligentes?
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Se você é gestor público ou fornecedor, o Gov Connect Hub foi pensado para apoiar sua jornada.
                Fale com a nossa equipe e entenda como podemos apoiar sua realidade.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                <a href="/cadastro/empresa">
                  Falar com o time
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

