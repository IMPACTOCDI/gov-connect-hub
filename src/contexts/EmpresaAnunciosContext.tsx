import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Product } from "@/pages/Catalogo";

type EmpresaAnunciosContextType = {
  anuncios: Product[];
  addAnuncio: (p: Omit<Product, "id"> & { id?: string }) => Product;
  updateAnuncio: (id: string, data: Partial<Omit<Product, "id">>) => Product | undefined;
  removeAnuncio: (id: string) => void;
  getAnuncio: (id: string) => Product | undefined;
};

const EmpresaAnunciosContext = createContext<EmpresaAnunciosContextType | undefined>(undefined);

export function EmpresaAnunciosProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnuncios] = useState<Product[]>(() => {
    const stored = sessionStorage.getItem("govconnect_empresa_anuncios");
    if (stored) {
      try {
        return JSON.parse(stored) as Product[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const addAnuncio = useCallback((p: Omit<Product, "id"> & { id?: string }): Product => {
    const id = p.id ?? "a" + Date.now();
    const newProduct: Product = {
      ...p,
      id,
      company: p.company || "Minha Empresa",
    };
    setAnuncios((prev) => {
      const next = [...prev, newProduct];
      sessionStorage.setItem("govconnect_empresa_anuncios", JSON.stringify(next));
      return next;
    });
    return newProduct;
  }, []);

  const updateAnuncio = useCallback((id: string, data: Partial<Omit<Product, "id">>): Product | undefined => {
    const current = anuncios.find((a) => a.id === id);
    if (!current) return undefined;
    const updated: Product = { ...current, ...data };
    setAnuncios((prev) => {
      const next = prev.map((a) => (a.id === id ? updated : a));
      sessionStorage.setItem("govconnect_empresa_anuncios", JSON.stringify(next));
      return next;
    });
    return updated;
  }, [anuncios]);

  const removeAnuncio = useCallback((id: string) => {
    setAnuncios((prev) => {
      const next = prev.filter((a) => a.id !== id);
      sessionStorage.setItem("govconnect_empresa_anuncios", JSON.stringify(next));
      return next;
    });
  }, []);

  const getAnuncio = useCallback(
    (id: string) => anuncios.find((a) => a.id === id),
    [anuncios]
  );

  return (
    <EmpresaAnunciosContext.Provider value={{ anuncios, addAnuncio, updateAnuncio, removeAnuncio, getAnuncio }}>
      {children}
    </EmpresaAnunciosContext.Provider>
  );
}

export function useEmpresaAnuncios() {
  const ctx = useContext(EmpresaAnunciosContext);
  if (ctx === undefined) {
    throw new Error("useEmpresaAnuncios deve ser usado dentro de EmpresaAnunciosProvider");
  }
  return ctx;
}
