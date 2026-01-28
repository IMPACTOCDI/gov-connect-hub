import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Product } from "./Catalogo";

const categories = [
  "Serviços de Limpeza",
  "Serviços de Manutenção",
  "Serviços de Segurança",
  "Serviços de TI",
];

const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

const mockServices: Product[] = [];

const companies = [...new Set(mockServices.map((s) => s.company))].sort();

export default function Servicos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Nesta página, o tipo é sempre "service"
  const selectedType = "service";
  const setSelectedType = () => {};

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !service.title.toLowerCase().includes(query) &&
          !service.company.toLowerCase().includes(query) &&
          !service.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) {
        return false;
      }

      // State filter
      if (selectedStates.length > 0 && !selectedStates.includes(service.state)) {
        return false;
      }

      // Empresas filter
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(service.company)) {
        return false;
      }

      // Purchase type filter
      if (selectedPurchaseType !== "all" && service.purchaseType !== selectedPurchaseType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, selectedStates, selectedCompanies, selectedPurchaseType]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedCompanies([]);
    setSelectedPurchaseType("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStates.length > 0 ||
    selectedCompanies.length > 0 ||
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
              Serviços para Órgãos Públicos
            </h1>
            <p className="text-muted-foreground">
              Encontre serviços especializados já preparados para atender às demandas do setor público.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 mt-6 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar serviços ou empresas..."
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

              {/* Services Grid */}
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
                      {filteredServices.length} serviço{filteredServices.length !== 1 ? "s" : ""} encontrado
                      {filteredServices.length !== 1 ? "s" : ""}.
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

                {/* Services */}
                {filteredServices.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {filteredServices.map((service) => (
                      <ProductCard key={service.id} product={service} viewMode={viewMode} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Nenhum serviço encontrado
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

