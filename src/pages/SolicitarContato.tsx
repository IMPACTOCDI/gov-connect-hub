import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresaAnuncios } from "@/contexts/EmpresaAnunciosContext";
import { useAtas } from "@/contexts/AtasContext";
import { useDemandas } from "@/contexts/DemandasContext";
import { mockProducts } from "@/pages/Catalogo";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SolicitarContato() {
  const [searchParams] = useSearchParams();
  const produtoId = searchParams.get("produtoId");
  const ataId = searchParams.get("ataId");
  const tipo = searchParams.get("tipo") || "Manifestação de interesse";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAnuncio, anuncios } = useEmpresaAnuncios();
  const { getAta } = useAtas();
  const { addDemanda } = useDemandas();
  const { toast } = useToast();
  const [mensagem, setMensagem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = useMemo(() => {
    if (produtoId) {
      const fromAnuncios = getAnuncio(produtoId);
      if (fromAnuncios) return fromAnuncios;
      return mockProducts.find((p) => p.id === produtoId);
    }
    return undefined;
  }, [produtoId, getAnuncio, anuncios]);

  const ata = useMemo(() => {
    if (ataId) {
      return getAta(ataId);
    }
    return undefined;
  }, [ataId, getAta]);

  const item = product || ata;
  const itemId = produtoId || ataId;

  useEffect(() => {
    if (!user) {
      const redirect = `/manifestar-interesse?${produtoId ? `produtoId=${produtoId}` : `ataId=${ataId}`}&tipo=${encodeURIComponent(tipo)}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`, { replace: true });
    }
  }, [user, navigate, produtoId, ataId, tipo]);

  if (!user) return null;

  if (!itemId || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">
              {ataId ? "Ata não encontrada" : "Produto não encontrado"}
            </p>
            <Button asChild variant="outline">
              <Link to={ataId ? "/atas" : "/catalogo"}>
                Voltar {ataId ? "às atas" : "ao catálogo"}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tipoDemanda = tipo.includes("Ata") ? "Manifestação de interesse (Ata)" : "Manifestação de interesse";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const demandaData = {
        tipo: tipoDemanda,
        origem: user.nome,
        email: user.email,
        produto: ata ? ata.titulo : (product?.title || ""),
        produtoId: itemId || "",
        company: ata ? ata.orgao : (product?.company || ""),
        mensagem: mensagem.trim() || undefined,
        contatoNome: user.nome,
      };

      addDemanda(demandaData);
      
      toast({
        title: "Manifestação enviada",
        description: ata 
          ? "Sua manifestação de interesse foi registrada. O órgão gerenciador entrará em contato em breve."
          : "Sua manifestação de interesse foi encaminhada para a empresa. Ela entrará em contato em breve.",
      });
      
      const redirectPath = ata ? `/atas/${ata.id}` : `/catalogo/${product?.id}`;
      navigate(redirectPath, { replace: true });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível enviar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-card py-6">
          <div className="container flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Manifestar interesse</p>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-7 w-7 text-primary" />
                {tipoDemanda}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sua manifestação de interesse será encaminhada para <strong>
                  {ata ? ata.orgao : product?.company}
                </strong>.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={ata ? `/atas/${ata.id}` : `/catalogo/${product?.id}`}>
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
                <CardTitle className="text-lg">
                  {ata ? ata.titulo : product?.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {ata 
                    ? `Órgão: ${ata.orgao} • ${ata.categoria}` 
                    : `Empresa: ${product?.company} • ${product?.category}`
                  }
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                    <Textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Descreva seu interesse ou solicitação..."
                      rows={4}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Seus dados de contato ({user.email}) serão enviados {ata ? "ao órgão" : "à empresa"} para que {ata ? "ele" : "ela"} possa retornar.
                  </p>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90">
                      {isSubmitting ? "Enviando..." : (<><Send className="h-4 w-4 mr-2" />Enviar manifestação</>)}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link to={ata ? `/atas/${ata.id}` : `/catalogo/${product?.id}`}>Cancelar</Link>
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
