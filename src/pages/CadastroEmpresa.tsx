import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistro } from "@/contexts/RegistroContext";
import { useEmpresasCadastradas } from "@/contexts/EmpresasCadastradasContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Lock, FileText, MapPin, Phone, User, Globe } from "lucide-react";

export default function CadastroEmpresa() {
  const { registerEmpresa } = useRegistro();
  const { addEmpresaPendente } = useEmpresasCadastradas();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [segmento, setSegmento] = useState("");
  const [site, setSite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setIsSubmitting(true);
    try {
      const empresa = registerEmpresa({
        email: email.trim(),
        senha,
        razaoSocial: razaoSocial.trim(),
        nomeFantasia: nomeFantasia.trim() || razaoSocial.trim(),
        cnpj: cnpj.trim(),
        inscricaoEstadual: inscricaoEstadual.trim() || undefined,
        endereco: endereco.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || undefined,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim(),
        cep: cep.trim(),
        telefone: telefone.trim(),
        nomeContato: nomeContato.trim(),
        segmento: segmento.trim() || "Outros",
        site: site.trim() || undefined,
      });
      addEmpresaPendente(
        empresa.id,
        empresa.razaoSocial,
        empresa.segmento,
        empresa.email,
        empresa.nomeContato,
        empresa.uf
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40 py-10">
          <div className="container max-w-md">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-green-600">
                  <Building2 className="h-6 w-6" />
                  Cadastro enviado
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Seus dados foram recebidos. O cadastro de empresa parceira precisa ser aprovado pelo administrador da plataforma. Você receberá retorno em breve. Enquanto isso, acompanhe seu e-mail.
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/login">Ir para login</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-muted/40">
        <div className="container max-w-2xl">
          <Card className="shadow-card">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-display text-foreground flex items-center gap-2">
                <Building2 className="h-7 w-7 text-primary" />
                Cadastro de empresa parceira
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha os dados da empresa. Após o envio, o administrador da plataforma analisará e aprovará seu cadastro. Só então você poderá acessar a área da empresa e publicar anúncios.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dados da empresa
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="razaoSocial">Razão social *</Label>
                      <Input
                        id="razaoSocial"
                        required
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        placeholder="Razão social"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="nomeFantasia">Nome fantasia</Label>
                      <Input
                        id="nomeFantasia"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        placeholder="Nome fantasia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input
                        id="cnpj"
                        required
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inscricaoEstadual">Inscrição estadual</Label>
                      <Input
                        id="inscricaoEstadual"
                        value={inscricaoEstadual}
                        onChange={(e) => setInscricaoEstadual(e.target.value)}
                        placeholder="IE"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="segmento">Segmento *</Label>
                      <Input
                        id="segmento"
                        value={segmento}
                        onChange={(e) => setSegmento(e.target.value)}
                        placeholder="Ex: Equipamentos de TI, Mobiliário"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="site">Site</Label>
                      <div className="relative">
                        <Globe className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="site"
                          type="url"
                          value={site}
                          onChange={(e) => setSite(e.target.value)}
                          placeholder="https://"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        required
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="endereco">Logradouro *</Label>
                      <Input
                        id="endereco"
                        required
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        placeholder="Rua, avenida"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        required
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Nº"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        placeholder="Sala, andar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        required
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        placeholder="Bairro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        required
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF *</Label>
                      <Input
                        id="uf"
                        required
                        maxLength={2}
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        placeholder="UF"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contato e acesso
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeContato">Nome do responsável *</Label>
                      <Input
                        id="nomeContato"
                        required
                        value={nomeContato}
                        onChange={(e) => setNomeContato(e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="telefone"
                          required
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="email">E-mail de acesso *</Label>
                      <div className="relative">
                        <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contato@empresa.com.br"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative">
                        <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="senha"
                          type="password"
                          required
                          minLength={6}
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar senha *</Label>
                      <div className="relative">
                        <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmarSenha"
                          type="password"
                          required
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          placeholder="Repita a senha"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar cadastro para aprovação"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Já tem conta aprovada?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Entrar
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
