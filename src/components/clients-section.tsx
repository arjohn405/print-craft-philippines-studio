import { useState } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, Building, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  message: string;
  rating: number;
  projectType: string;
}

interface ClientProject {
  id: string;
  clientName: string;
  projectType: string;
  quantity: string;
  description: string;
  image: string;
}

export const ClientsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Maria Santos',
      company: 'TechStart Philippines',
      role: 'Marketing Director',
      message: 'Outstanding quality and service! Our custom notebooks became the highlight of our conference. The team was professional and delivered on time.',
      rating: 5,
      projectType: 'Corporate Notebooks'
    },
    {
      id: '2',
      name: 'Carlos Mendoza',
      company: 'Verde Restaurant Group',
      role: 'Operations Manager',
      message: 'The custom uniforms exceeded our expectations. Great fabric quality and the prints have held up perfectly after months of daily use.',
      rating: 5,
      projectType: 'Staff Uniforms'
    },
    {
      id: '3',
      name: 'Jennifer Lee',
      company: 'CreativeHub Agency',
      role: 'Creative Director',
      message: 'PrintPro understood our brand vision perfectly. The promotional items were exactly what we needed for our client campaigns.',
      rating: 5,
      projectType: 'Promotional Items'
    }
  ];

  const clientProjects: ClientProject[] = [
    {
      id: '1',
      clientName: 'Metro Bank',
      projectType: 'Corporate Notebooks & Pens',
      quantity: '2,000+ items',
      description: 'Premium leather-bound notebooks and metal pens for VIP clients',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
    },
    {
      id: '2',
      clientName: 'GlobalTech Solutions',
      projectType: 'Employee T-Shirts',
      quantity: '500+ shirts',
      description: 'Company event shirts with custom designs for team building',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    {
      id: '3',
      clientName: 'FoodChain Network',
      projectType: 'Staff Jackets',
      quantity: '200+ jackets',
      description: 'Weather-resistant jackets for delivery team with embroidered logos',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentClient = testimonials[currentTestimonial];

  return (
    <section id="clients" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-business-dark mb-4">
            Trusted by
            <span className="bg-brand-gradient bg-clip-text text-transparent"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Over 500+ satisfied clients trust us with their custom merchandise needs. 
            See what they have to say about our quality and service.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-business-dark mb-2">500+</div>
            <div className="text-lg text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-business-dark mb-2">50K+</div>
            <div className="text-lg text-muted-foreground">Items Printed</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-business-dark mb-2">99%</div>
            <div className="text-lg text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto shadow-brand">
            <CardContent className="p-8">
              <div className="text-center">
                <Quote className="w-12 h-12 text-primary mx-auto mb-6" />
                
                <div className="flex justify-center mb-4">
                  {[...Array(currentClient.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-business-dark leading-relaxed mb-6 italic">
                  "{currentClient.message}"
                </blockquote>

                <div className="space-y-2">
                  <div className="text-lg font-bold text-business-dark">{currentClient.name}</div>
                  <div className="text-muted-foreground">{currentClient.role}</div>
                  <div className="text-primary font-semibold">{currentClient.company}</div>
                  <div className="text-sm text-muted-foreground">Project: {currentClient.projectType}</div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-business-dark text-center mb-12">
            Recent Project Highlights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-brand transition-shadow duration-300">
                <div className="aspect-video bg-muted">
                  <img 
                    src={project.image} 
                    alt={`${project.clientName} project`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-business-dark">{project.clientName}</h4>
                      <span className="text-sm text-primary font-semibold">{project.quantity}</span>
                    </div>
                    <div className="text-primary font-semibold">{project.projectType}</div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-hero-bg rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-business-dark mb-4">
              Ready to join our satisfied clients?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Let's discuss your custom merchandise needs and create something amazing together.
            </p>
            <Button 
              size="lg"
              onClick={() => document.getElementById('quotation')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Start Your Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};