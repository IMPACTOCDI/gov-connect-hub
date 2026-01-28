import { useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { Building2, MapPin, ArrowLeft, FileCheck, Gavel, Pencil, Trash2 } from "lucide-react";
import type { Product } from "./Catalogo";

export default function EmpresaAnuncioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAnuncio, removeAnuncio } = useEmpresaAnuncios();
  const fromState = (location.state as { product?: Product })?.product;
  const product = fromState ?? (id ? getAnuncio(id) : undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleExcluir = () => {
    if (id) {
      removeAnuncio(id);
      setDeleteOpen(false);
      navigate("/empresa", { replace: true });
    }
  };

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Anúncio não encontrado</p>
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

  const purchaseIcon =
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
              <p className="text-xs text-muted-foreground mb-1">Minha conta / Meus anúncios</p>
              <h1 className="font-display text-2xl font-bold text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground">
                {product.type === "product" ? "Produto" : "Serviço"} • {product.category}
              </p>
              <Badge variant="outline" className="mt-2">Ativo</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/empresa">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Link>
              </Button>
              <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
                <Link to={`/empresa/anuncios/${id}/editar`}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Link>
              </Button>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O anúncio &quot;{product.title}&quot; será removido do catálogo e de Meus anúncios.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
                  <CardTitle className="text-base">Informações do anúncio</CardTitle>
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
                    <purchaseIcon className="h-3 w-3" />
                    {product.purchaseType}
                  </Badge>
                  {product.hasAta ? (
                    <p className="text-sm text-muted-foreground">
                      Este anúncio possui Ata de Registro de Preços associada.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Este anúncio não está vinculado a uma Ata.
                    </p>
                  )}
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
