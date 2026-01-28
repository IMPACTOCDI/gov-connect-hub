import { Building, FileCheck, ShieldCheck, Clock, Users, TrendingUp } from "lucide-react";

const benefitsEmpresas = [
  {
    icon: Users,
    title: "Acesso a Órgãos Públicos",
    description: "Conecte-se diretamente com prefeituras, governos estaduais e órgãos federais em todo o Brasil.",
  },
  {
    icon: FileCheck,
    title: "Divulgue suas Atas",
    description: "Disponibilize suas Atas de Registro de Preços para adesão (carona) e amplie suas vendas.",
  },
  {
    icon: TrendingUp,
    title: "Aumente seu Faturamento",
    description: "Alcance o mercado de compras governamentais e amplie suas oportunidades de venda.",
  },
];

const benefitsOrgaos = [
  {
    icon: Clock,
    title: "Agilidade nas Compras",
    description: "Encontre rapidamente fornecedores homologados e Atas vigentes para adesão imediata.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança Jurídica",
    description: "Todos os fornecedores passam por validação de documentos e conformidade legal.",
  },
  {
    icon: Building,
    title: "Catálogo Completo",
    description: "Acesse produtos e serviços de empresas homologadas, categorizados por tipo e região.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Por que escolher o EmpresasGov?
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Benefícios para todos os envolvidos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa plataforma foi projetada para facilitar o processo de compras públicas, beneficiando tanto empresas quanto órgãos governamentais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefícios para Empresas */}
          <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Para Empresas</h3>
            </div>
            <div className="space-y-6">
              {benefitsEmpresas.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios para Órgãos */}
          <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Para Órgãos Públicos</h3>
            </div>
            <div className="space-y-6">
              {benefitsOrgaos.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <benefit.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
