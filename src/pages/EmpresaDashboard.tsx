import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { useDemandas } from "@/contexts/DemandasContext";
import {
  Building2,
  MessageSquare,
  Package,
  LogOut,
  PlusCircle,
  Calendar,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";

export default function EmpresaDashboard() {
  const { user, logout } = useAuth();
  const { anuncios, removeAnuncio } = useEmpresaAnuncios();
  const { getDemandasByCompany, getAllDemandas } = useDemandas();
  const navigate = useNavigate();
  const demandasPorNome = user ? getDemandasByCompany(user.empresaNome || user.nome) : [];
  const idsDosMeusAnuncios = new Set(anuncios.map((a) => a.id));
  const demandasDosMeusAnuncios = user ? getAllDemandas().filter((d) => idsDosMeusAnuncios.has(d.produtoId)) : [];
  const demandas = useMemo(() => {
    const porId = new Map(demandasPorNome.map((d) => [d.id, d]));
    demandasDosMeusAnuncios.forEach((d) => porId.set(d.id, d));
    return Array.from(porId.values());
  }, [demandasPorNome, demandasDosMeusAnuncios]);
  const [excluirId, setExcluirId] = useState<string | null>(null);

  const handleExcluirAnuncio = () => {
    if (excluirId) {
      removeAnuncio(excluirId);
      setExcluirId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!user || user.role !== "empresa") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito a empresas. Faça login como empresa.</p>
        <Button asChild>
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-7 w-7 text-primary" />
                  Minha conta
                </h1>
                <p className="text-muted-foreground mt-1">
                  {user.empresaNome || user.nome} • {user.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/empresa/anuncios/novo">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Novo anúncio
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="demandas" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="demandas" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Demandas recebidas
                  {demandas.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {demandas.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="anuncios" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Meus anúncios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="demandas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demandas e pedidos de contato</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Órgãos públicos que demonstraram interesse em seus produtos ou atas. Ao conectar o banco, estas demandas virão da base real.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {demandas.length === 0 ? (
                      <div className="py-6 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Nenhuma manifestação de interesse recebida ainda.
                        </p>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          As demandas aparecerão aqui quando um comprador (ente federativo, secretaria, órgão público) manifestar interesse em algum dos seus anúncios pelo catálogo.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {demandas.map((d) => (
                          <li
                            key={d.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/30"
                          >
                            <div>
                              <p className="font-medium text-foreground">{d.tipo}</p>
                              <p className="text-sm text-muted-foreground">{d.origem}</p>
                              <p className="text-sm text-muted-foreground mt-1">{d.produto}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {d.data}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={d.status === "Novo" ? "default" : "secondary"}>
                                {d.status}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/empresa/demandas/${d.id}`}>
                                  Ver detalhes
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="anuncios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Meus anúncios no catálogo</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Produtos e serviços que sua empresa oferece. Ao conectar o banco, a listagem virá da base real.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {anuncios.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">
                        Nenhum anúncio cadastrado. Use &quot;Novo anúncio&quot; para começar.
                      </p>
                    ) : (
                      <>
                        <ul className="space-y-3">
                          {anuncios.map((a) => (
                            <li
                              key={a.id}
                              className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                            >
                              <div>
                                <p className="font-medium text-foreground">{a.title}</p>
                                <p className="text-sm text-muted-foreground">{a.category}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">Ativo</Badge>
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/empresa/anuncios/${a.id}`}>
                                    Ver detalhes
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/empresa/anuncios/${a.id}/editar`}>
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Editar
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setExcluirId(a.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Excluir
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <AlertDialog open={!!excluirId} onOpenChange={(open) => !open && setExcluirId(null)}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O anúncio será removido do catálogo e de Meus anúncios.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleExcluirAnuncio}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
