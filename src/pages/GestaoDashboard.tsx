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
import { useDemandas } from "@/contexts/DemandasContext";
import { useEmpresasCadastradas } from "@/contexts/EmpresasCadastradasContext";
import { useRegistro } from "@/contexts/RegistroContext";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import {
  Shield,
  Building2,
  LogOut,
  Calendar,
  ArrowRight,
  Users,
  ClipboardList,
  Trash2,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GestaoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getAllDemandas, getDemandasByCompany } = useDemandas();
  const { empresas, excludedNames, removeEmpresa, excludeCompanyByName, updateEmpresaStatus } = useEmpresasCadastradas();
  const {
    getEmpresasPendentes,
    approveEmpresa: registroApproveEmpresa,
    rejectEmpresa,
    getEmpresaRegistro,
    getAdminEmails,
    addAdminEmail,
    removeAdminEmail,
  } = useRegistro();
  const { anuncios } = useEmpresaAnuncios();

  const empresasPendentes = getEmpresasPendentes();
  const adminEmails = getAdminEmails();
  const [novoAdminEmail, setNovoAdminEmail] = useState("");

  const demandas = user ? getAllDemandas() : [];

  const [excluirEmpresa, setExcluirEmpresa] = useState<{ id: string; nome: string } | null>(null);

  const handleExcluirEmpresa = () => {
    if (excluirEmpresa) {
      if (excluirEmpresa.id.startsWith("c-")) {
        excludeCompanyByName(decodeURIComponent(excluirEmpresa.id.replace(/^c-/, "")));
      } else {
        removeEmpresa(excluirEmpresa.id);
      }
      setExcluirEmpresa(null);
    }
  };

  const handleAprovarEmpresa = (id: string) => {
    registroApproveEmpresa(id);
    updateEmpresaStatus(id, "Ativo");
  };

  const handleRejeitarEmpresa = (id: string) => {
    rejectEmpresa(id);
  };

  const handleAddAdminEmail = () => {
    const e = novoAdminEmail.trim().toLowerCase();
    if (!e) return;
    addAdminEmail(e);
    setNovoAdminEmail("");
  };

  const empresasList = useMemo(() => {
    const fromCatalog = anuncios
      .map((a) => (a.company || "").trim())
      .filter((n) => n && !excludedNames.some((x) => x.trim().toLowerCase() === n.toLowerCase()));
    const catalogNames = [...new Set(fromCatalog)];
    const fromContext = empresas.filter((e) => !catalogNames.some((c) => c.toLowerCase() === (e.nome || "").toLowerCase()));
    const catalogOnly = catalogNames
      .filter((n) => !empresas.some((e) => (e.nome || "").trim().toLowerCase() === n.toLowerCase()))
      .map((nome) => ({ id: "c-" + encodeURIComponent(nome), nome, segmento: "Catálogo", status: "Ativo" as const }));
    return [...fromContext, ...catalogOnly];
  }, [empresas, anuncios, excludedNames]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!user || user.role !== "gestao") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito à gestão da plataforma. Faça login como gestão.</p>
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
                  <Shield className="h-7 w-7 text-primary" />
                  Painel de gestão
                </h1>
                <p className="text-muted-foreground mt-1">
                  {user.nome} • {user.email}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground w-fit">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="demandas" className="space-y-6">
              <TabsList className="flex flex-wrap w-full gap-1 h-auto p-1">
                <TabsTrigger value="demandas" className="flex items-center gap-2 flex-1 min-w-0">
                  <ClipboardList className="h-4 w-4 shrink-0" />
                  Demandas
                  {demandas.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {demandas.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="empresas" className="flex items-center gap-2 flex-1 min-w-0">
                  <Users className="h-4 w-4 shrink-0" />
                  Empresas
                </TabsTrigger>
                <TabsTrigger value="pendentes" className="flex items-center gap-2 flex-1 min-w-0">
                  <Clock className="h-4 w-4 shrink-0" />
                  Pendentes
                  {empresasPendentes.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {empresasPendentes.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="admins" className="flex items-center gap-2 flex-1 min-w-0">
                  <Mail className="h-4 w-4 shrink-0" />
                  Admins
                </TabsTrigger>
              </TabsList>

              <TabsContent value="demandas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Todas as demandas recebidas na plataforma</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Solicitações de contato e manifestações de interesse. Clique em Atender para ver detalhes e alterar o status.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {demandas.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma demanda registrada ainda.</p>
                    ) : (
                      <ul className="space-y-4">
                        {demandas.map((d) => (
                          <li
                            key={d.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/30"
                          >
                            <div>
                              <p className="font-medium text-foreground">{d.tipo}</p>
                              <p className="text-sm text-muted-foreground">
                                <Building2 className="h-3 w-3 inline mr-1" />
                                {d.company}
                              </p>
                              <p className="text-sm text-muted-foreground">{d.origem} • {d.produto}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {d.data}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={d.status === "Novo" ? "default" : d.status === "Concluído" ? "secondary" : "outline"}>
                                {d.status}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/gestao/demandas/${d.id}`}>
                                  Atender
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

              <TabsContent value="pendentes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Empresas aguardando aprovação
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Cadastros de empresa parceira enviados. Aprove para liberar o acesso à área da empresa ou rejeite para recusar o cadastro.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {empresasPendentes.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma empresa pendente.</p>
                    ) : (
                      <ul className="space-y-4">
                        {empresasPendentes.map((emp) => (
                          <li
                            key={emp.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/30"
                          >
                            <div>
                              <p className="font-medium text-foreground">{emp.razaoSocial}</p>
                              <p className="text-sm text-muted-foreground">{emp.nomeFantasia && emp.nomeFantasia !== emp.razaoSocial && `(${emp.nomeFantasia})`}</p>
                              <p className="text-sm text-muted-foreground">{emp.email} • {emp.segmento}</p>
                              <p className="text-xs text-muted-foreground mt-1">CNPJ: {emp.cnpj} • Cadastro em {emp.dataRegistro}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleAprovarEmpresa(emp.id)}
                                className="text-green-700 bg-green-100 hover:bg-green-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejeitarEmpresa(emp.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="admins" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      E-mails de administrador
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Apenas estes e-mails podem acessar a plataforma como administrador. Senha padrão: <code className="bg-muted px-1 rounded">admin123</code>
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="novo-admin-email">Adicionar e-mail autorizado</Label>
                        <Input
                          id="novo-admin-email"
                          type="email"
                          placeholder="admin@exemplo.com"
                          value={novoAdminEmail}
                          onChange={(e) => setNovoAdminEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAdminEmail())}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" onClick={handleAddAdminEmail} className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    {adminEmails.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">Nenhum e-mail cadastrado.</p>
                    ) : (
                      <ul className="space-y-2">
                        {adminEmails.map((email) => (
                          <li
                            key={email}
                            className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-muted/30"
                          >
                            <span className="text-sm font-medium">{email}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeAdminEmail(email)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="empresas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Empresas cadastradas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Empresas no cadastro e empresas que têm anúncios no catálogo. Clique em Ver dados para detalhes ou Excluir para remover da listagem.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {empresasList.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma empresa cadastrada.</p>
                    ) : (
                      <ul className="space-y-3">
                        {empresasList.map((e) => {
                          const demandasCount = getDemandasByCompany(e.nome).length;
                          return (
                            <li
                              key={e.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/30"
                            >
                              <div>
                                <p className="font-medium text-foreground">{e.nome}</p>
                                <p className="text-sm text-muted-foreground">{e.segmento}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {demandasCount} demanda(s) relacionada(s)
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={e.status === "Ativo" ? "default" : "outline"}>{e.status}</Badge>
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/gestao/empresas/${e.id}`}>
                                    Ver dados
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setExcluirEmpresa({ id: e.id, nome: e.nome })}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Excluir
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <AlertDialog open={!!excluirEmpresa} onOpenChange={(open) => !open && setExcluirEmpresa(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir empresa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            A empresa &quot;{excluirEmpresa?.nome}&quot; será removida da listagem de empresas cadastradas. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleExcluirEmpresa}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
