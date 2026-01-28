import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Play } from "lucide-react";

export interface EmpresaParceira {
  id: string;
  nome: string;
  logoUrl: string;
  descricao: string;
  segmento: string;
  siteUrl?: string;
  videoUrl?: string;
  destaque?: boolean;
}

const mockParceiras: EmpresaParceira[] = [];

export default function EmpresasParceiras() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-card py-10">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Empresas Parceiras
                </h1>
                <p className="text-muted-foreground mt-1">
                  Conheça as empresas que fazem parte do Gov Connect Hub: logos, informações e vídeos
                  dos nossos parceiros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de parceiras */}
        <section className="py-10">
          <div className="container">
            {mockParceiras.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-10 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Nenhuma empresa parceira cadastrada
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  As empresas parceiras cadastradas na plataforma aparecerão aqui.
                </p>
              </div>
            ) : (
            <div className="space-y-10">
              {mockParceiras.map((parceira) => (
                <Card
                  key={parceira.id}
                  className={`overflow-hidden border-border shadow-card ${
                    parceira.destaque ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="grid md:grid-cols-[280px,1fr] lg:grid-cols-[320px,1fr] gap-0">
                    {/* Logo + info compacta */}
                    <div className="p-6 md:p-8 bg-muted/30 border-b md:border-b-0 md:border-r border-border flex flex-col items-center md:items-start text-center md:text-left">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-card border border-border shrink-0 mb-4">
                        <img
                          src={parceira.logoUrl}
                          alt={parceira.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-2">
                        {parceira.nome}
                      </h2>
                      <Badge variant="secondary" className="mb-4">
                        {parceira.segmento}
                      </Badge>
                      {parceira.siteUrl && (
                        <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
                          <a
                            href={parceira.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visitar site
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Descrição + vídeo */}
                    <div className="p-6 md:p-8 flex flex-col">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-base font-medium text-foreground">
                          Sobre a empresa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6 flex-1">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {parceira.descricao}
                        </p>

                        {parceira.videoUrl && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                              <Play className="h-4 w-4 text-primary" />
                              Vídeo institucional
                            </p>
                            <div className="aspect-video w-full max-w-xl rounded-lg overflow-hidden border border-border bg-muted">
                              <iframe
                                src={parceira.videoUrl}
                                title={`Vídeo - ${parceira.nome}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
