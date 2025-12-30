import { ArrowRight, Star, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuotationCalculator } from './quotation-calculator';
import heroImage from '@/assets/header2.png';

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-hero-bg pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-business-dark leading-tight">
                Custom
                <span className="bg-brand-gradient bg-clip-text text-transparent"> Merchandise </span>
                That Speaks Your Brand
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Premium custom printing services for notebooks, pens, shirts, and jackets. 
                Transform your brand vision into high-quality merchandise that makes an impact. In collaboration with <span className="text-l md:text-l font-bold text-business-dark leading-tight">JCR Creatives.</span>
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-business-dark">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-business-dark">24-48h</div>
                <div className="text-sm text-muted-foreground">Fast Turnaround</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-gradient rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold text-business-dark">95%</div>
                <div className="text-sm text-muted-foreground">Quality Guarantee</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('quotation')}
                className="bg-brand-gradient hover:opacity-90 transition-opacity text-lg px-8"
              >
                Get Instant Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('products')}
                className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View Products
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-brand">
              <img 
                src={heroImage} 
                alt="Custom printing merchandise showcase" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="text-2xl font-bold text-primary">₱120</div>
              <div className="text-sm text-muted-foreground">Starting from</div>
            </div>
          </div>
        </div>

        {/* Quotation Calculator */}
        <div className="mt-20">
          <QuotationCalculator />
        </div>
      </div>
    </section>
  );
};