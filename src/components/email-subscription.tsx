import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const EmailSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      // Store in localStorage for owner dashboard
      const subscriptionData = {
        email,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        source: 'website'
      };

      const existingSubscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]');
      
      // Check if email already exists
      const emailExists = existingSubscriptions.some((sub: any) => sub.email === email);
      
      if (emailExists) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our daily promotions.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      existingSubscriptions.push(subscriptionData);
      localStorage.setItem('emailSubscriptions', JSON.stringify(existingSubscriptions));

      // Simulate sending welcome email and setting up daily promotions
      console.log('Setting up daily promotions for:', email);
      
      toast({
        title: "Successfully Subscribed!",
        description: "Welcome to daily promotions! You'll receive exclusive offers and deals every day starting tomorrow.",
      });

      setEmail('');
      setIsSubscribed(true);
      setIsSubmitting(false);

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-20 bg-hero-bg">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-brand">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-business-dark">
                  Subscribe to Daily Promotions
                </h3>
                <p className="text-lg text-muted-foreground">
                  Get exclusive daily promotions and special offers delivered straight to your inbox. 
                  Be the first to know about flash sales, new product launches, and member-only discounts.
                </p>
              </div>

              {isSubscribed ? (
                <div className="flex items-center justify-center space-x-2 text-success">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !email}
                      className="bg-brand-gradient hover:opacity-90 transition-opacity sm:px-8"
                    >
                      {isSubmitting ? (
                        "Subscribing..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Join 500+ customers getting daily deals. We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-semibold text-business-dark mb-1">Daily Deals</div>
                  <div className="text-sm text-muted-foreground">Fresh promotions delivered daily</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-business-dark mb-1">Flash Sales</div>
                  <div className="text-sm text-muted-foreground">Limited-time offers up to 50% off</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-business-dark mb-1">Member Exclusive</div>
                  <div className="text-sm text-muted-foreground">Subscriber-only pricing & products</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};