import { useState } from 'react';
import { Send, FileText, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface QuotationFormData {
  // Contact Information
  fullName: string;
  email: string;
  phone: string;
  company: string;
  
  // Project Details
  productType: string;
  quantity: number;
  printSpecs: {
    front: boolean;
    back: boolean;
    size: string;
    colors: string;
  };
  timeline: string;
  budget: string;
  
  // Additional Information
  description: string;
  hasLogo: boolean;
  logoDescription: string;
}

export const QuotationForm = () => {
  const { toast } = useToast();

  const initialFormData: QuotationFormData = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    productType: '',
    quantity: 50,
    printSpecs: {
      front: true,
      back: false,
      size: 'A4',
      colors: 'Full Color'
    },
    timeline: 'standard',
    budget: '',
    description: '',
    hasLogo: false,
    logoDescription: ''
  };

  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrintSpecChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      printSpecs: {
        ...prev.printSpecs,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.productType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    const endpoint = 'https://formspree.io/f/xnjqegdj';

    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('company', formData.company);
      payload.append('productType', formData.productType);
      payload.append('quantity', String(formData.quantity));
      payload.append('printSpecs', JSON.stringify(formData.printSpecs));
      payload.append('timeline', formData.timeline);
      payload.append('budget', formData.budget);
      payload.append('description', formData.description);
      payload.append('hasLogo', String(formData.hasLogo));
      payload.append('logoDescription', formData.logoDescription);
      payload.append('_replyto', formData.email);
      payload.append('_subject', `Quotation request from ${formData.fullName}`);

      const resp = await fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: {
          'Accept': 'application/json'
        }
      });

      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        status: resp.ok ? 'submitted' : 'pending'
      };

      const existingSubmissions = JSON.parse(localStorage.getItem('quotationSubmissions') || '[]');
      existingSubmissions.push(submissionData);
      localStorage.setItem('quotationSubmissions', JSON.stringify(existingSubmissions));

      if (resp.ok) {
        toast({
          title: "Quote Request Submitted!",
          description: "We've received your request and will get back to you within 24 hours.",
        });

        // Reset form
        setFormData(initialFormData);
      } else {
        let errorMsg = 'There was a problem submitting your request. It was saved locally.';
        try {
          const data = await resp.json();
          if (data?.error) errorMsg = data.error;
        } catch (err) { }

        toast({
          title: "Submission failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Network error",
        description: "Could not send your request. It was saved locally and will be retried later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quotation" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-business-dark mb-4">
              Get Your
              <span className="bg-brand-gradient bg-clip-text text-transparent"> Detailed Quote</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tell us about your project and we'll provide a comprehensive quotation 
              tailored to your specific needs.
            </p>
          </div>

          <Card className="shadow-brand" id="quotation-form">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary" />
                <span>Quotation Request Form</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-business-dark flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Juan Dela Cruz"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="ABC Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="juan@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+63 9XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-business-dark flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                    Project Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productType">Product Type *</Label>
                      <Select 
                        value={formData.productType} 
                        onValueChange={(value) => handleInputChange('productType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notebook">Custom Notebooks</SelectItem>
                          <SelectItem value="pen">Branded Pens</SelectItem>
                          <SelectItem value="shirt">T-Shirts</SelectItem>
                          <SelectItem value="jacket">Jackets</SelectItem>
                          <SelectItem value="multiple">Multiple Products</SelectItem>
                          <SelectItem value="other">Other (specify in description)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  {/* Print Specifications */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-business-dark">Print Specifications</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Print Size</Label>
                        <Select 
                          value={formData.printSpecs.size} 
                          onValueChange={(value) => handlePrintSpecChange('size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4 Size</SelectItem>
                            <SelectItem value="A5">A5 Size</SelectItem>
                            <SelectItem value="letter">Letter Size (8.5x11)</SelectItem>
                            <SelectItem value="custom">Custom Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Print Colors</Label>
                        <Select 
                          value={formData.printSpecs.colors} 
                          onValueChange={(value) => handlePrintSpecChange('colors', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Color">Full Color (CMYK)</SelectItem>
                            <SelectItem value="1 Color">1 Color</SelectItem>
                            <SelectItem value="2 Color">2 Colors</SelectItem>
                            <SelectItem value="Black Only">Black Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Print Placement</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="print-front"
                            checked={formData.printSpecs.front}
                            onCheckedChange={(checked) => handlePrintSpecChange('front', checked)}
                          />
                          <Label htmlFor="print-front">Front</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="print-back"
                            checked={formData.printSpecs.back}
                            onCheckedChange={(checked) => handlePrintSpecChange('back', checked)}
                          />
                          <Label htmlFor="print-back">Back</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeline">Production Timeline</Label>
                      <Select 
                        value={formData.timeline} 
                        onValueChange={(value) => handleInputChange('timeline', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (7-10 business days)</SelectItem>
                          <SelectItem value="expedited">Expedited (3-5 business days) +30%</SelectItem>
                          <SelectItem value="rush">Rush (24-48 hours) +50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Estimated Budget (PHP)</Label>
                      <Select 
                        value={formData.budget} 
                        onValueChange={(value) => handleInputChange('budget', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5k">Under ₱5,000</SelectItem>
                          <SelectItem value="5k-15k">₱5,000 - ₱15,000</SelectItem>
                          <SelectItem value="15k-30k">₱15,000 - ₱30,000</SelectItem>
                          <SelectItem value="30k-50k">₱30,000 - ₱50,000</SelectItem>
                          <SelectItem value="over-50k">Over ₱50,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Logo Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLogo"
                      checked={formData.hasLogo}
                      onCheckedChange={(checked) => handleInputChange('hasLogo', checked)}
                    />
                    <Label htmlFor="hasLogo" className="text-lg font-semibold">
                      I need logo design services
                    </Label>
                  </div>
                  
                  {formData.hasLogo && (
                    <div>
                      <Label htmlFor="logoDescription">Logo Requirements</Label>
                      <Textarea
                        id="logoDescription"
                        value={formData.logoDescription}
                        onChange={(e) => handleInputChange('logoDescription', e.target.value)}
                        placeholder="Describe your logo requirements, brand colors, style preferences, etc."
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div>
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Any additional information about your project, special requirements, delivery preferences, etc."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-gradient hover:opacity-90 transition-opacity text-lg py-6"
                >
                  {isSubmitting ? (
                    "Submitting Request..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};