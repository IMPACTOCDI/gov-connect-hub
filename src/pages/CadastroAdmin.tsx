import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Lock, User, Phone, Briefcase, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRegistro } from "@/contexts/RegistroContext";

export default function CadastroAdmin() {
  const navigate = useNavigate();
  const { isAdminEmail } = useRegistro();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Campos do formulário
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  
  // Estado de verificação de email
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [verificandoEmail, setVerificandoEmail] = useState(false);

  const verificarEmailAutorizado = async () => {
    if (!email.trim()) {
      setError("Digite um e-mail para verificar");
      return;
    }

    setVerificandoEmail(true);
    setError(null);
    
    try {
      // Verificar se o email está na lista de autorizados
      const emailAutorizado = isAdminEmail(email);
      
      if (!emailAutorizado) {
        setError("Este e-mail não está autorizado. Contate um administrador para adicionar seu e-mail à lista de autorizados.");
        setEmailVerificado(false);
        return;
      }

      // Verificar se já existe cadastro (localStorage como fallback)
      const cadastrosLocal = localStorage.getItem("govconnect_admin_cadastros");
      if (cadastrosLocal) {
        const cadastros = JSON.parse(cadastrosLocal);
        const jaExiste = cadastros.some((c: any) => c.email.toLowerCase() === email.trim().toLowerCase());
        if (jaExiste) {
          setError("Já existe um cadastro com este e-mail. Faça login ao invés de criar uma nova conta.");
          setEmailVerificado(false);
          return;
        }
      }

      // Verificar se Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "") {
        try {
          // Verificar se já existe cadastro no Supabase
          // Usar maybeSingle() em vez de single() para evitar erro 406
          const { data: cadastroExistente, error: errorBusca } = await supabase
            .from("admin_cadastros")
            .select("email")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

          if (errorBusca) {
            console.warn("⚠️ Erro ao verificar cadastro no Supabase:", errorBusca);
            // Continuar mesmo com erro - a verificação local já foi feita
          } else if (cadastroExistente) {
            setError("Já existe um cadastro com este e-mail. Faça login ao invés de criar uma nova conta.");
            setEmailVerificado(false);
            return;
          }
        } catch (supabaseError) {
          console.warn("⚠️ Erro na requisição ao Supabase:", supabaseError);
          // Continuar - a verificação local já foi feita
        }
      } else {
        console.info("ℹ️ Modo desenvolvimento: Supabase não configurado. Usando localStorage.");
      }

      setEmailVerificado(true);
      setError(null);
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      setError("Erro ao verificar e-mail. Tente novamente.");
      setEmailVerificado(false);
    } finally {
      setVerificandoEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!emailVerificado) {
      setError("Primeiro verifique se seu e-mail está autorizado.");
      return;
    }

    if (!nome.trim()) {
      setError("Digite seu nome completo.");
      return;
    }

    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Hash da senha usando bcrypt
      const bcrypt = await import("bcryptjs");
      const senhaHash = await bcrypt.hash(senha, 10);

      const novoCadastro = {
        id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: email.trim().toLowerCase(),
        nome: nome.trim(),
        senha_hash: senhaHash,
        telefone: telefone.trim() || null,
        cargo: cargo.trim() || null,
        criado_em: new Date().toISOString(),
        ativo: true,
      };

      // Verificar se Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const usarSupabase = supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "";

      if (usarSupabase) {
        try {
          // Tentar salvar no Supabase
          const { data, error: errorInsert } = await supabase
            .from("admin_cadastros")
            .insert({
              email: novoCadastro.email,
              nome: novoCadastro.nome,
              senha_hash: novoCadastro.senha_hash,
              telefone: novoCadastro.telefone,
              cargo: novoCadastro.cargo,
            })
            .select()
            .maybeSingle();

          if (errorInsert || !data) {
            throw errorInsert || new Error("Erro ao inserir cadastro");
          }

          // Registrar log de cadastro
          await supabase.from("admin_logs").insert({
            admin_id: data.id,
            email: novoCadastro.email,
            acao: "cadastro",
            sucesso: true,
            mensagem: "Cadastro de administrador realizado com sucesso",
          });

          console.log("✅ Cadastro salvo no Supabase!");
        } catch (supabaseError: any) {
          console.warn("⚠️ Erro ao salvar no Supabase, usando localStorage:", supabaseError);
          // Fallback para localStorage
          usarSupabase && console.info("Salvando no localStorage como backup...");
          salvarNoLocalStorage(novoCadastro);
        }
      } else {
        // Modo desenvolvimento: salvar no localStorage
        console.info("ℹ️ Modo desenvolvimento: Salvando no localStorage");
        salvarNoLocalStorage(novoCadastro);
      }

      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate("/login?cadastro=admin&email=" + encodeURIComponent(email));
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao cadastrar admin:", err);
      
      if (err.code === "23505") {
        setError("Já existe um cadastro com este e-mail.");
      } else {
        setError(err.message || "Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const salvarNoLocalStorage = (cadastro: any) => {
    const cadastrosLocal = localStorage.getItem("govconnect_admin_cadastros");
    const cadastros = cadastrosLocal ? JSON.parse(cadastrosLocal) : [];
    cadastros.push(cadastro);
    localStorage.setItem("govconnect_admin_cadastros", JSON.stringify(cadastros));
    console.log("✅ Cadastro salvo no localStorage!");
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Cadastro Realizado!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Seu cadastro de administrador foi realizado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para a página de login em instantes...
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Ir para Login Agora</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Cadastro de Administrador</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Crie sua conta de administrador da plataforma. Apenas e-mails autorizados podem se cadastrar.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Verificação de E-mail */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Passo 1: Verificar E-mail Autorizado
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Institucional *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@impactocdi.com.br"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailVerificado(false);
                        }}
                        disabled={emailVerificado}
                        required
                        className={emailVerificado ? "bg-green-50 border-green-500" : ""}
                      />
                      <Button
                        type="button"
                        onClick={verificarEmailAutorizado}
                        disabled={verificandoEmail || emailVerificado}
                        variant={emailVerificado ? "default" : "outline"}
                      >
                        {verificandoEmail ? (
                          "Verificando..."
                        ) : emailVerificado ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verificado
                          </>
                        ) : (
                          "Verificar"
                        )}
                      </Button>
                    </div>
                    {emailVerificado && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        E-mail autorizado! Preencha os dados abaixo.
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Campos do formulário - apenas aparecem após verificação */}
                {emailVerificado && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4" />
                        Passo 2: Dados Pessoais
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          type="text"
                          placeholder="João da Silva"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="telefone">
                            <Phone className="h-3 w-3 inline mr-1" />
                            Telefone (opcional)
                          </Label>
                          <Input
                            id="telefone"
                            type="tel"
                            placeholder="(11) 98765-4321"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cargo">
                            <Briefcase className="h-3 w-3 inline mr-1" />
                            Cargo (opcional)
                          </Label>
                          <Input
                            id="cargo"
                            type="text"
                            placeholder="Gestor de TI"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Lock className="h-4 w-4" />
                        Passo 3: Criar Senha
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="senha">Senha *</Label>
                        <Input
                          id="senha"
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          required
                          minLength={8}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use pelo menos 8 caracteres, incluindo letras e números
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                        <Input
                          id="confirmarSenha"
                          type="password"
                          placeholder="Digite a senha novamente"
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                        {isSubmitting ? (
                          "Cadastrando..."
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Criar Conta de Administrador
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  <p>
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Fazer login
                    </Link>
                  </p>
                  <p className="mt-2">
                    Seu e-mail não está autorizado?{" "}
                    <Link to="/ajuda" className="text-primary hover:underline">
                      Entre em contato
                    </Link>
                  </p>
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
