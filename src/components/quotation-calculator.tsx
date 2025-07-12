import { useState, useEffect } from 'react';
import { Calculator, Package, Clock, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type ProductType = 'notebook' | 'pen' | 'shirt' | 'jacket';
type Timeline = 'standard' | 'expedited';

interface QuotationData {
  productType: ProductType | '';
  quantity: number;
  printFront: boolean;
  printBack: boolean;
  timeline: Timeline;
  customLogo: boolean;
}

export const QuotationCalculator = () => {
  const [quotationData, setQuotationData] = useState<QuotationData>({
    productType: '',
    quantity: 50,
    printFront: true,
    printBack: false,
    timeline: 'standard',
    customLogo: false
  });

  const [estimatedCost, setEstimatedCost] = useState(0);

  // Pricing structure in PHP
  const basePrices: Record<ProductType, number> = {
    notebook: 120,
    pen: 25,
    shirt: 280,
    jacket: 450
  };

  const calculateCost = () => {
    if (!quotationData.productType) {
      setEstimatedCost(0);
      return;
    }

    let basePrice = basePrices[quotationData.productType as ProductType];
    let totalCost = basePrice * quotationData.quantity;

    // Quantity discounts
    if (quotationData.quantity >= 100) {
      totalCost *= 0.85; // 15% discount
    } else if (quotationData.quantity >= 50) {
      totalCost *= 0.9; // 10% discount
    }

    // Print options
    let printCost = 0;
    if (quotationData.printFront) printCost += 50;
    if (quotationData.printBack) printCost += 40;
    totalCost += printCost * quotationData.quantity;

    // Custom logo fee
    if (quotationData.customLogo) {
      totalCost += 500; // One-time design fee
    }

    // Timeline adjustment
    if (quotationData.timeline === 'expedited') {
      totalCost *= 1.3; // 30% rush fee
    }

    setEstimatedCost(Math.round(totalCost));
  };

  useEffect(() => {
    calculateCost();
  }, [quotationData]);

  const handleSubmitQuote = () => {
    const quoteData = {
      ...quotationData,
      estimatedCost,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Store in localStorage for owner dashboard
    const existingQuotes = JSON.parse(localStorage.getItem('quotationRequests') || '[]');
    existingQuotes.push(quoteData);
    localStorage.setItem('quotationRequests', JSON.stringify(existingQuotes));

    // Show success message
    alert(`Quote saved! Estimated cost: ₱${estimatedCost.toLocaleString()}\n\nPlease fill out the detailed form below to submit your request.`);
    
    // Scroll to quotation form
    document.getElementById('quotation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/95 backdrop-blur-sm shadow-brand">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-business-dark">Instant Quote Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-type" className="text-sm font-medium mb-2 block">
                Product Type
              </Label>
              <Select 
                value={quotationData.productType} 
                onValueChange={(value: ProductType) => 
                  setQuotationData(prev => ({ ...prev, productType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notebook">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>Notebooks (₱120 each)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pen">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>Pens (₱25 each)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="shirt">
                    <div className="flex items-center space-x-2">
                      <Shirt className="w-4 h-4" />
                      <span>T-Shirts (₱280 each)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="jacket">
                    <div className="flex items-center space-x-2">
                      <Shirt className="w-4 h-4" />
                      <span>Jackets (₱450 each)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quotationData.quantity}
                onChange={(e) => 
                  setQuotationData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Discounts: 10% off 50+, 15% off 100+
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Print Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-front"
                    checked={quotationData.printFront}
                    onCheckedChange={(checked) => 
                      setQuotationData(prev => ({ ...prev, printFront: checked as boolean }))
                    }
                  />
                  <Label htmlFor="print-front" className="text-sm">Front print (+₱50 each)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print-back"
                    checked={quotationData.printBack}
                    onCheckedChange={(checked) => 
                      setQuotationData(prev => ({ ...prev, printBack: checked as boolean }))
                    }
                  />
                  <Label htmlFor="print-back" className="text-sm">Back print (+₱40 each)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-logo"
                    checked={quotationData.customLogo}
                    onCheckedChange={(checked) => 
                      setQuotationData(prev => ({ ...prev, customLogo: checked as boolean }))
                    }
                  />
                  <Label htmlFor="custom-logo" className="text-sm">Custom logo design (+₱500 one-time)</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Results */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Production Timeline</Label>
              <Select 
                value={quotationData.timeline} 
                onValueChange={(value: Timeline) => 
                  setQuotationData(prev => ({ ...prev, timeline: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Standard (7-10 days)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="expedited">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Expedited (3-5 days) +30%</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cost Estimate */}
            <div className="bg-hero-bg p-4 rounded-lg border border-primary/20">
              <h4 className="text-lg font-semibold text-business-dark mb-2">Estimated Cost</h4>
              <div className="text-3xl font-bold text-primary mb-2">
                ₱{estimatedCost.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                *Final price may vary based on specifications
              </p>
            </div>

            <Button 
              onClick={handleSubmitQuote}
              disabled={!quotationData.productType}
              className="w-full bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Get Detailed Quote
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};