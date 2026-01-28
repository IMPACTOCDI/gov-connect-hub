import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Privacidade() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-10">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explique aqui como os dados de usuários, órgãos públicos e empresas são coletados,
              armazenados e utilizados dentro do Gov Connect Hub.
            </p>
          </div>
        </section>
        <section className="py-10">
          <div className="container prose prose-sm md:prose-base max-w-3xl">
            <p>
              Esta página deve ser adaptada para refletir a sua política de privacidade oficial, incluindo
              referências à LGPD, bases legais para tratamento de dados, direitos dos titulares e canais
              para solicitações relacionadas à privacidade.
            </p>
            <p>
              Enquanto o banco de dados não está integrado, os formulários da plataforma funcionam em
              modo demonstrativo, sem persistência real das informações.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

