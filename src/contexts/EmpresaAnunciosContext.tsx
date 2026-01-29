import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/pages/Catalogo";

type EmpresaAnunciosContextType = {
  anuncios: Product[];
  loading: boolean;
  addAnuncio: (p: Omit<Product, "id"> & { id?: string }) => Product;
  updateAnuncio: (id: string, data: Partial<Omit<Product, "id">>) => Product | undefined;
  removeAnuncio: (id: string) => void;
  getAnuncio: (id: string) => Product | undefined;
  getAnunciosByEmpresa: (empresaId: string) => Product[];
  refreshAnuncios: () => Promise<void>;
};

const EmpresaAnunciosContext = createContext<EmpresaAnunciosContextType | undefined>(undefined);

export function EmpresaAnunciosProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnuncios] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar anúncios do Supabase
  const fetchAnuncios = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar anúncios:', error);
        return;
      }

      // Converter dados do Supabase para o formato Product
      const produtos: Product[] = data.map(anuncio => ({
        id: anuncio.id,
        title: anuncio.title,
        company: anuncio.company,
        category: anuncio.category,
        type: anuncio.type as "product" | "service",
        state: anuncio.state,
        hasAta: anuncio.has_ata,
        purchaseType: anuncio.purchase_type as "Ata Disponível" | "Dispensa" | "Licitação",
        imageUrl: anuncio.image_url || '/placeholder.svg',
        description: anuncio.description || ''
      }));

      setAnuncios(produtos);
    } catch (err) {
      console.error('Erro ao buscar anúncios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchAnuncios();
  }, [fetchAnuncios]);

  const refreshAnuncios = useCallback(async () => {
    await fetchAnuncios();
  }, [fetchAnuncios]);

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

  const getAnunciosByEmpresa = useCallback(
    (empresaId: string) => {
      // Buscar anúncios que pertencem à empresa específica
      // Como não temos empresa_id no Product, vamos usar o nome da empresa
      return anuncios.filter((a) => a.company === empresaId || a.id.includes(empresaId));
    },
    [anuncios]
  );

  return (
    <EmpresaAnunciosContext.Provider value={{ anuncios, loading, addAnuncio, updateAnuncio, removeAnuncio, getAnuncio, getAnunciosByEmpresa, refreshAnuncios }}>
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
