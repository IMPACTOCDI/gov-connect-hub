import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistroProvider } from "@/contexts/RegistroContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { EmpresaAnunciosProvider } from "@/contexts/EmpresaAnunciosContext";
import { DemandasProvider } from "@/contexts/DemandasContext";
import { EmpresasCadastradasProvider } from "@/contexts/EmpresasCadastradasContext";
import { AtasProvider } from "@/contexts/AtasContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EmpresaLayout } from "@/components/EmpresaLayout";
import { GestaoLayout } from "@/components/GestaoLayout";
import Index from "./pages/Index";
import Anuncie from "./pages/Anuncie";
import Catalogo from "./pages/Catalogo";
import Atas from "./pages/Atas";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";
import EmpresasParceiras from "./pages/EmpresasParceiras";
import Login from "./pages/Login";
import CadastroComprador from "./pages/CadastroComprador";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import CompradorDashboard from "./pages/CompradorDashboard";
import GestaoDashboard from "./pages/GestaoDashboard";
import GestaoDemandaDetalhe from "./pages/GestaoDemandaDetalhe";
import GestaoEmpresaDetalhe from "./pages/GestaoEmpresaDetalhe";
import DemandaDetalhe from "./pages/DemandaDetalhe";
import EmpresaAnuncioNovo from "./pages/EmpresaAnuncioNovo";
import EmpresaAnuncioEditar from "./pages/EmpresaAnuncioEditar";
import EmpresaAnuncioDetalhe from "./pages/EmpresaAnuncioDetalhe";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import Ajuda from "./pages/Ajuda";
import CatalogoDetalhe from "./pages/CatalogoDetalhe";
import AtaDetalhe from "./pages/AtaDetalhe";
import SolicitarContato from "./pages/SolicitarContato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RegistroProvider>
      <AuthProvider>
        <BrowserRouter>
          <EmpresaAnunciosProvider>
          <DemandasProvider>
          <EmpresasCadastradasProvider>
          <AtasProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/anuncie" element={<Anuncie />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<CatalogoDetalhe />} />
            <Route path="/manifestar-interesse" element={<SolicitarContato />} />
            <Route path="/atas" element={<Atas />} />
            <Route path="/atas/:id" element={<AtaDetalhe />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/empresas-parceiras" element={<EmpresasParceiras />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro/comprador" element={<CadastroComprador />} />
            <Route path="/cadastro/empresa" element={<CadastroEmpresa />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/comprador" element={<CompradorDashboard />} />
              <Route path="/empresa" element={<EmpresaLayout />}>
                <Route index element={<EmpresaDashboard />} />
                <Route path="demandas/:id" element={<DemandaDetalhe />} />
                <Route path="anuncios/novo" element={<EmpresaAnuncioNovo />} />
                <Route path="anuncios/:id/editar" element={<EmpresaAnuncioEditar />} />
                <Route path="anuncios/:id" element={<EmpresaAnuncioDetalhe />} />
              </Route>
              <Route path="/gestao" element={<GestaoLayout />}>
                <Route index element={<GestaoDashboard />} />
                <Route path="demandas/:id" element={<GestaoDemandaDetalhe />} />
                <Route path="empresas/:id" element={<GestaoEmpresaDetalhe />} />
              </Route>
            </Route>
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/ajuda" element={<Ajuda />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AtasProvider>
          </EmpresasCadastradasProvider>
          </DemandasProvider>
          </EmpresaAnunciosProvider>
        </BrowserRouter>
      </AuthProvider>
      </RegistroProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
