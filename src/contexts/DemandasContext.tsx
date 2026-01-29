import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  demandas: Demanda[];
  loading: boolean;
  addDemanda: (d: Omit<Demanda, "id" | "data" | "status">) => Demanda;
  getAllDemandas: () => Demanda[];
  getDemandasByCompany: (company: string) => Demanda[];
  getDemandasByEmail: (email: string) => Demanda[];
  getDemanda: (id: string) => Demanda | undefined;
  updateDemandaStatus: (id: string, status: string) => void;
  updateDemanda: (id: string, data: Partial<DemandaEdicao>) => void;
  removeDemanda: (id: string) => void;
  refreshDemandas: () => Promise<void>;
};

const DemandasContext = createContext<DemandasContextType | undefined>(undefined);

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function DemandasProvider({ children }: { children: ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar demandas do Supabase
  const fetchDemandas = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('demandas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar demandas:', error);
        return;
      }

      // Converter dados do Supabase para o formato Demanda
      const demandasFormatadas: Demanda[] = data.map(demanda => ({
        id: demanda.id,
        tipo: demanda.tipo as TipoDemanda,
        origem: demanda.origem,
        email: demanda.email,
        produto: demanda.produto,
        produtoId: demanda.produto_id,
        company: demanda.company,
        data: demanda.data,
        status: demanda.status,
        mensagem: demanda.mensagem || undefined,
        contatoNome: demanda.contato_nome || undefined,
        contatoTelefone: demanda.contato_telefone || undefined,
        uf: demanda.uf || undefined
      }));

      setDemandas(demandasFormatadas);
    } catch (err) {
      console.error('Erro ao buscar demandas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDemandas();
  }, [fetchDemandas]);

  const refreshDemandas = useCallback(async () => {
    await fetchDemandas();
  }, [fetchDemandas]);

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
    <DemandasContext.Provider value={{ demandas, loading, addDemanda, getAllDemandas, getDemandasByCompany, getDemandasByEmail, getDemanda, updateDemandaStatus, updateDemanda, removeDemanda, refreshDemandas }}>
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
