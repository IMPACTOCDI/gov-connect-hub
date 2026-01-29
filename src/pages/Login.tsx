import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, type Role } from "@/contexts/AuthContext";
import { Lock, Mail, Building2, Shield, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const cadastro = searchParams.get("cadastro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<Role>("empresa");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, senha, role);
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (role === "empresa") {
        navigate("/empresa", { replace: true });
      } else if (role === "comprador") {
        navigate("/comprador", { replace: true });
      } else {
        navigate("/gestao", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/40 py-10 px-4">
        <div className="w-full max-w-md min-w-0">
          <Card className="shadow-card overflow-hidden">
            <CardHeader className="space-y-2 px-4 sm:px-6 pt-6 pb-4">
              <CardTitle className="text-xl sm:text-2xl font-display text-foreground break-words">
                Acesso à Plataforma
              </CardTitle>
              <p className="text-sm text-muted-foreground break-words leading-snug">
                {redirect
                  ? "Faça login para continuar. Após o login você será redirecionado para concluir sua manifestação de interesse."
                  : "Escolha o tipo de conta e informe e-mail e senha para acessar."}
              </p>
            </CardHeader>
            <CardContent className="space-y-5 px-4 sm:px-6 pb-6">
              {cadastro === "comprador" && (
                <Alert className="bg-green-50 border-green-200 text-green-800 overflow-hidden">
                  <AlertDescription className="break-words">Conta de comprador criada. Faça login com seu e-mail e senha.</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="overflow-hidden">
                  <AlertDescription className="break-words">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-5 min-w-0">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Tipo de conta</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(v) => setRole(v as Role)}
                    className="grid grid-cols-1 gap-2"
                  >
                    <Label
                      htmlFor="role-empresa"
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all min-h-[72px] ${
                        role === "empresa"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value="empresa" id="role-empresa" className="shrink-0" />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">Empresa parceira</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Anunciar e receber demandas</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="role-comprador"
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all min-h-[72px] ${
                        role === "comprador"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value="comprador" id="role-comprador" className="shrink-0" />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">Comprador</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Ente federativo, secretaria, órgão público</p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="role-gestao"
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all min-h-[72px] ${
                        role === "gestao"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value="gestao" id="role-gestao" className="shrink-0" />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">Administrador</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Gestão da plataforma</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder={role === "empresa" ? "contato@empresa.com.br" : role === "comprador" ? "comprador@teste.com" : "gestao@govconnect.com.br"}
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-9"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-xs text-muted-foreground text-center break-words px-1">
                  Use uma conta cadastrada ou crie uma nova abaixo.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2 border-t border-border flex-wrap">
                  <Button type="button" variant="link" className="text-sm shrink-0 h-auto py-1" asChild>
                    <Link to="/cadastro/comprador" className="break-words text-center">Criar conta de comprador</Link>
                  </Button>
                  <Button type="button" variant="link" className="text-sm shrink-0 h-auto py-1" asChild>
                    <Link to="/cadastro/empresa" className="break-words text-center">Cadastrar empresa (aguarda aprovação)</Link>
                  </Button>
                  {role === "gestao" && (
                    <Button type="button" variant="link" className="text-sm shrink-0 h-auto py-1 text-primary font-semibold" asChild>
                      <Link to="/cadastro/admin" className="break-words text-center">📧 Cadastrar como Admin</Link>
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
