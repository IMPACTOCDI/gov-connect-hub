import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRegistro } from "@/contexts/RegistroContext";

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

      // Administrador: apenas e-mails autorizados + senha padrão
      if (role === "gestao") {
        if (registro.isAdminEmail(email) && registro.checkAdminSenha(senha)) {
          const u: User = {
            id: "gestao-" + Date.now(),
            email: email.trim(),
            nome: "Administrador",
            role: "gestao",
          };
          setUser(u);
          sessionStorage.setItem("govconnect_user", JSON.stringify(u));
          return;
        }
        throw new Error("Acesso restrito. Use um e-mail autorizado e a senha de administrador.");
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
