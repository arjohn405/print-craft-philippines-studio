import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="JCR Printing Services Logo" className="w-full h-full object-contain"/>
            </div>
            <span className="text-xl font-bold text-business-dark">JCR Printing Services</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('quotation')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Quotation
            </button>
            <button 
              onClick={() => scrollToSection('clients')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Our Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Button 
              onClick={() => scrollToSection('quotation')}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('quotation')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Quotation
            </button>
            <button 
              onClick={() => scrollToSection('clients')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Our Work
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Button 
              onClick={() => scrollToSection('quotation')}
              className="w-full mt-4 bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Get Quote
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};