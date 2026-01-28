import { ArrowRight, Building2, FileCheck, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: "1",
    title: "Computadores Desktop All-in-One",
    company: "TechSolutions Brasil",
    category: "Equipamentos de TI",
    type: "product",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Cadeiras Ergonômicas para Escritório",
    company: "Móveis Corporativos LTDA",
    category: "Mobiliário",
    type: "product",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Serviço de Limpeza Predial",
    company: "CleanMax Serviços",
    category: "Serviços",
    type: "service",
    hasAta: false,
    purchaseType: "Dispensa",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Papel A4 - Resma 500 folhas",
    company: "Papelaria Nacional",
    category: "Material de Escritório",
    type: "product",
    hasAta: false,
    purchaseType: "Licitação",
    imageUrl: "https://images.unsplash.com/photo-1568205631-15a5b4e06d00?w=400&h=300&fit=crop",
  },
];

const getPurchaseIcon = (type: string) => {
  switch (type) {
    case "Ata Disponível":
      return <FileCheck className="h-3 w-3" />;
    case "Dispensa":
      return <Building2 className="h-3 w-3" />;
    case "Licitação":
      return <Gavel className="h-3 w-3" />;
    default:
      return null;
  }
};

const getPurchaseColor = (type: string) => {
  switch (type) {
    case "Ata Disponível":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "Dispensa":
      return "bg-info/10 text-info border-info/20";
    case "Licitação":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Catálogo
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Produtos e Serviços em Destaque
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore ofertas de empresas homologadas para compras públicas
            </p>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/catalogo" className="flex items-center gap-2">
              Ver catálogo completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 right-3 ${getPurchaseColor(product.purchaseType)}`}>
                  {getPurchaseIcon(product.purchaseType)}
                  <span className="ml-1">{product.purchaseType}</span>
                </Badge>
              </div>

              <div className="p-5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {product.company}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-primary hover:bg-primary/5"
                  asChild
                >
                  <Link to={`/catalogo/${product.id}`}>
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
