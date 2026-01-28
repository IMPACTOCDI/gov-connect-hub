import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Empresas<span className="text-primary">Gov</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conectando empresas e órgãos públicos para compras governamentais mais eficientes e transparentes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/atas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Atas de Registro
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/empresas-parceiras" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Empresas Parceiras
                </Link>
              </li>
              <li>
                <Link to="/cadastro/empresa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Anuncie Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Institucional</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/ajuda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contato@empresasgov.com.br
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                (11) 4000-0000
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Brasília - DF, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EmpresasGov. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Facilitando compras públicas em todo o Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
