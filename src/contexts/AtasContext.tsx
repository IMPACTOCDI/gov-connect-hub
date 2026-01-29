import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Ata {
  id: string;
  titulo: string;
  orgao: string;
  estado: string;
  categoria: string;
  modalidade: string;
  numero: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  situacao: "Vigente" | "Encerrada";
  valorEstimado: string;
  linkEdital?: string;
  descricao: string;
}

const STORAGE_KEY = "govconnect_atas";

type AtasContextType = {
  atas: Ata[];
  loading: boolean;
  getAta: (id: string) => Ata | undefined;
  refreshAtas: () => Promise<void>;
};

const AtasContext = createContext<AtasContextType | undefined>(undefined);

export function AtasProvider({ children }: { children: ReactNode }) {
  const [atas, setAtas] = useState<Ata[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar atas do Supabase
  const fetchAtas = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('atas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar atas:', error);
        return;
      }

      // Converter dados do Supabase para o formato Ata
      const atasFormatadas: Ata[] = data.map(ata => ({
        id: ata.id,
        titulo: ata.titulo,
        orgao: ata.orgao,
        estado: ata.estado,
        categoria: ata.categoria,
        modalidade: ata.modalidade,
        numero: ata.numero,
        vigenciaInicio: ata.vigencia_inicio,
        vigenciaFim: ata.vigencia_fim,
        situacao: ata.situacao as "Vigente" | "Encerrada",
        valorEstimado: ata.valor_estimado || '',
        linkEdital: ata.link_edital || undefined,
        descricao: ata.descricao || ''
      }));

      setAtas(atasFormatadas);
    } catch (err) {
      console.error('Erro ao buscar atas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchAtas();
  }, [fetchAtas]);

  const refreshAtas = useCallback(async () => {
    await fetchAtas();
  }, [fetchAtas]);

  const getAta = useCallback(
    (id: string) => atas.find((a) => a.id === id),
    [atas]
  );

  return (
    <AtasContext.Provider value={{ atas, loading, getAta, refreshAtas }}>
      {children}
    </AtasContext.Provider>
  );
}

export function useAtas() {
  const ctx = useContext(AtasContext);
  if (ctx === undefined) {
    throw new Error("useAtas deve ser usado dentro de AtasProvider");
  }
  return ctx;
}
