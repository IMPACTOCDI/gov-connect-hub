import { ArrowRight, Calendar, MapPin, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const featuredAtas = [
  {
    id: "1",
    number: "ARP 001/2024",
    title: "Equipamentos de Informática",
    managingOrgan: "Ministério da Economia",
    region: "Nacional",
    expirationDate: "15/12/2025",
    itemsCount: 45,
    status: "Vigente",
  },
  {
    id: "2",
    number: "ARP 023/2024",
    title: "Mobiliário de Escritório",
    managingOrgan: "Prefeitura de São Paulo",
    region: "São Paulo",
    expirationDate: "30/06/2025",
    itemsCount: 32,
    status: "Vigente",
  },
  {
    id: "3",
    number: "ARP 089/2024",
    title: "Serviços de Limpeza e Conservação",
    managingOrgan: "Governo do Estado de MG",
    region: "Minas Gerais",
    expirationDate: "20/09/2025",
    itemsCount: 18,
    status: "Vigente",
  },
];

export function FeaturedAtas() {
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

        <div className="grid md:grid-cols-3 gap-6">
          {featuredAtas.map((ata) => (
            <div
              key={ata.id}
              className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {ata.status}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{ata.number}</span>
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {ata.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Órgão Gerenciador:</span>
                </div>
                <p className="text-sm text-foreground pl-6">{ata.managingOrgan}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {ata.region}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Vigência: {ata.expirationDate}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {ata.itemsCount} itens registrados
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
      </div>
    </section>
  );
}
