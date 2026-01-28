import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  "Cadastro gratuito para empresas",
  "Acesso a órgãos públicos de todo o país",
  "Divulgação de suas Atas de Registro",
  "Receba manifestações de interesse qualificadas",
];

export function CTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Sua empresa está pronta para vender ao Governo?
              </h2>
              <p className="text-lg text-white/80 mb-6">
                Cadastre-se gratuitamente e comece a receber solicitações de órgãos públicos interessados nos seus produtos e serviços.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="font-semibold" asChild>
                  <Link to="/cadastro/empresa" className="flex items-center gap-2">
                    Quero Anunciar
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link to="/sobre">Saiba Mais</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-white/20 rounded" />
                    <div className="h-4 w-1/2 bg-white/20 rounded" />
                    <div className="h-20 w-full bg-white/10 rounded-lg mt-6" />
                    <div className="flex gap-3 mt-6">
                      <div className="h-10 w-10 rounded-lg bg-white/20" />
                      <div className="flex-1">
                        <div className="h-4 w-1/2 bg-white/20 rounded mb-2" />
                        <div className="h-3 w-3/4 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/20" />
                      <div className="flex-1">
                        <div className="h-4 w-2/3 bg-white/20 rounded mb-2" />
                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
