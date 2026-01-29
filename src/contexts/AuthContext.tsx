import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRegistro } from "@/contexts/RegistroContext";
import { supabase } from "@/integrations/supabase/client";
import * as bcrypt from "bcryptjs";

/** 1 = Empresa parceira | 2 = Comprador (ente federativo) | 3 = Administrador */
export type Role = "empresa" | "comprador" | "gestao";

export interface User {
  id: string;
  email: string;
  nome: string;
  role: Role;
  empresaId?: string;
  empresaNome?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const registro = useRegistro();
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("govconnect_user");
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback(
    async (email: string, senha: string, role: Role) => {
      await new Promise((r) => setTimeout(r, 400));

      // Comprador: verificar cadastro
      if (role === "comprador") {
        const comp = registro.loginComprador(email, senha);
        if (comp) {
          const u: User = { id: comp.id, email: comp.email, nome: comp.nome, role: "comprador" };
          setUser(u);
          sessionStorage.setItem("govconnect_user", JSON.stringify(u));
          return;
        }
        throw new Error("E-mail ou senha inválidos. Crie uma conta de comprador se ainda não tiver.");
      }

      // 3) Empresa: verificar cadastro aprovado
      if (role === "empresa") {
        const emp = registro.empresas.find(
          (e) => e.email.trim().toLowerCase() === email.trim().toLowerCase() && e.senha === senha
        );
        if (emp) {
          if (emp.status === "pendente")
            throw new Error("Seu cadastro está em análise. Aguarde a aprovação do administrador.");
          if (emp.status === "rejeitado")
            throw new Error("Seu cadastro não foi aprovado. Entre em contato com o suporte.");
          if (emp.status === "aprovado") {
            const u: User = {
              id: emp.id,
              email: emp.email,
              nome: emp.nomeFantasia || emp.razaoSocial,
              role: "empresa",
              empresaId: emp.id,
              empresaNome: emp.nomeFantasia || emp.razaoSocial,
            };
            setUser(u);
            sessionStorage.setItem("govconnect_user", JSON.stringify(u));
            return;
          }
        }
        throw new Error("E-mail ou senha inválidos. Cadastre sua empresa e aguarde aprovação.");
      }

      // Administrador: verificar cadastro no Supabase ou localStorage
      if (role === "gestao") {
        let adminCadastro: any = null;
        let usouSupabase = false;

        try {
          // Verificar se Supabase está configurado
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseConfigurado = supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "";

          // Tentar buscar no Supabase primeiro
          if (supabaseConfigurado) {
            try {
              // Usar maybeSingle() para evitar erro 406
              const { data, error: errorBusca } = await supabase
                .from("admin_cadastros")
                .select("*")
                .eq("email", email.trim().toLowerCase())
                .eq("ativo", true)
                .maybeSingle();

              if (data && !errorBusca) {
                adminCadastro = data;
                usouSupabase = true;
                console.log("✅ Admin encontrado no Supabase");
              } else if (errorBusca) {
                console.warn("⚠️ Erro no Supabase, tentando localStorage:", errorBusca);
              }
            } catch (supabaseError) {
              console.warn("⚠️ Supabase inacessível, usando localStorage:", supabaseError);
            }
          }

          // Se não encontrou no Supabase, buscar no localStorage
          if (!adminCadastro) {
            const cadastrosLocal = localStorage.getItem("govconnect_admin_cadastros");
            if (cadastrosLocal) {
              const cadastros = JSON.parse(cadastrosLocal);
              adminCadastro = cadastros.find(
                (c: any) => c.email.toLowerCase() === email.trim().toLowerCase() && c.ativo !== false
              );
              if (adminCadastro) {
                console.log("✅ Admin encontrado no localStorage");
              }
            }
          }

          // Se não encontrou cadastro, tentar senha padrão
          if (!adminCadastro) {
            if (registro.isAdminEmail(email) && registro.checkAdminSenha(senha)) {
              const u: User = {
                id: "gestao-" + Date.now(),
                email: email.trim(),
                nome: "Administrador",
                role: "gestao",
              };
              setUser(u);
              sessionStorage.setItem("govconnect_user", JSON.stringify(u));
              console.log("✅ Login com senha padrão");
              return;
            }
            throw new Error("E-mail ou senha inválidos. Cadastre-se em /cadastro/admin");
          }

          // Verificar senha com bcrypt
          const senhaValida = await bcrypt.compare(senha, adminCadastro.senha_hash);
          
          if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos.");
          }

          // Login bem-sucedido
          const u: User = {
            id: adminCadastro.id,
            email: adminCadastro.email,
            nome: adminCadastro.nome,
            role: "gestao",
          };
          setUser(u);
          sessionStorage.setItem("govconnect_user", JSON.stringify(u));

          // Atualizar último acesso se foi do Supabase
          if (usouSupabase) {
            try {
              await Promise.all([
                supabase
                  .from("admin_cadastros")
                  .update({ ultimo_acesso: new Date().toISOString() })
                  .eq("id", adminCadastro.id),
                supabase.from("admin_logs").insert({
                  admin_id: adminCadastro.id,
                  email: adminCadastro.email,
                  acao: "login",
                  sucesso: true,
                  mensagem: "Login realizado com sucesso",
                }),
              ]);
            } catch (logError) {
              console.warn("⚠️ Erro ao registrar log, mas login foi bem-sucedido:", logError);
            }
          }

          console.log("✅ Login realizado com sucesso!");
          return;
        } catch (err: any) {
          console.error("❌ Erro ao fazer login como admin:", err);
          throw new Error(err.message || "Erro ao fazer login. Tente novamente.");
        }
      }

      throw new Error("E-mail ou senha inválidos.");
    },
    [registro]
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("govconnect_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
