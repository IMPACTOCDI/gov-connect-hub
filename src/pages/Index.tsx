import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturedAtas } from "@/components/home/FeaturedAtas";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
        <FeaturedProducts />
        <FeaturedAtas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
