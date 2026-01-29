import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, ArrowLeft, MapPin, Building2 } from "lucide-react";
import { useAtas } from "@/contexts/AtasContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AtaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { getAta } = useAtas();
  const { user } = useAuth();
  const ata = id ? getAta(id) : undefined;

  // Determinar o link para manifestar interesse
  const getManifestInterestLink = () => {
    if (!user) {
      // Não logado - vai para login com redirect
      return `/login?redirect=${encodeURIComponent(`/manifestar-interesse?ataId=${id}&tipo=Manifestação de interesse (Ata)`)}`;
    }
    
    if (user.role === "comprador") {
      // Comprador logado - vai direto para manifestar interesse
      return `/manifestar-interesse?ataId=${id}&tipo=Manifestação de interesse (Ata)`;
    }
    
    if (user.role === "empresa") {
      // Empresa logada - não pode manifestar interesse em atas
      return "#";
    }
    
    // Admin - vai para login
    return `/login?redirect=${encodeURIComponent(`/manifestar-interesse?ataId=${id}&tipo=Manifestação de interesse (Ata)`)}`;
  };

  const getButtonText = () => {
    if (!user) return "Manifestar interesse em aderir";
    if (user.role === "comprador") return "Manifestar interesse em aderir";
    if (user.role === "empresa") return "Empresas não podem aderir a atas";
    return "Manifestar interesse em aderir";
  };

  const isButtonDisabled = user?.role === "empresa";

  if (!ata) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Ata não encontrada</p>
            <p className="text-sm text-muted-foreground">
              A ata solicitada não foi encontrada ou não está mais disponível.
            </p>
            <Button asChild variant="outline">
              <Link to="/atas">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para a listagem de Atas
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
              <p className="text-xs text-muted-foreground mb-1">
                Atas de Registro de Preços / Detalhe
              </p>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {ata.titulo}
              </h1>
              <p className="text-sm text-muted-foreground">
                {ata.orgao} • {ata.estado}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/atas">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8">
          <div className="container grid gap-8 md:grid-cols-[2fr,1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da Ata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{ata.descricao}</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Número</span>
                    <p>{ata.numero}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Modalidade</span>
                    <p>{ata.modalidade}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Categoria</span>
                    <p>{ata.categoria}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Vigência</span>
                    <p className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {ata.vigenciaInicio} a {ata.vigenciaFim}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Situação e valores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge
                    variant={ata.situacao === "Vigente" ? "default" : "outline"}
                    className={
                      ata.situacao === "Vigente" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }
                  >
                    {ata.situacao}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Valor estimado: <strong>{ata.valorEstimado}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Os valores apresentados são referenciais. A Ata completa e os itens detalhados
                    permanecerão no sistema de origem (por exemplo, portal de compras do órgão gerenciador).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Órgão gerenciador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{ata.orgao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{ata.estado}</span>
                  </div>
                  <Button
                    asChild={!isButtonDisabled}
                    disabled={isButtonDisabled}
                    className="w-full bg-secondary hover:bg-secondary/90 mt-2"
                  >
                    {isButtonDisabled ? (
                      <span>{getButtonText()}</span>
                    ) : (
                      <Link to={getManifestInterestLink()}>
                        {getButtonText()}
                      </Link>
                    )}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <FileText className="h-4 w-4 mr-1" />
                      Ver edital (exemplo)
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

