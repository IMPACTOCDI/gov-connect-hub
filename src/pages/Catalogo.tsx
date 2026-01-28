import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Computadores Desktop All-in-One 23.8\"",
    company: "TechSolutions Brasil",
    category: "Equipamentos de TI",
    type: "product",
    state: "São Paulo",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
    description: "Computador All-in-One com processador Intel Core i5, 8GB RAM, 256GB SSD.",
  },
  {
    id: "2",
    title: "Cadeiras Ergonômicas Presidente",
    company: "Móveis Corporativos LTDA",
    category: "Mobiliário",
    type: "product",
    state: "Minas Gerais",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
    description: "Cadeira ergonômica com apoio lombar, braços reguláveis e rodízios.",
  },
  {
    id: "3",
    title: "Serviço de Limpeza Predial",
    company: "CleanMax Serviços",
    category: "Serviços de Limpeza",
    type: "service",
    state: "Rio de Janeiro",
    hasAta: false,
    purchaseType: "Dispensa",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    description: "Serviço completo de limpeza e conservação predial com equipe especializada.",
  },
  {
    id: "4",
    title: "Papel A4 Sulfite - Resma 500 folhas",
    company: "Papelaria Nacional",
    category: "Material de Escritório",
    type: "product",
    state: "São Paulo",
    hasAta: false,
    purchaseType: "Licitação",
    imageUrl: "https://images.unsplash.com/photo-1568205631-15a5b4e06d00?w=400&h=300&fit=crop",
    description: "Papel sulfite A4 75g/m², alta alvura, ideal para impressão.",
  },
  {
    id: "5",
    title: "Notebooks Empresariais 14\"",
    company: "InfoTech Distribuidora",
    category: "Equipamentos de TI",
    type: "product",
    state: "Distrito Federal",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description: "Notebook empresarial com Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro.",
  },
  {
    id: "6",
    title: "Mesas de Reunião 2.40m",
    company: "Office Design Brasil",
    category: "Mobiliário",
    type: "product",
    state: "Paraná",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    description: "Mesa de reunião para 8 pessoas, tampo em MDP, estrutura metálica.",
  },
  {
    id: "7",
    title: "Serviço de Manutenção de Ar-Condicionado",
    company: "RefriClima Engenharia",
    category: "Serviços de Manutenção",
    type: "service",
    state: "Bahia",
    hasAta: false,
    purchaseType: "Dispensa",
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
    description: "Manutenção preventiva e corretiva de sistemas de climatização.",
  },
  {
    id: "8",
    title: "Veículo Sedan 1.6 Flex",
    company: "Auto Frotas Brasil",
    category: "Veículos",
    type: "product",
    state: "Goiás",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    description: "Sedan completo, motor 1.6 flex, direção elétrica, ar-condicionado.",
  },
  {
    id: "9",
    title: "Impressoras Multifuncionais Laser",
    company: "PrinterPro Tecnologia",
    category: "Equipamentos de TI",
    type: "product",
    state: "Santa Catarina",
    hasAta: false,
    purchaseType: "Licitação",
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop",
    description: "Impressora multifuncional laser monocromática, 40ppm, duplex automático.",
  },
  {
    id: "10",
    title: "Serviço de Vigilância Patrimonial",
    company: "SecureGuard Segurança",
    category: "Serviços de Segurança",
    type: "service",
    state: "Pernambuco",
    hasAta: true,
    purchaseType: "Ata Disponível",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    description: "Vigilância armada e desarmada 24h com monitoramento eletrônico.",
  },
  {
    id: "11",
    title: "Armários de Aço 4 Portas",
    company: "MetalOffice Ind.",
    category: "Mobiliário",
    type: "product",
    state: "Rio Grande do Sul",
    hasAta: false,
    purchaseType: "Dispensa",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    description: "Armário de aço com 4 portas, prateleiras ajustáveis, pintura epóxi.",
  },
  {
    id: "12",
    title: "Serviço de Consultoria em TI",
    company: "DataConsult Soluções",
    category: "Serviços de TI",
    type: "service",
    state: "Ceará",
    hasAta: false,
    purchaseType: "Licitação",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    description: "Consultoria especializada em infraestrutura, segurança e governança de TI.",
  },
];

const categories = [
  "Equipamentos de TI",
  "Mobiliário",
  "Material de Escritório",
  "Veículos",
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

export default function Catalogo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
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
  }, [searchQuery, selectedCategories, selectedStates, selectedType, selectedPurchaseType]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedType("all");
    setSelectedPurchaseType("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStates.length > 0 ||
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
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedStates={selectedStates}
                  setSelectedStates={setSelectedStates}
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
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedStates={selectedStates}
                            setSelectedStates={setSelectedStates}
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
                {filteredProducts.length > 0 ? (
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
