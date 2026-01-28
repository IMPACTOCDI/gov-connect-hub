import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { ArrowLeft, Pencil, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "./Catalogo";

const ESTADOS = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
];

const CATEGORIAS = [
  "Equipamentos de TI", "Mobiliário", "Veículos", "Serviços de Limpeza",
  "Material de Escritório", "Construção Civil", "Saúde e Medicamentos",
  "Serviços de Manutenção", "Outros",
];

const PURCHASE_TYPES: Product["purchaseType"][] = ["Ata Disponível", "Dispensa", "Licitação"];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop";

export default function EmpresaAnuncioEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAnuncio, updateAnuncio } = useEmpresaAnuncios();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "product" as "product" | "service",
    state: "",
    purchaseType: "" as Product["purchaseType"] | "",
    hasAta: false,
    description: "",
    imageUrl: DEFAULT_IMAGE,
    company: "",
  });

  const product = id ? getAnuncio(id) : undefined;

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        category: product.category,
        type: product.type,
        state: product.state,
        purchaseType: product.purchaseType,
        hasAta: product.hasAta,
        description: product.description,
        imageUrl: product.imageUrl || DEFAULT_IMAGE,
        company: product.company,
      });
    }
  }, [product?.id]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "empresa" || !id) return;
    if (!form.title.trim() || !form.category || !form.state || !form.purchaseType) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, categoria, estado e modalidade de compra.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = updateAnuncio(id, {
        title: form.title.trim(),
        company: form.company.trim() || user.empresaNome || user.nome,
        category: form.category,
        type: form.type,
        state: form.state,
        hasAta: form.hasAta,
        purchaseType: form.purchaseType as Product["purchaseType"],
        imageUrl: form.imageUrl.trim() || DEFAULT_IMAGE,
        description: form.description.trim() || "Sem descrição.",
      });
      toast({
        title: "Anúncio atualizado",
        description: "As alterações foram salvas.",
      });
      navigate(`/empresa/anuncios/${id}`, { state: { product: updated }, replace: true });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o anúncio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "empresa") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Acesso restrito a empresas.</p>
        <Button asChild>
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Anúncio não encontrado</p>
            <Button asChild variant="outline">
              <Link to="/empresa">Voltar para Minha conta</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-6">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Minha conta / Meus anúncios / Editar</p>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Pencil className="h-7 w-7 text-primary" />
                Editar anúncio
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{product.title}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/empresa/anuncios/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8">
          <div className="container max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do anúncio</CardTitle>
                <p className="text-sm text-muted-foreground">Altere os campos desejados e salve.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do anúncio *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Ex: Computadores Desktop All-in-One"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo *</Label>
                      <Select value={form.type} onValueChange={(v) => handleChange("type", v as "product" | "service")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Produto</SelectItem>
                          <SelectItem value="service">Serviço</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria *</Label>
                      <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select value={form.state} onValueChange={(v) => handleChange("state", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Modalidade de compra *</Label>
                      <Select value={form.purchaseType} onValueChange={(v) => handleChange("purchaseType", v as Product["purchaseType"])}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {PURCHASE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasAta"
                      checked={form.hasAta}
                      onChange={(e) => handleChange("hasAta", e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="hasAta" className="font-normal cursor-pointer">
                      Possui Ata de Registro de Preços (ARP) para este item
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Nome da empresa (fornecedor)</Label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder={user.empresaNome || user.nome}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Descreva o produto ou serviço..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL da imagem</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => handleChange("imageUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90">
                      {isSubmitting ? "Salvando..." : (<><Send className="h-4 w-4 mr-2" />Salvar alterações</>)}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to={`/empresa/anuncios/${id}`}>Cancelar</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
