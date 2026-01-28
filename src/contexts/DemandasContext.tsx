import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type TipoDemanda = "Manifestação de interesse" | "Manifestação de interesse (Ata)";

export interface Demanda {
  id: string;
  tipo: TipoDemanda;
  origem: string;
  email: string;
  produto: string;
  produtoId: string;
  company: string;
  data: string;
  status: string;
  mensagem?: string;
  contatoNome?: string;
  contatoTelefone?: string;
  uf?: string;
}

const STORAGE_KEY = "govconnect_demandas";

/** Campos editáveis pelo comprador na sua solicitação */
export type DemandaEdicao = Pick<Demanda, "origem" | "mensagem" | "contatoNome" | "contatoTelefone" | "uf">;

type DemandasContextType = {
  addDemanda: (d: Omit<Demanda, "id" | "data" | "status">) => Demanda;
  getAllDemandas: () => Demanda[];
  getDemandasByCompany: (company: string) => Demanda[];
  getDemandasByEmail: (email: string) => Demanda[];
  getDemanda: (id: string) => Demanda | undefined;
  updateDemandaStatus: (id: string, status: string) => void;
  updateDemanda: (id: string, data: Partial<DemandaEdicao>) => void;
  removeDemanda: (id: string) => void;
};

const DemandasContext = createContext<DemandasContextType | undefined>(undefined);

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function DemandasProvider({ children }: { children: ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as Demanda[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const addDemanda = useCallback((d: Omit<Demanda, "id" | "data" | "status">): Demanda => {
    const id = "d" + Date.now();
    const companyNorm = (d.company || "").trim();
    const nova: Demanda = {
      ...d,
      company: companyNorm,
      id,
      data: formatDate(),
      status: "Novo",
    };
    setDemandas((prev) => {
      const next = [...prev, nova];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return nova;
  }, []);

  const getAllDemandas = useCallback(() => [...demandas], [demandas]);

  const getDemandasByCompany = useCallback(
    (company: string) => {
      const c = (company || "").trim().toLowerCase();
      return demandas.filter((d) => (d.company || "").trim().toLowerCase() === c);
    },
    [demandas]
  );

  const getDemandasByEmail = useCallback(
    (email: string) => {
      const e = (email || "").trim().toLowerCase();
      return demandas.filter((d) => (d.email || "").trim().toLowerCase() === e);
    },
    [demandas]
  );

  const getDemanda = useCallback(
    (id: string) => demandas.find((d) => d.id === id),
    [demandas]
  );

  const updateDemandaStatus = useCallback((id: string, status: string) => {
    setDemandas((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateDemanda = useCallback((id: string, data: Partial<DemandaEdicao>) => {
    setDemandas((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...data } : d));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeDemanda = useCallback((id: string) => {
    setDemandas((prev) => {
      const next = prev.filter((d) => d.id !== id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <DemandasContext.Provider value={{ addDemanda, getAllDemandas, getDemandasByCompany, getDemandasByEmail, getDemanda, updateDemandaStatus, updateDemanda, removeDemanda }}>
      {children}
    </DemandasContext.Provider>
  );
}

export function useDemandas() {
  const ctx = useContext(DemandasContext);
  if (ctx === undefined) {
    throw new Error("useDemandas deve ser usado dentro de DemandasProvider");
  }
  return ctx;
}
