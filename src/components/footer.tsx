import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-business-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <span className="text-xl font-bold">JCR Printing Services</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner for premium custom merchandise. 
              Quality printing services since 2020.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" size="sm" className="text-white hover:text-primary" asChild>
                <a href="https://facebook.com/jcrprintingservices" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
              <Button 
              variant="ghost" size="sm" className="text-white hover:text-primary" asChild>
                <a href="https://instagram.com/jcrprintingservices" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button 
           variant="ghost" size="sm" className="text-white hover:text-primary" asChild>
                <a href="https://twitter.com/jcrprintingservices" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('quotation')}
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Get Quote
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('clients')}
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Our Work
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Custom Notebooks</li>
              <li>Branded Pens</li>
              <li>T-Shirt Printing</li>
              <li>Corporate Jackets</li>
              <li>Logo Design</li>
              <li>Bulk Orders</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-gray-300">+63 992 558 3465</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-gray-300">jcr.creativeprints@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-gray-300">1731 Bulacan St. Sta Cruz, Metro Manila</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-gray-300">Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © 2024 JCR Printing Services. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-300">
              <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer">Terms of Service</span>
              <span className="hover:text-primary cursor-pointer">FAQ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};