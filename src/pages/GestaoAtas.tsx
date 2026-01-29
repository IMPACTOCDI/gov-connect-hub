import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useAtas } from "@/contexts/AtasContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  FileText,
  Plus,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const categorias = [
  "Tecnologia da Informação",
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
  "Obras e Reformas",
  "Material de Construção",
  "Equipamentos Médicos",
  "Medicamentos",
  "Alimentação",
];

const modalidades = [
  "Pregão Eletrônico",
  "Pregão Presencial",
  "Concorrência",
  "Tomada de Preços",
  "Convite",
  "Dispensa de Licitação",
  "Inexigibilidade",
];

export default function GestaoAtas() {
  const { user } = useAuth();
  const { atas, loading, refreshAtas } = useAtas();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    orgao: "",
    estado: "",
    categoria: "",
    modalidade: "",
    numero: "",
    vigenciaInicio: "",
    vigenciaFim: "",
    situacao: "Vigente" as "Vigente" | "Encerrada",
    valorEstimado: "",
    linkEdital: "",
    descricao: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('atas')
        .insert({
          titulo: formData.titulo,
          orgao: formData.orgao,
          estado: formData.estado,
          categoria: formData.categoria,
          modalidade: formData.modalidade,
          numero: formData.numero,
          vigencia_inicio: formData.vigenciaInicio,
          vigencia_fim: formData.vigenciaFim,
          situacao: formData.situacao,
          valor_estimado: formData.valorEstimado || null,
          link_edital: formData.linkEdital || null,
          descricao: formData.descricao || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Ata criada com sucesso!",
        description: "A nova ata foi adicionada ao sistema.",
      });

      // Limpar formulário
      setFormData({
        titulo: "",
        orgao: "",
        estado: "",
        categoria: "",
        modalidade: "",
        numero: "",
        vigenciaInicio: "",
        vigenciaFim: "",
        situacao: "Vigente",
        valorEstimado: "",
        linkEdital: "",
        descricao: "",
      });

      setShowForm(false);
      await refreshAtas();

    } catch (error: any) {
      console.error('Erro ao criar ata:', error);
      toast({
        title: "Erro ao criar ata",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "gestao") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito à gestão da plataforma.</p>
        <Button asChild>
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/gestao">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar ao Dashboard
                    </Link>
                  </Button>
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-7 w-7 text-primary" />
                  Gestão de Atas
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerenciar Atas de Registro de Preços da plataforma
                </p>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="h-4 w-4 mr-2" />
                {showForm ? "Cancelar" : "Nova Ata"}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container space-y-6">
            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Nova Ata de Registro de Preços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="titulo">Título da Ata *</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => handleInputChange("titulo", e.target.value)}
                          placeholder="Ex: Ata de Registro de Preços - Licenças de Software"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="orgao">Órgão Responsável *</Label>
                        <Input
                          id="orgao"
                          value={formData.orgao}
                          onChange={(e) => handleInputChange("orgao", e.target.value)}
                          placeholder="Ex: Secretaria de Administração - SP"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="numero">Número da Ata *</Label>
                        <Input
                          id="numero"
                          value={formData.numero}
                          onChange={(e) => handleInputChange("numero", e.target.value)}
                          placeholder="Ex: ARP-001/2026"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="estado">Estado *</Label>
                        <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estados.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="categoria">Categoria *</Label>
                        <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="modalidade">Modalidade *</Label>
                        <Select value={formData.modalidade} onValueChange={(value) => handleInputChange("modalidade", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a modalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {modalidades.map((modalidade) => (
                              <SelectItem key={modalidade} value={modalidade}>
                                {modalidade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="situacao">Situação *</Label>
                        <Select value={formData.situacao} onValueChange={(value) => handleInputChange("situacao", value as "Vigente" | "Encerrada")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Vigente">Vigente</SelectItem>
                            <SelectItem value="Encerrada">Encerrada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="vigenciaInicio">Vigência - Início *</Label>
                        <Input
                          id="vigenciaInicio"
                          type="date"
                          value={formData.vigenciaInicio}
                          onChange={(e) => handleInputChange("vigenciaInicio", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="vigenciaFim">Vigência - Fim *</Label>
                        <Input
                          id="vigenciaFim"
                          type="date"
                          value={formData.vigenciaFim}
                          onChange={(e) => handleInputChange("vigenciaFim", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="valorEstimado">Valor Estimado</Label>
                        <Input
                          id="valorEstimado"
                          value={formData.valorEstimado}
                          onChange={(e) => handleInputChange("valorEstimado", e.target.value)}
                          placeholder="Ex: R$ 2.500.000,00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkEdital">Link do Edital</Label>
                        <Input
                          id="linkEdital"
                          type="url"
                          value={formData.linkEdital}
                          onChange={(e) => handleInputChange("linkEdital", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={formData.descricao}
                          onChange={(e) => handleInputChange("descricao", e.target.value)}
                          placeholder="Descrição detalhada da ata..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Criando..." : "Criar Ata"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Atas Cadastradas ({atas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando atas...</p>
                  </div>
                ) : atas.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma ata cadastrada ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {atas.map((ata) => (
                      <div
                        key={ata.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{ata.titulo}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {ata.orgao}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {ata.estado}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {ata.vigenciaInicio} a {ata.vigenciaFim}
                            </div>
                            {ata.valorEstimado && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {ata.valorEstimado}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={ata.situacao === "Vigente" ? "default" : "secondary"}>
                              {ata.situacao}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{ata.categoria}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/atas/${ata.id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                          {ata.linkEdital && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={ata.linkEdital} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Edital
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}