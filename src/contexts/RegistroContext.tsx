import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  const [adminEmails, setAdminEmails] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_ADMIN_EMAILS, [])
  );

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
    (email: string) => {
      const e = email.trim().toLowerCase();
      if (!e) return;
      if (adminEmails.some((a) => a.toLowerCase() === e)) return;
      persistAdminEmails([...adminEmails, e]);
    },
    [adminEmails, persistAdminEmails]
  );

  const removeAdminEmail = useCallback(
    (email: string) => {
      const e = email.trim().toLowerCase();
      persistAdminEmails(adminEmails.filter((a) => a.toLowerCase() !== e));
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
