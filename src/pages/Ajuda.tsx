import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function Ajuda() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-10">
          <div className="container flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-primary" />
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Central de Ajuda
              </h1>
              <p className="text-muted-foreground">
                Tire dúvidas rápidas sobre o uso da plataforma. Depois podemos conectar esta seção a um FAQ
                dinâmico no banco de dados.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container grid gap-8 md:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perguntas frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is">
                    <AccordionTrigger>O que é o Gov Connect Hub?</AccordionTrigger>
                    <AccordionContent>
                      É uma plataforma que aproxima órgãos públicos e fornecedores, organizando Atas, serviços e
                      oportunidades de compras públicas em um só lugar.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="how-use">
                    <AccordionTrigger>Preciso de cadastro para usar?</AccordionTrigger>
                    <AccordionContent>
                      A navegação básica é aberta. Órgãos públicos e empresas podem se cadastrar para acessar
                      funcionalidades adicionais, como manifestar interesse em Atas ou anunciar serviços.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="data">
                    <AccordionTrigger>Os dados já estão integrados a um banco?</AccordionTrigger>
                    <AccordionContent>
                      Nesta fase inicial, a aplicação utiliza dados de demonstração. A próxima etapa será conectar
                      tudo ao banco de dados (Supabase) para gestão real das informações.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Precisa de algo específico?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Para suporte ou sugestões de melhoria, utilize o formulário em{" "}
                  <strong>Anuncie sua Empresa</strong> ou entre em contato pelos canais exibidos no rodapé.
                </p>
                <p>
                  Assim que o backend estiver integrado, esta seção poderá registrar chamados e acompanhar o
                  status das solicitações diretamente pela plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

