import { useState } from "react";
import { Search, Building2, FileCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmpresasCadastradas } from "@/contexts/EmpresasCadastradasContext";
import { useAtas } from "@/contexts/AtasContext";
import { useDemandas } from "@/contexts/DemandasContext";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const { empresas } = useEmpresasCadastradas();
  const { atas } = useAtas();
  const { getAllDemandas } = useDemandas();
  const totalDemandas = getAllDemandas().length;

  const stats = [
    { icon: Building2, value: empresas.length, label: "Empresas Cadastradas" },
    { icon: FileCheck, value: atas.length, label: "Atas Disponíveis" },
    { icon: TrendingUp, value: totalDemandas, label: "Negócios Conectados" },
  ];

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6 animate-fade-up">
            <FileCheck className="h-4 w-4" />
            Marketplace oficial para compras públicas
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            O que seu órgão precisa hoje?
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Encontre produtos, serviços e Atas de Registro de Preços de empresas homologadas para adesão (carona).
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar produtos, serviços ou atas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-white border-0 shadow-hero"
              />
            </div>
            <Button size="lg" className="h-14 px-8 bg-secondary hover:bg-secondary/90 shadow-hero">
              Buscar
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {["Equipamentos de TI", "Mobiliário", "Veículos", "Serviços de Limpeza", "Material de Escritório"].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats - quantidades reais dos contextos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <stat.icon className="h-6 w-6 text-white/80 mb-2" />
                <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/70 text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}
