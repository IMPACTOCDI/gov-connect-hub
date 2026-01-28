import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Termos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-10">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Este documento descreve as condições de uso da plataforma Gov Connect Hub. Ajuste o
              conteúdo conforme os termos jurídicos oficiais da sua operação.
            </p>
          </div>
        </section>
        <section className="py-10">
          <div className="container prose prose-sm md:prose-base max-w-3xl">
            <p>
              As informações apresentadas nesta plataforma têm caráter informativo e visam apoiar a
              jornada de contratações públicas, aproximando órgãos contratantes e empresas
              fornecedoras.
            </p>
            <p>
              Antes de utilizar a plataforma em ambiente produtivo, substitua este texto por seus termos
              de uso completos, abordando temas como: responsabilidades, limites de uso, sigilo, proteção
              de dados, canais de suporte e demais cláusulas necessárias.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

