import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Building2, FileText, TrendingUp, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Users,
    title: "Alcance Nacional",
    description: "Conecte-se com órgãos públicos de todo o Brasil",
  },
  {
    icon: FileText,
    title: "Divulgue suas Atas",
    description: "Disponibilize ARPs para adesão (carona)",
  },
  {
    icon: TrendingUp,
    title: "Aumente suas Vendas",
    description: "Receba leads qualificados do setor público",
  },
  {
    icon: Building2,
    title: "Credibilidade",
    description: "Faça parte de um marketplace confiável",
  },
];

const estados = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

export default function Anuncie() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    contactName: "",
    email: "",
    phone: "",
    state: "",
    segment: "",
    hasAta: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Solicitação enviada!",
      description: "Nossa equipe entrará em contato em até 24 horas úteis.",
    });

    setIsSubmitting(false);
    setFormData({
      companyName: "",
      cnpj: "",
      contactName: "",
      email: "",
      phone: "",
      state: "",
      segment: "",
      hasAta: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 md:py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Anuncie sua Empresa
              </h1>
              <p className="text-lg text-white/80">
                Cadastre-se gratuitamente e comece a vender para órgãos públicos em todo o Brasil
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Benefits */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Por que anunciar no EmpresasGov?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="p-5 rounded-xl bg-card border border-border shadow-card"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <benefit.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    Cadastro 100% Gratuito
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    O cadastro básico é totalmente gratuito. Você só paga quando começar a receber leads qualificados e fechar negócios.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Preencha seus dados
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Razão Social *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        required
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => handleChange("cnpj", e.target.value)}
                        required
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nome do Responsável *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        required
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail Corporativo *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="contato@empresa.com.br"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50">
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="segment">Segmento Principal *</Label>
                      <Select value={formData.segment} onValueChange={(value) => handleChange("segment", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50">
                          <SelectItem value="ti">Equipamentos de TI</SelectItem>
                          <SelectItem value="mobiliario">Mobiliário</SelectItem>
                          <SelectItem value="veiculos">Veículos</SelectItem>
                          <SelectItem value="limpeza">Serviços de Limpeza</SelectItem>
                          <SelectItem value="escritorio">Material de Escritório</SelectItem>
                          <SelectItem value="construcao">Construção Civil</SelectItem>
                          <SelectItem value="saude">Saúde e Medicamentos</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hasAta">Possui Ata de Registro? *</Label>
                      <Select value={formData.hasAta} onValueChange={(value) => handleChange("hasAta", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border z-50">
                          <SelectItem value="sim">Sim, possuo ARP vigente</SelectItem>
                          <SelectItem value="nao">Não possuo</SelectItem>
                          <SelectItem value="processo">Em processo de registro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem Adicional (opcional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Conte-nos mais sobre seus produtos ou serviços..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Solicitação
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar, você concorda com nossos{" "}
                    <a href="/termos" className="text-primary hover:underline">Termos de Uso</a> e{" "}
                    <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
