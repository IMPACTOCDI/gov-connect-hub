import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { Building2, MapPin, ArrowLeft, FileCheck, Gavel } from "lucide-react";
import { mockProducts, type Product } from "./Catalogo";

export default function CatalogoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { anuncios } = useEmpresaAnuncios();
  const allProducts = useMemo(() => [...mockProducts, ...anuncios], [anuncios]);
  const product = id ? allProducts.find((p) => p.id === id) : undefined;
  const manifestarHref = user
    ? `/manifestar-interesse?produtoId=${id}&tipo=Manifestação de interesse`
    : `/login?redirect=${encodeURIComponent(`/manifestar-interesse?produtoId=${id}&tipo=Manifestação de interesse`)}`;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Item não encontrado</p>
            <p className="text-sm text-muted-foreground">
              O item solicitado não está disponível nesta versão de demonstração.
            </p>
            <Button asChild variant="outline">
              <Link to="/catalogo">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar para o catálogo
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const PurchaseIcon =
    product.purchaseType === "Ata Disponível"
      ? FileCheck
      : product.purchaseType === "Licitação"
      ? Gavel
      : Building2;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-6">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Catálogo / Detalhe do item
              </p>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {product.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {product.type === "product" ? "Produto" : "Serviço"} • {product.category}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/catalogo">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8">
          <div className="container grid gap-8 md:grid-cols-[2fr,1.2fr]">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do fornecedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{product.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{product.state}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Modalidade de compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge className="inline-flex items-center gap-1">
                    <PurchaseIcon className="h-3 w-3" />
                    {product.purchaseType}
                  </Badge>
                  {product.hasAta ? (
                    <p className="text-sm text-muted-foreground">
                      Este item possui Ata de Registro de Preços associada. Na próxima etapa, poderemos
                      vincular este cadastro à Ata correspondente no banco de dados.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Este item não está vinculado a uma Ata nesta demonstração. A modalidade indicada é
                      apenas ilustrativa.
                    </p>
                  )}
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                    <Link to={manifestarHref}>
                      Manifestar interesse
                    </Link>
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

