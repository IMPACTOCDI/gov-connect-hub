import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
  getAta: (id: string) => Ata | undefined;
};

const AtasContext = createContext<AtasContextType | undefined>(undefined);

export function AtasProvider({ children }: { children: ReactNode }) {
  const [atas, setAtas] = useState<Ata[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as Ata[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const getAta = useCallback(
    (id: string) => atas.find((a) => a.id === id),
    [atas]
  );

  return (
    <AtasContext.Provider value={{ atas, getAta }}>
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
