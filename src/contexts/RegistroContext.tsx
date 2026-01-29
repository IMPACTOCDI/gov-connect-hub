import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Comprador: qualquer um pode se cadastrar. */
export interface CompradorRegistrado {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

/** Empresa: cadastro completo; só acessa após aprovação do admin. */
export type StatusEmpresaRegistro = "pendente" | "aprovado" | "rejeitado";

export interface EmpresaRegistrada {
  id: string;
  email: string;
  senha: string;
  status: StatusEmpresaRegistro;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  nomeContato: string;
  segmento: string;
  site?: string;
  dataRegistro: string;
}

const STORAGE_COMPRADORES = "govconnect_compradores_registrados";
const STORAGE_EMPRESAS = "govconnect_empresas_registradas";
const STORAGE_ADMIN_EMAILS = "govconnect_admin_emails";

const ADMIN_SENHA_PADRAO = "admin123"; // senha única para todos os admins (mock)
const ADMIN_EMAIL_INICIAL = "admin@impactocdi.com.br"; // email admin padrão

type RegistroContextType = {
  compradores: CompradorRegistrado[];
  empresas: EmpresaRegistrada[];
  adminEmails: string[];
  registerComprador: (nome: string, email: string, senha: string) => void;
  registerEmpresa: (dados: Omit<EmpresaRegistrada, "id" | "status" | "dataRegistro">) => EmpresaRegistrada;
  getEmpresasPendentes: () => EmpresaRegistrada[];
  approveEmpresa: (id: string) => void;
  rejectEmpresa: (id: string) => void;
  getEmpresaRegistro: (id: string) => EmpresaRegistrada | undefined;
  loginComprador: (email: string, senha: string) => CompradorRegistrado | null;
  loginEmpresa: (email: string, senha: string) => EmpresaRegistrada | null;
  isAdminEmail: (email: string) => boolean;
  checkAdminSenha: (senha: string) => boolean;
  getAdminEmails: () => string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
};

const RegistroContext = createContext<RegistroContextType | undefined>(undefined);

function loadJson<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s) as T;
  } catch {}
  return fallback;
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function RegistroProvider({ children }: { children: ReactNode }) {
  const [compradores, setCompradores] = useState<CompradorRegistrado[]>(() =>
    loadJson<CompradorRegistrado[]>(STORAGE_COMPRADORES, [])
  );
  const [empresas, setEmpresas] = useState<EmpresaRegistrada[]>(() =>
    loadJson<EmpresaRegistrada[]>(STORAGE_EMPRESAS, [])
  );
  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    const stored = loadJson<string[]>(STORAGE_ADMIN_EMAILS, []);
    // Garantir que o admin inicial sempre esteja presente
    const adminInicialLower = ADMIN_EMAIL_INICIAL.toLowerCase();
    const hasAdminInicial = stored.some(email => email.toLowerCase() === adminInicialLower);
    
    if (!hasAdminInicial) {
      const withAdminInicial = [ADMIN_EMAIL_INICIAL, ...stored];
      saveJson(STORAGE_ADMIN_EMAILS, withAdminInicial);
      console.log('✅ Email admin inicial adicionado:', ADMIN_EMAIL_INICIAL);
      return withAdminInicial;
    }
    
    console.log('✅ Emails admin carregados do localStorage:', stored);
    return stored;
  });

  // Carregar e sincronizar emails do Supabase ao inicializar
  useEffect(() => {
    const carregarEmailsSupabase = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === "undefined" || supabaseUrl === "") {
        console.info("ℹ️ Supabase não configurado. Usando apenas localStorage para emails admin.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("admin_emails_autorizados")
          .select("email")
          .eq("ativo", true);

        if (error) throw error;

        if (data && data.length > 0) {
          const emailsSupabase = data.map((item) => item.email);
          
          // Mesclar com emails do localStorage (sem duplicar)
          const emailsUnicos = Array.from(
            new Set([...adminEmails, ...emailsSupabase])
          );
          
          // Garantir que o email inicial está presente
          if (!emailsUnicos.some(e => e.toLowerCase() === ADMIN_EMAIL_INICIAL.toLowerCase())) {
            emailsUnicos.unshift(ADMIN_EMAIL_INICIAL);
          }
          
          setAdminEmails(emailsUnicos);
          saveJson(STORAGE_ADMIN_EMAILS, emailsUnicos);
          console.log("✅ Emails admin carregados do Supabase:", emailsUnicos);
          
          // Sincronizar: adicionar no Supabase os que estão no localStorage mas não no Supabase
          const emailsParaSincronizar = adminEmails.filter(
            e => !emailsSupabase.some(es => es.toLowerCase() === e.toLowerCase())
          );
          
          if (emailsParaSincronizar.length > 0) {
            console.log("🔄 Sincronizando emails do localStorage para Supabase:", emailsParaSincronizar);
            await Promise.all(
              emailsParaSincronizar.map(email =>
                supabase.from("admin_emails_autorizados").insert({
                  email,
                  adicionado_por: "sistema_sync",
                })
              )
            );
          }
        } else {
          console.info("ℹ️ Nenhum email no Supabase. Sincronizando emails do localStorage...");
          
          // Se Supabase está vazio, adicionar os emails do localStorage
          if (adminEmails.length > 0) {
            const resultados = await Promise.allSettled(
              adminEmails.map(async email => {
                try {
                  const { error } = await supabase.from("admin_emails_autorizados").insert({
                    email,
                    adicionado_por: "sistema_inicial",
                  });
                  
                  if (error) {
                    // Ignorar erro de duplicata (código 23505)
                    if (error.code !== "23505") {
                      throw error;
                    }
                  }
                  return { email, sucesso: true };
                } catch (err) {
                  console.warn("⚠️ Erro ao sincronizar email:", email, err);
                  return { email, sucesso: false, erro: err };
                }
              })
            );
            
            const sucessos = resultados.filter(r => r.status === "fulfilled" && r.value.sucesso).length;
            if (sucessos > 0) {
              console.log(`✅ ${sucessos} email(s) sincronizado(s) para Supabase!`);
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Erro ao carregar emails do Supabase. Usando localStorage:", error);
      }
    };

    carregarEmailsSupabase();
  }, []); // Executar apenas uma vez ao montar

  const persistCompradores = useCallback((next: CompradorRegistrado[]) => {
    saveJson(STORAGE_COMPRADORES, next);
    setCompradores(next);
  }, []);

  const persistEmpresas = useCallback((next: EmpresaRegistrada[]) => {
    saveJson(STORAGE_EMPRESAS, next);
    setEmpresas(next);
  }, []);

  const persistAdminEmails = useCallback((next: string[]) => {
    saveJson(STORAGE_ADMIN_EMAILS, next);
    setAdminEmails(next);
  }, []);

  const registerComprador = useCallback(
    (nome: string, email: string, senha: string) => {
      const e = email.trim().toLowerCase();
      if (compradores.some((c) => c.email.toLowerCase() === e))
        throw new Error("Já existe uma conta com este e-mail.");
      const novo: CompradorRegistrado = {
        id: "comp-" + Date.now(),
        nome: nome.trim(),
        email: e,
        senha,
      };
      persistCompradores([...compradores, novo]);
    },
    [compradores, persistCompradores]
  );

  const registerEmpresa = useCallback(
    (dados: Omit<EmpresaRegistrada, "id" | "status" | "dataRegistro">) => {
      const e = dados.email.trim().toLowerCase();
      const existente = empresas.find((x) => x.email.toLowerCase() === e);
      if (existente && existente.status !== "rejeitado")
        throw new Error("Já existe cadastro com este e-mail.");
      const dataRegistro = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const nova: EmpresaRegistrada = {
        ...dados,
        id: "emp-reg-" + Date.now(),
        status: "pendente",
        dataRegistro,
      };
      persistEmpresas([...empresas, nova]);
      return nova;
    },
    [empresas, persistEmpresas]
  );

  const getEmpresasPendentes = useCallback(
    () => empresas.filter((e) => e.status === "pendente"),
    [empresas]
  );

  const getEmpresaRegistro = useCallback(
    (id: string) => empresas.find((e) => e.id === id),
    [empresas]
  );

  const approveEmpresa = useCallback(
    (id: string) => {
      setEmpresas((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, status: "aprovado" as const } : e));
        saveJson(STORAGE_EMPRESAS, next);
        return next;
      });
    },
    []
  );

  const rejectEmpresa = useCallback(
    (id: string) => {
      setEmpresas((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, status: "rejeitado" as const } : e));
        saveJson(STORAGE_EMPRESAS, next);
        return next;
      });
    },
    []
  );

  const loginComprador = useCallback(
    (email: string, senha: string) => {
      const e = email.trim().toLowerCase();
      const c = compradores.find((x) => x.email.toLowerCase() === e && x.senha === senha);
      return c ?? null;
    },
    [compradores]
  );

  const loginEmpresa = useCallback(
    (email: string, senha: string) => {
      const e = email.trim().toLowerCase();
      const emp = empresas.find(
        (x) => x.email.toLowerCase() === e && x.senha === senha && x.status === "aprovado"
      );
      return emp ?? null;
    },
    [empresas]
  );

  const isAdminEmail = useCallback(
    (email: string) => adminEmails.some((a) => a.trim().toLowerCase() === email.trim().toLowerCase()),
    [adminEmails]
  );

  const checkAdminSenha = useCallback((senha: string) => senha === ADMIN_SENHA_PADRAO, []);

  const getAdminEmails = useCallback(() => [...adminEmails], [adminEmails]);

  const addAdminEmail = useCallback(
    async (email: string) => {
      const e = email.trim().toLowerCase();
      if (!e) return;
      if (adminEmails.some((a) => a.toLowerCase() === e)) return;
      
      // Adicionar no localStorage
      const novosEmails = [...adminEmails, e];
      persistAdminEmails(novosEmails);
      
      // Tentar adicionar no Supabase também
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "") {
        try {
          await supabase.from("admin_emails_autorizados").insert({
            email: e,
            adicionado_por: "sistema", // Poderia ser o email do admin logado
          });
          console.log("✅ Email adicionado no Supabase:", e);
        } catch (error) {
          console.warn("⚠️ Erro ao adicionar email no Supabase, mas foi salvo no localStorage:", error);
        }
      } else {
        console.info("ℹ️ Email adicionado apenas no localStorage (Supabase não configurado)");
      }
    },
    [adminEmails, persistAdminEmails]
  );

  const removeAdminEmail = useCallback(
    async (email: string) => {
      const e = email.trim().toLowerCase();
      
      // Remover do localStorage
      persistAdminEmails(adminEmails.filter((a) => a.toLowerCase() !== e));
      
      // Tentar remover do Supabase também
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "") {
        try {
          await supabase
            .from("admin_emails_autorizados")
            .delete()
            .eq("email", e);
          console.log("✅ Email removido do Supabase:", e);
        } catch (error) {
          console.warn("⚠️ Erro ao remover email do Supabase, mas foi removido do localStorage:", error);
        }
      } else {
        console.info("ℹ️ Email removido apenas do localStorage (Supabase não configurado)");
      }
    },
    [adminEmails, persistAdminEmails]
  );

  return (
    <RegistroContext.Provider
      value={{
        compradores,
        empresas,
        adminEmails,
        registerComprador,
        registerEmpresa,
        getEmpresasPendentes,
        approveEmpresa,
        rejectEmpresa,
        getEmpresaRegistro,
        loginComprador,
        loginEmpresa,
        isAdminEmail,
        checkAdminSenha,
        getAdminEmails,
        addAdminEmail,
        removeAdminEmail,
      }}
    >
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const ctx = useContext(RegistroContext);
  if (ctx === undefined) throw new Error("useRegistro deve ser usado dentro de RegistroProvider");
  return ctx;
}
