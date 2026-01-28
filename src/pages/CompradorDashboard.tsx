import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import type { DemandaEdicao } from "@/contexts/DemandasContext";
import { Building2, FileText, LogOut, Calendar, Briefcase, Pencil, Trash2 } from "lucide-react";

export default function CompradorDashboard() {
  const { user, logout } = useAuth();
  const { getDemandasByEmail, getDemanda, updateDemanda, removeDemanda } = useDemandas();
  const navigate = useNavigate();
  const minhasSolicitacoes = user ? getDemandasByEmail(user.email) : [];

  const [editarId, setEditarId] = useState<string | null>(null);
  const [excluirId, setExcluirId] = useState<string | null>(null);
  const [formEdicao, setFormEdicao] = useState<DemandaEdicao>({
    origem: "",
    mensagem: "",
    contatoNome: "",
    contatoTelefone: "",
    uf: "",
  });

  const demandaEmEdicao = editarId ? getDemanda(editarId) : null;

  const abrirEdicao = (d: { id: string } & DemandaEdicao) => {
    setEditarId(d.id);
    setFormEdicao({
      origem: d.origem ?? "",
      mensagem: d.mensagem ?? "",
      contatoNome: d.contatoNome ?? "",
      contatoTelefone: d.contatoTelefone ?? "",
      uf: d.uf ?? "",
    });
  };

  const salvarEdicao = () => {
    if (editarId) {
      updateDemanda(editarId, formEdicao);
      setEditarId(null);
    }
  };

  const confirmarExcluir = () => {
    if (excluirId) {
      removeDemanda(excluirId);
      setExcluirId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!user || user.role !== "comprador") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito a compradores (ente federativo, secretaria, órgão público). Faça login como comprador.</p>
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
                  Minha conta (Comprador)
                </h1>
                <p className="text-muted-foreground mt-1">
                  {user.nome || "Comprador"} • {user.email}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aqui você acompanha as solicitações de contato e manifestações de interesse que enviou às empresas do catálogo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/catalogo" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Ver catálogo
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Minhas solicitações
                  {minhasSolicitacoes.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {minhasSolicitacoes.length}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manifestações de interesse que você enviou. A empresa parceira recebe na área &quot;Demandas recebidas&quot; e pode alterar o status.
                </p>
              </CardHeader>
              <CardContent>
                {minhasSolicitacoes.length === 0 ? (
                  <div className="py-8 text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Você ainda não enviou nenhuma manifestação. Acesse o catálogo, escolha um produto ou serviço e use &quot;Manifestar interesse&quot;.
                    </p>
                    <Button asChild>
                      <Link to="/catalogo">Ir para o catálogo</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                  <ul className="space-y-4">
                    {minhasSolicitacoes.map((d) => (
                      <li
                        key={d.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground">{d.tipo}</p>
                          <p className="text-sm text-muted-foreground">{d.produto}</p>
                          <p className="text-sm text-muted-foreground mt-1">Empresa: {d.company}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {d.data}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={d.status === "Novo" ? "default" : "secondary"}>
                            {d.status}
                          </Badge>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => abrirEdicao(d)}
                            title="Editar solicitação"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => setExcluirId(d.id)}
                            title="Excluir solicitação"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Apagar
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Dialog open={!!editarId} onOpenChange={(open) => !open && setEditarId(null)}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar solicitação</DialogTitle>
                      </DialogHeader>
                      {demandaEmEdicao && (
                        <div className="grid gap-4 py-2">
                          <p className="text-sm text-muted-foreground">
                            {demandaEmEdicao.tipo} — {demandaEmEdicao.produto}
                          </p>
                          <div className="space-y-2">
                            <Label htmlFor="edit-origem">Órgão / Origem</Label>
                            <Input
                              id="edit-origem"
                              value={formEdicao.origem}
                              onChange={(e) => setFormEdicao((p) => ({ ...p, origem: e.target.value }))}
                              placeholder="Ex: Prefeitura Municipal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-contato">Nome do contato</Label>
                            <Input
                              id="edit-contato"
                              value={formEdicao.contatoNome}
                              onChange={(e) => setFormEdicao((p) => ({ ...p, contatoNome: e.target.value }))}
                              placeholder="Nome completo"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-telefone">Telefone</Label>
                            <Input
                              id="edit-telefone"
                              value={formEdicao.contatoTelefone}
                              onChange={(e) => setFormEdicao((p) => ({ ...p, contatoTelefone: e.target.value }))}
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-uf">UF</Label>
                            <Input
                              id="edit-uf"
                              value={formEdicao.uf}
                              onChange={(e) => setFormEdicao((p) => ({ ...p, uf: e.target.value.toUpperCase().slice(0, 2) }))}
                              placeholder="UF"
                              maxLength={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-mensagem">Mensagem</Label>
                            <Textarea
                              id="edit-mensagem"
                              value={formEdicao.mensagem}
                              onChange={(e) => setFormEdicao((p) => ({ ...p, mensagem: e.target.value }))}
                              placeholder="Sua mensagem ou observações"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditarId(null)}>
                          Cancelar
                        </Button>
                        <Button type="button" onClick={salvarEdicao}>
                          Salvar alterações
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={!!excluirId} onOpenChange={(open) => !open && setExcluirId(null)}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir solicitação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A solicitação será removida da sua lista e a empresa não receberá mais esta demanda.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmarExcluir}
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
