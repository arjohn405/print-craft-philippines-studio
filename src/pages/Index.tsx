import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { ProductsSection } from '@/components/products-section';
import { ClientsSection } from '@/components/clients-section';
import { QuotationForm } from '@/components/quotation-form';
import { EmailSubscription } from '@/components/email-subscription';
import { Footer } from '@/components/footer';
import { Dashboard } from '@/components/dashboard';

const Index = () => {
  const location = useLocation();
  const isDashboard = location.search.includes('dashboard=true');

  if (isDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <ClientsSection />
      <QuotationForm />
      <EmailSubscription />
      <Footer />
    </div>
  );
};

export default Index;
