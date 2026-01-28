import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, FileText, Building2, Briefcase, Info, Phone, Handshake, LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Início", href: "/", icon: Building2 },
  { label: "Catálogo", href: "/catalogo", icon: Briefcase },
  { label: "Atas", href: "/atas", icon: FileText },
  { label: "Serviços", href: "/servicos", icon: Briefcase },
  { label: "Empresas Parceiras", href: "/empresas-parceiras", icon: Handshake },
  { label: "Sobre", href: "/sobre", icon: Info },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const ctaDesktop = user ? (
    <div className="hidden md:flex items-center gap-3">
      {user.role === "empresa" && (
        <Button variant="outline" size="sm" asChild>
          <Link to="/empresa" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Minha conta
          </Link>
        </Button>
      )}
      {user.role === "comprador" && (
        <Button variant="outline" size="sm" asChild>
          <Link to="/comprador" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Minhas solicitações
          </Link>
        </Button>
      )}
      {user.role === "gestao" && (
        <Button variant="outline" size="sm" asChild>
          <Link to="/gestao" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Painel
          </Link>
        </Button>
      )}
      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-1" />
        Sair
      </Button>
    </div>
  ) : (
    <div className="hidden md:flex items-center gap-3">
      <Button variant="outline" size="sm" asChild>
        <Link to="/login">Entrar</Link>
      </Button>
      <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
        <Link to="/cadastro/empresa" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Anuncie Conosco
        </Link>
      </Button>
    </div>
  );

  const ctaMobile = user ? (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
      {user.role === "empresa" && (
        <Button variant="outline" className="w-full" asChild>
          <Link to="/empresa" className="flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <User className="h-4 w-4" />
            Minha conta
          </Link>
        </Button>
      )}
      {user.role === "comprador" && (
        <Button variant="outline" className="w-full" asChild>
          <Link to="/comprador" className="flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <FileText className="h-4 w-4" />
            Minhas solicitações
          </Link>
        </Button>
      )}
      {user.role === "gestao" && (
        <Button variant="outline" className="w-full" asChild>
          <Link to="/gestao" className="flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <LayoutDashboard className="h-4 w-4" />
            Painel
          </Link>
        </Button>
      )}
      <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </div>
  ) : (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
      <Button variant="outline" className="w-full" asChild>
        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
      </Button>
      <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
        <Link to="/cadastro/empresa" onClick={() => setIsMenuOpen(false)}>Anuncie Conosco</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Empresas<span className="text-primary">Gov</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        {ctaDesktop}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-accent rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {ctaMobile}
          </nav>
        </div>
      )}
    </header>
  );
}
