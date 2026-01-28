import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresasCadastradas } from "@/contexts/EmpresasCadastradasContext";
import { useDemandas } from "@/contexts/DemandasContext";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Trash2,
  FileText,
  User,
} from "lucide-react";

export default function GestaoEmpresaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEmpresa, removeEmpresa, excludeCompanyByName } = useEmpresasCadastradas();
  const { getDemandasByCompany } = useDemandas();
  const [excluirOpen, setExcluirOpen] = useState(false);

  const isFromCatalog = id?.startsWith("c-");
  const companyName = isFromCatalog ? decodeURIComponent(id?.replace(/^c-/, "") || "") : null;
  const empresa = id ? getEmpresa(id) : undefined;

  const nomeEmpresa = empresa?.nome ?? companyName ?? "";
  const demandasCount = nomeEmpresa ? getDemandasByCompany(nomeEmpresa).length : 0;

  if (!user || user.role !== "gestao") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito à gestão.</p>
        <Button asChild>
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    );
  }

  if (!empresa && !companyName) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Empresa não encontrada</p>
            <Button asChild variant="outline">
              <Link to="/gestao">Voltar ao painel</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleExcluir = () => {
    if (empresa) {
      removeEmpresa(empresa.id);
    } else if (companyName) {
      excludeCompanyByName(companyName);
    }
    setExcluirOpen(false);
    navigate("/gestao", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-6">
          <div className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Painel de gestão / Empresas cadastradas</p>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-7 w-7 text-primary" />
                {nomeEmpresa}
              </h1>
              {empresa && (
                <Badge variant={empresa.status === "Ativo" ? "default" : "outline"} className="mt-2">
                  {empresa.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/gestao">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Link>
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setExcluirOpen(true)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir empresa
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Dados da empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Razão social / Nome</p>
                  <p className="font-medium text-foreground">{nomeEmpresa}</p>
                </div>
                {empresa?.segmento && (
                  <div>
                    <p className="text-sm text-muted-foreground">Segmento</p>
                    <p className="font-medium text-foreground">{empresa.segmento}</p>
                  </div>
                )}
                {empresa?.estado && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{empresa.estado}</span>
                  </div>
                )}
                {empresa?.cnpj && (
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ</p>
                    <p className="font-medium text-foreground">{empresa.cnpj}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {(empresa?.email || empresa?.contato) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {empresa?.contato && (
                    <p className="text-sm font-medium text-foreground">{empresa.contato}</p>
                  )}
                  {empresa?.email && (
                    <a href={`mailto:${empresa.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Mail className="h-4 w-4" />
                      {empresa.email}
                    </a>
                  )}
                  {empresa?.telefone && (
                    <a href={`tel:${empresa.telefone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Phone className="h-4 w-4" />
                      {empresa.telefone}
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Demandas relacionadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {demandasCount} demanda(s) recebida(s) por esta empresa (solicitações de contato e manifestações de interesse).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />

      <AlertDialog open={excluirOpen} onOpenChange={setExcluirOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir empresa?</AlertDialogTitle>
            <AlertDialogDescription>
              A empresa &quot;{nomeEmpresa}&quot; será removida da listagem de empresas cadastradas. Esta ação não pode ser desfeita.
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
  );
}
