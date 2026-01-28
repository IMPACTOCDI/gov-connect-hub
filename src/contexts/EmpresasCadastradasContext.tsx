import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface EmpresaCadastrada {
  id: string;
  nome: string;
  segmento: string;
  status: "Ativo" | "Pendente aprovação" | "Excluído";
  email?: string;
  telefone?: string;
  estado?: string;
  cnpj?: string;
  contato?: string;
}

const STORAGE_KEY = "govconnect_empresas_cadastradas";
const EXCLUDED_KEY = "govconnect_empresas_excluidas";

type EmpresasCadastradasContextType = {
  empresas: EmpresaCadastrada[];
  excludedNames: string[];
  getEmpresa: (id: string) => EmpresaCadastrada | undefined;
  removeEmpresa: (id: string) => void;
  excludeCompanyByName: (nome: string) => void;
  addEmpresaFromAnuncio: (nome: string, segmento?: string) => void;
  /** Cadastro de empresa (pendente aprovação). id = id do registro (emp-reg-xxx). */
  addEmpresaPendente: (id: string, nome: string, segmento: string, email: string, contato?: string, estado?: string) => void;
  /** Atualiza status para Ativo (após aprovação do admin). */
  updateEmpresaStatus: (id: string, status: "Ativo" | "Excluído") => void;
};

const EmpresasCadastradasContext = createContext<EmpresasCadastradasContextType | undefined>(undefined);

export function EmpresasCadastradasProvider({ children }: { children: ReactNode }) {
  const [empresas, setEmpresas] = useState<EmpresaCadastrada[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as EmpresaCadastrada[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [excludedNames, setExcludedNames] = useState<string[]>(() => {
    const stored = sessionStorage.getItem(EXCLUDED_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as string[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const getEmpresa = useCallback(
    (id: string) => empresas.find((e) => e.id === id),
    [empresas]
  );

  const removeEmpresa = useCallback((id: string) => {
    setEmpresas((prev) => {
      const next = prev.filter((e) => e.id !== id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const excludeCompanyByName = useCallback((nome: string) => {
    const n = (nome || "").trim();
    if (!n) return;
    setExcludedNames((prev) => {
      if (prev.some((x) => x.trim().toLowerCase() === n.toLowerCase())) return prev;
      const next = [...prev, n];
      sessionStorage.setItem(EXCLUDED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addEmpresaFromAnuncio = useCallback((nome: string, segmento?: string) => {
    const n = (nome || "").trim();
    if (!n) return;
    setEmpresas((prev) => {
      if (prev.some((e) => (e.nome || "").trim().toLowerCase() === n.toLowerCase())) return prev;
      const nova: EmpresaCadastrada = {
        id: "e" + Date.now(),
        nome: n,
        segmento: segmento || "Outros",
        status: "Ativo",
      };
      const next = [...prev, nova];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addEmpresaPendente = useCallback(
    (id: string, nome: string, segmento: string, email: string, contato?: string, estado?: string) => {
      const n = (nome || "").trim();
      if (!n) return;
      setEmpresas((prev) => {
        if (prev.some((e) => e.id === id)) return prev;
        const nova: EmpresaCadastrada = {
          id,
          nome: n,
          segmento: segmento || "Outros",
          status: "Pendente aprovação",
          email,
          contato,
          estado,
        };
        const next = [...prev, nova];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const updateEmpresaStatus = useCallback((id: string, status: "Ativo" | "Excluído") => {
    setEmpresas((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, status } : e));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <EmpresasCadastradasContext.Provider value={{ empresas, excludedNames, getEmpresa, removeEmpresa, excludeCompanyByName, addEmpresaFromAnuncio, addEmpresaPendente, updateEmpresaStatus }}>
      {children}
    </EmpresasCadastradasContext.Provider>
  );
}

export function useEmpresasCadastradas() {
  const ctx = useContext(EmpresasCadastradasContext);
  if (ctx === undefined) {
    throw new Error("useEmpresasCadastradas deve ser usado dentro de EmpresasCadastradasProvider");
  }
  return ctx;
}
