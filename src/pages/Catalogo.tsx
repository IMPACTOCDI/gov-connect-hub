import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface Product {
  id: string;
  title: string;
  company: string;
  category: string;
  type: "product" | "service";
  state: string;
  hasAta: boolean;
  purchaseType: "Ata Disponível" | "Dispensa" | "Licitação";
  imageUrl: string;
  description: string;
}

/** Produtos/serviços fixos do catálogo (vazio; itens vêm dos anúncios das empresas). */
export const mockProducts: Product[] = [];

const categories = [
  "Software",
  "Consultoria",
  "Equipamentos de TI",
  "Mobiliário",
  "Material de Escritório",
  "Veículos",
  "Serviços de Limpeza",
  "Serviços de Manutenção",
  "Serviços de Segurança",
  "Serviços de TI",
  "Tecnologia da Informação",
];

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

export default function Catalogo() {
  const { anuncios, loading } = useEmpresaAnuncios();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allProducts = useMemo(() => [...mockProducts, ...anuncios], [anuncios]);
  const companies = useMemo(() => [...new Set(allProducts.map((p) => p.company))].sort(), [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !product.title.toLowerCase().includes(query) &&
          !product.company.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // State filter
      if (selectedStates.length > 0 && !selectedStates.includes(product.state)) {
        return false;
      }

      // Empresas filter
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(product.company)) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && product.type !== selectedType) {
        return false;
      }

      // Purchase type filter
      if (selectedPurchaseType !== "all" && product.purchaseType !== selectedPurchaseType) {
        return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, selectedCategories, selectedStates, selectedCompanies, selectedType, selectedPurchaseType]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedCompanies([]);
    setSelectedType("all");
    setSelectedPurchaseType("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStates.length > 0 ||
    selectedCompanies.length > 0 ||
    selectedType !== "all" ||
    selectedPurchaseType !== "all" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Page Header */}
        <section className="border-b border-border bg-card py-8">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Catálogo de Produtos e Serviços
            </h1>
            <p className="text-muted-foreground">
              Encontre produtos e serviços de empresas homologadas para compras públicas
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 mt-6 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar produtos, serviços ou empresas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>Buscar</Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="flex gap-8">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-72 shrink-0">
                <CatalogFilters
                  categories={categories}
                  states={states}
                  companies={companies}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedStates={selectedStates}
                  setSelectedStates={setSelectedStates}
                  selectedCompanies={selectedCompanies}
                  setSelectedCompanies={setSelectedCompanies}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedPurchaseType={selectedPurchaseType}
                  setSelectedPurchaseType={setSelectedPurchaseType}
                />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filters Button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filtros
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 overflow-y-auto">
                        <div className="py-4">
                          <CatalogFilters
                            categories={categories}
                            states={states}
                            companies={companies}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedStates={selectedStates}
                            setSelectedStates={setSelectedStates}
                            selectedCompanies={selectedCompanies}
                            setSelectedCompanies={setSelectedCompanies}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            selectedPurchaseType={selectedPurchaseType}
                            setSelectedPurchaseType={setSelectedPurchaseType}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>

                    <span className="text-sm text-muted-foreground">
                      {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                    </span>

                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                        <X className="h-4 w-4 mr-1" />
                        Limpar filtros
                      </Button>
                    )}
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Active Filters Pills */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {cat}
                        <button
                          onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== cat))}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedStates.map((state) => (
                      <span
                        key={state}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                      >
                        {state}
                        <button
                          onClick={() => setSelectedStates((prev) => prev.filter((s) => s !== state))}
                          className="hover:bg-secondary/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedCompanies.map((company) => (
                      <span
                        key={company}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm"
                      >
                        {company}
                        <button
                          onClick={() => setSelectedCompanies((prev) => prev.filter((c) => c !== company))}
                          className="hover:bg-amber-500/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedType !== "all" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                        {selectedType === "product" ? "Produtos" : "Serviços"}
                        <button
                          onClick={() => setSelectedType("all")}
                          className="hover:bg-accent/80 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedPurchaseType !== "all" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                        {selectedPurchaseType}
                        <button
                          onClick={() => setSelectedPurchaseType("all")}
                          className="hover:bg-accent/80 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Products */}
                {loading ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Carregando produtos...
                    </h3>
                    <p className="text-muted-foreground">
                      Buscando produtos e serviços disponíveis
                    </p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar os filtros ou buscar por outros termos
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
