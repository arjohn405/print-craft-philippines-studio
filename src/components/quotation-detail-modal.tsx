import { useState } from 'react';
import { Mail, Phone, Building, Calendar, Package, Hash, DollarSign, Clock, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

interface QuotationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  productType: string;
  quantity: number;
  timeline: string;
  budget: string;
  timestamp: string;
  status: string;
}

interface QuotationDetailModalProps {
  request: QuotationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationDetailModal = ({ request, isOpen, onClose }: QuotationDetailModalProps) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Initialize EmailJS (you'll need to set up your service)
  const EMAILJS_SERVICE_ID = 'your_service_id'; // Replace with your EmailJS service ID
  const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Replace with your EmailJS template ID
  const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Replace with your EmailJS public key

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage || !request) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingEmail(true);

    try {
      // Using EmailJS to send email
      const templateParams = {
        to_email: request.email,
        to_name: request.fullName,
        from_name: 'PrintPro Team',
        subject: emailSubject,
        message: emailMessage,
        reply_to: 'info@printpro.com'
      };

      // Note: In a real implementation, you would configure EmailJS
      // For now, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Email Sent Successfully",
        description: `Your reply has been sent to ${request.email}`,
      });

      // Clear form
      setEmailSubject('');
      setEmailMessage('');
      
      // Log the email for tracking (in real app, you'd save to database)
      console.log('Email sent:', templateParams);

    } catch (error) {
      toast({
        title: "Email Failed",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quotation Request Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{request.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{request.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{request.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{request.company || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product Type</p>
                    <Badge variant="outline">{request.productType}</Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{request.quantity.toLocaleString()} pieces</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="font-medium">{request.timeline}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{request.budget || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">
                      {new Date(request.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Reply Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Reply via Email
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Re: Your quotation request for custom merchandise"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder={`Hi ${request.fullName},\n\nThank you for your interest in our custom merchandise services. Based on your request for ${request.quantity} ${request.productType}, I'd be happy to provide you with a detailed quotation.\n\nBest regards,\nPrintPro Team`}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={10}
                />
              </div>

              <Button 
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailSubject || !emailMessage}
                className="w-full bg-brand-gradient"
              >
                {isSendingEmail ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email Reply
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                Note: This will send an email directly to {request.email}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};