import { useState } from 'react';
import { Package, Shirt, Edit3, Palette, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import productsImage from '@/assets/products-showcase.jpg';

type ProductCategory = 'all' | 'notebooks' | 'pens' | 'apparel';

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  startingPrice: number;
  image: string;
  features: string[];
  popular?: boolean;
}

export const ProductsSection = () => {
  const [activeFilter, setActiveFilter] = useState<ProductCategory>('all');

  const products: Product[] = [
    {
      id: '1',
      name: 'Custom Notebooks',
      category: 'notebooks',
      startingPrice: 120,
      image: productsImage,
      features: ['A4/A5 sizes', 'Custom covers', 'Logo embossing', 'Bulk orders'],
      popular: true
    },
    {
      id: '2',
      name: 'Branded Pens',
      category: 'pens',
      startingPrice: 25,
      image: productsImage,
      features: ['Multiple colors', 'Laser engraving', 'Bulk pricing', 'Corporate gifts']
    },
    {
      id: '3',
      name: 'Custom T-Shirts',
      category: 'apparel',
      startingPrice: 280,
      image: productsImage,
      features: ['Premium cotton', 'DTG printing', 'All sizes', 'Color options'],
      popular: true
    },
    {
      id: '4',
      name: 'Corporate Jackets',
      category: 'apparel',
      startingPrice: 450,
      image: productsImage,
      features: ['Weather resistant', 'Embroidered logos', 'Premium quality', 'Team uniforms']
    }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  const scrollToQuotation = () => {
    document.getElementById('quotation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-business-dark mb-4">
            Our Premium
            <span className="bg-brand-gradient bg-clip-text text-transparent"> Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality merchandise customized with your brand. From corporate gifts to team uniforms, 
            we've got everything you need to make your brand stand out.
          </p>
        </div>

        {/* Product Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? 'bg-brand-gradient' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            All Products
          </Button>
          <Button
            variant={activeFilter === 'notebooks' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('notebooks')}
            className={activeFilter === 'notebooks' ? 'bg-brand-gradient' : ''}
          >
            <Package className="w-4 h-4 mr-2" />
            Notebooks
          </Button>
          <Button
            variant={activeFilter === 'pens' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('pens')}
            className={activeFilter === 'pens' ? 'bg-brand-gradient' : ''}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Pens
          </Button>
          <Button
            variant={activeFilter === 'apparel' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('apparel')}
            className={activeFilter === 'apparel' ? 'bg-brand-gradient' : ''}
          >
            <Shirt className="w-4 h-4 mr-2" />
            Apparel
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-brand transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.popular && (
                    <Badge className="absolute top-2 right-2 bg-brand-gradient">
                      Popular
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-business-dark mb-2">
                      {product.name}
                    </h3>
                    <div className="text-2xl font-bold text-primary">
                      ₱{product.startingPrice}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        starting from
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={scrollToQuotation}
                    className="w-full bg-brand-gradient hover:opacity-90 transition-opacity"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Customize Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-hero-bg rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-business-dark mb-4">
              Don't see what you're looking for?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              We specialize in custom solutions. Contact us for personalized product options 
              and volume pricing for your specific needs.
            </p>
            <Button 
              size="lg"
              onClick={scrollToQuotation}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Request Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};