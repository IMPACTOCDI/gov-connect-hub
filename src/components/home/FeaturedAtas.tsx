import { ArrowRight, Calendar, MapPin, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAtas } from "@/contexts/AtasContext";

export function FeaturedAtas() {
  const { atas } = useAtas();
  const featuredAtas = atas.slice(0, 3);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              Atas de Registro de Preços
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Atas Disponíveis para Adesão
            </h2>
            <p className="text-muted-foreground mt-2">
              Encontre Atas vigentes de órgãos gerenciadores em todo o Brasil
            </p>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/atas" className="flex items-center gap-2">
              Ver todas as Atas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredAtas.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Nenhuma ata em destaque
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              As atas de registro de preços disponíveis para adesão aparecerão aqui. Acesse a listagem para consultar.
            </p>
            <Button asChild>
              <Link to="/atas" className="flex items-center gap-2">
                Ver listagem de atas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {featuredAtas.map((ata) => (
            <div
              key={ata.id}
              className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {ata.situacao}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{ata.numero}</span>
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {ata.titulo}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Órgão Gerenciador:</span>
                </div>
                <p className="text-sm text-foreground pl-6">{ata.orgao}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {ata.estado}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Vigência: {ata.vigenciaFim}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {ata.categoria}
                </span>
                <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5" asChild>
                  <Link to={`/atas/${ata.id}`}>
                    Ver detalhes
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
