import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, FileText, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAtas } from "@/contexts/AtasContext";

const estados = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

const categorias = [
  "Equipamentos de TI",
  "Mobiliário",
  "Material de Escritório",
  "Serviços de Limpeza",
  "Serviços de Manutenção",
  "Serviços de Segurança",
  "Serviços de TI",
  "Veículos",
];

const modalidades = ["Pregão Eletrônico", "Pregão Presencial", "Concorrência", "Dispensa", "Inexigibilidade"];

export default function Atas() {
  const { atas, loading } = useAtas();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [selectedModalidade, setSelectedModalidade] = useState<string>("todas");
  const [selectedSituacao, setSelectedSituacao] = useState<string>("todas");

  const empresasOrgaos = useMemo(() => [...new Set(atas.map((a) => a.orgao))].sort(), [atas]);

  const filteredAtas = useMemo(() => {
    return atas.filter((ata) => {
      const query = searchQuery.toLowerCase().trim();

      if (query) {
        const text = `${ata.titulo} ${ata.orgao} ${ata.numero} ${ata.descricao}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      if (selectedEmpresa !== "todos" && ata.orgao !== selectedEmpresa) return false;
      if (selectedEstado !== "todos" && ata.estado !== selectedEstado) return false;
      if (selectedCategoria !== "todas" && ata.categoria !== selectedCategoria) return false;
      if (selectedModalidade !== "todas" && ata.modalidade !== selectedModalidade) return false;
      if (selectedSituacao !== "todas" && ata.situacao !== selectedSituacao) return false;

      return true;
    });
  }, [atas, searchQuery, selectedEmpresa, selectedEstado, selectedCategoria, selectedModalidade, selectedSituacao]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedEmpresa("todos");
    setSelectedEstado("todos");
    setSelectedCategoria("todas");
    setSelectedModalidade("todas");
    setSelectedSituacao("todas");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero / Header da página */}
        <section className="border-b border-border bg-card py-8">
          <div className="container space-y-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                Atas de Registro de Preços
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Encontre Atas de Registro de Preços vigentes em todo o Brasil e identifique oportunidades de
                adesão (carona) para o seu órgão.
              </p>
            </div>

            {/* Busca principal */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número da ata, órgão, objeto..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>

              {/* Filtros mobile em sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
                  <div className="p-4">
                    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </h2>
                    <ScrollArea className="h-[calc(100vh-8rem)] pr-3">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Empresas / Órgão
                          </span>
                          <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              {empresasOrgaos.map((orgao) => (
                                <SelectItem key={orgao} value={orgao}>
                                  {orgao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Estado
                          </span>
                          <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              {estados.map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Categoria
                          </span>
                          <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todas">Todas</SelectItem>
                              {categorias.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Modalidade
                          </span>
                          <Select value={selectedModalidade} onValueChange={setSelectedModalidade}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todas">Todas</SelectItem>
                              {modalidades.map((mod) => (
                                <SelectItem key={mod} value={mod}>
                                  {mod}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Situação
                          </span>
                          <Select value={selectedSituacao} onValueChange={setSelectedSituacao}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todas">Todas</SelectItem>
                              <SelectItem value="Vigente">Vigente</SelectItem>
                              <SelectItem value="Encerrada">Encerrada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </section>

        {/* Conteúdo principal */}
        <section className="py-8">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
              {/* Filtros desktop */}
              <aside className="hidden lg:block space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Filtros
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Empresas / Órgão
                      </span>
                      <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          {empresasOrgaos.map((orgao) => (
                            <SelectItem key={orgao} value={orgao}>
                              {orgao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Estado
                      </span>
                      <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          {estados.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Categoria
                      </span>
                      <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          {categorias.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Modalidade
                      </span>
                      <Select value={selectedModalidade} onValueChange={setSelectedModalidade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          {modalidades.map((mod) => (
                            <SelectItem key={mod} value={mod}>
                              {mod}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        Situação
                      </span>
                      <Select value={selectedSituacao} onValueChange={setSelectedSituacao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          <SelectItem value="Vigente">Vigente</SelectItem>
                          <SelectItem value="Encerrada">Encerrada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </aside>

              {/* Lista de atas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredAtas.length} ata{filteredAtas.length !== 1 ? "s" : ""} encontrada
                    {filteredAtas.length !== 1 ? "s" : ""}.
                  </p>
                </div>

                {filteredAtas.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-10 text-center">
                    <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-display text-lg font-semibold mb-1">
                      Nenhuma ata encontrada
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Ajuste os filtros ou tente uma nova busca para encontrar Atas de Registro de Preços.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAtas.map((ata) => (
                      <Card key={ata.id} className="border border-border shadow-sm">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-base md:text-lg flex flex-wrap items-center gap-2">
                              {ata.titulo}
                              <Badge variant="secondary" className="text-[11px]">
                                {ata.numero}
                              </Badge>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {ata.orgao} • {ata.estado}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={ata.situacao === "Vigente" ? "default" : "outline"}
                              className={
                                ata.situacao === "Vigente"
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : ""
                              }
                            >
                              {ata.situacao}
                            </Badge>
                            <Badge variant="outline" className="text-[11px]">
                              {ata.modalidade}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{ata.descricao}</p>

                          <div className="grid gap-3 md:grid-cols-4 text-xs md:text-sm">
                            <div className="space-y-1">
                              <span className="text-muted-foreground font-medium">Categoria</span>
                              <p>{ata.categoria}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground font-medium">Vigência</span>
                              <p className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {ata.vigenciaInicio} a {ata.vigenciaFim}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground font-medium">Valor estimado</span>
                              <p>{ata.valorEstimado}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground font-medium">Aderência</span>
                              <p>Disponível para carona conforme regras do órgão gerenciador.</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 mt-2">
                            <p className="text-[11px] text-muted-foreground max-w-md">
                              Para detalhes completos da ata, inclusive itens e condições de adesão, acesse o edital
                              ou entre em contato com o órgão gerenciador.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ata.linkEdital && (
                                <Button asChild size="sm" variant="outline">
                                  <a href={ata.linkEdital} target="_blank" rel="noreferrer">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Ver edital / ata
                                  </a>
                                </Button>
                              )}
                              <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90">
                                <Link to={`/cadastro/empresa?ata=${encodeURIComponent(ata.numero)}`}>
                                  Manifestar interesse
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

