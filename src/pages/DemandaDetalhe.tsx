import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDemandas } from "@/contexts/DemandasContext";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Building2,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function DemandaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getDemanda } = useDemandas();
  const demanda = id ? getDemanda(id) : undefined;

  if (!user || user.role !== "empresa") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito a empresas.</p>
        <Button asChild>
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    );
  }

  if (!demanda) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Demanda não encontrada</p>
            <Button asChild variant="outline">
              <Link to="/empresa">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para Minha conta
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-6">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Minha conta / Demandas recebidas</p>
              <h1 className="font-display text-2xl font-bold text-foreground">{demanda.tipo}</h1>
              <p className="text-sm text-muted-foreground mt-1">{demanda.produto}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {demanda.data}
                <Badge variant={demanda.status === "Novo" ? "default" : "secondary"} className="ml-2">
                  {demanda.status}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/empresa">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Órgão solicitante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="font-medium text-foreground">{demanda.origem}</p>
                {demanda.uf && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {demanda.uf}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Item de interesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{demanda.produto}</p>
              </CardContent>
            </Card>

            {demanda.mensagem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{demanda.mensagem}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contato do solicitante</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use os dados abaixo para retornar o contato ao órgão público.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {demanda.contatoNome && (
                  <p className="text-sm font-medium text-foreground">{demanda.contatoNome}</p>
                )}
                {demanda.email && (
                  <a
                    href={`mailto:${demanda.email}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {demanda.email}
                  </a>
                )}
                {demanda.contatoTelefone && (
                  <a
                    href={`tel:${demanda.contatoTelefone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {demanda.contatoTelefone}
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
