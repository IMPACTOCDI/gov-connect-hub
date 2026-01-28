import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CatalogFiltersProps {
  categories: string[];
  states: string[];
  companies: string[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStates: string[];
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCompanies: string[];
  setSelectedCompanies: React.Dispatch<React.SetStateAction<string[]>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  selectedPurchaseType: string;
  setSelectedPurchaseType: React.Dispatch<React.SetStateAction<string>>;
}

export function CatalogFilters({
  categories,
  states,
  companies,
  selectedCategories,
  setSelectedCategories,
  selectedStates,
  setSelectedStates,
  selectedCompanies,
  setSelectedCompanies,
  selectedType,
  setSelectedType,
  selectedPurchaseType,
  setSelectedPurchaseType,
}: CatalogFiltersProps) {
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">Filtros</h2>

      <Accordion type="multiple" defaultValue={["type", "category", "companies", "state", "purchase"]} className="space-y-2">
        {/* Tipo */}
        <AccordionItem value="type" className="border-b border-border">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
            Tipo
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <RadioGroup value={selectedType} onValueChange={setSelectedType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="type-all" />
                <Label htmlFor="type-all" className="text-sm font-normal cursor-pointer">
                  Todos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="product" id="type-product" />
                <Label htmlFor="type-product" className="text-sm font-normal cursor-pointer">
                  Produtos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="type-service" />
                <Label htmlFor="type-service" className="text-sm font-normal cursor-pointer">
                  Serviços
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Modalidade de Compra */}
        <AccordionItem value="purchase" className="border-b border-border">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
            Modalidade de Compra
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <RadioGroup value={selectedPurchaseType} onValueChange={setSelectedPurchaseType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="purchase-all" />
                <Label htmlFor="purchase-all" className="text-sm font-normal cursor-pointer">
                  Todas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Ata Disponível" id="purchase-ata" />
                <Label htmlFor="purchase-ata" className="text-sm font-normal cursor-pointer">
                  Ata Disponível
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Dispensa" id="purchase-dispensa" />
                <Label htmlFor="purchase-dispensa" className="text-sm font-normal cursor-pointer">
                  Dispensa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Licitação" id="purchase-licitacao" />
                <Label htmlFor="purchase-licitacao" className="text-sm font-normal cursor-pointer">
                  Licitação
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Empresas */}
        <AccordionItem value="companies" className="border-b border-border">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
            Empresas
            {selectedCompanies.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {selectedCompanies.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ScrollArea className="h-40">
              <div className="space-y-2 pr-4">
                {companies.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={() => toggleCompany(company)}
                    />
                    <Label
                      htmlFor={`company-${company}`}
                      className="text-sm font-normal cursor-pointer leading-tight truncate"
                    >
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Categoria */}
        <AccordionItem value="category" className="border-b border-border">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
            Categoria
            {selectedCategories.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label
                    htmlFor={`cat-${category}`}
                    className="text-sm font-normal cursor-pointer leading-tight"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estado */}
        <AccordionItem value="state" className="border-0">
          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
            Localização (Estado)
            {selectedStates.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-secondary/10 text-secondary rounded-full">
                {selectedStates.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {states.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`state-${state}`}
                      checked={selectedStates.includes(state)}
                      onCheckedChange={() => toggleState(state)}
                    />
                    <Label
                      htmlFor={`state-${state}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {state}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
