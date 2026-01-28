import { Link } from "react-router-dom";
import { Building2, FileCheck, Gavel, MapPin, ArrowRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/pages/Catalogo";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

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
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Licitação":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const { user } = useAuth();
  const manifestarHref = user
    ? `/manifestar-interesse?produtoId=${product.id}&tipo=Manifestação de interesse`
    : `/login?redirect=${encodeURIComponent(`/manifestar-interesse?produtoId=${product.id}&tipo=Manifestação de interesse`)}`;

  if (viewMode === "list") {
    return (
      <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className={`absolute top-3 left-3 ${getPurchaseColor(product.purchaseType)}`}>
              {getPurchaseIcon(product.purchaseType)}
              <span className="ml-1">{product.purchaseType}</span>
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {product.type === "product" ? "Produto" : "Serviço"}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {product.company}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {product.state}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none" asChild>
                <Link to={`/catalogo/${product.id}`}>
                  Ver detalhes
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-secondary hover:bg-secondary/90"
                asChild
              >
                <Link to={manifestarHref}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Manifestar interesse
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Image */}
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

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{product.company}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{product.state}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link to={`/catalogo/${product.id}`}>
              Ver detalhes
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90" asChild>
            <Link to={manifestarHref}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Manifestar interesse
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
