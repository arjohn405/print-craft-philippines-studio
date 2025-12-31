import { useState, useEffect } from 'react';
import { Mail, Phone, Building, Calendar, Package, Hash, DollarSign, Clock, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
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
  replies?: Array<{ subject: string; message: string; timestamp: string }>;
}

interface QuotationDetailModalProps {
  request: QuotationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationDetailModal = ({ request, isOpen, onClose }: QuotationDetailModalProps) => {
  type ReplyRecord = { subject: string; message: string; timestamp: string; status?: 'sent' | 'failed'; error?: string };

  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [localReplies, setLocalReplies] = useState<ReplyRecord[]>((request?.replies || []) as ReplyRecord[]);
  const { toast } = useToast();

  // Email editing state (to fix missing/invalid recipient addresses)
  const [currentEmail, setCurrentEmail] = useState<string>(request?.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editableEmail, setEditableEmail] = useState<string>(request?.email || '');

  useEffect(() => {
    setLocalReplies((request?.replies || []) as ReplyRecord[]);
    setCurrentEmail(request?.email || '');
    setEditableEmail(request?.email || '');
    setIsEditingEmail(false);
  }, [request]);

  const validateEmail = (e?: string) => !!e && e.includes('@') && e.indexOf(' ') === -1;

  // EmailJS configuration (set these in .env: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY)
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_392jpda';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_cfwe7to';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'OniPkhlA8l2qtQWXh';

  const persistReply = (requestId: string, reply: ReplyRecord) => {
    try {
      const all = JSON.parse(localStorage.getItem('quotationSubmissions') || '[]');
      const idx = all.findIndex((s: any) => s.id === requestId);
      if (idx !== -1) {
        all[idx].replies = all[idx].replies || [];
        all[idx].replies.push(reply);
        if (reply.status === 'sent') all[idx].status = 'replied';
        localStorage.setItem('quotationSubmissions', JSON.stringify(all));
      }
    } catch (err) {
      console.error('Failed to persist reply in localStorage', err);
    }
  };

  const sendReply = async (subject: string, message: string) => {
    if (!request) return false;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast({
        title: "Email not configured",
        description: "Please configure EmailJS (set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY in .env).",
        variant: "destructive"
      });
      return false;
    }

    setIsSendingEmail(true);

    // Use the validated currentEmail (may be edited by owner in-modal)
    if (!currentEmail || !validateEmail(currentEmail)) {
      const errMsg = 'Recipient email is missing or invalid. Please add a valid recipient email before sending.';
      toast({ title: 'No recipient', description: errMsg, variant: 'destructive' });
      return false;
    }

    const templateParams = {
      to_email: currentEmail,
      to_name: request.fullName,
      from_name: 'PrintPro Team',
      subject,
      message,
      reply_to: 'info@printpro.com'
    };

    const baseRecord: ReplyRecord = {
      subject,
      message,
      timestamp: new Date().toISOString()
    };

    try {
      console.debug('Sending with template ID:', EMAILJS_TEMPLATE_ID);
      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      const record: ReplyRecord = { ...baseRecord, status: 'sent' };
      persistReply(request.id, record);
      setLocalReplies(prev => [...prev, record]);

      toast({
        title: "Email Sent Successfully",
        description: `Your reply has been sent to ${request.email}`,
      });

      // Clear form
      setEmailSubject('');
      setEmailMessage('');

      console.log('EmailJS result', result);
      return true;
    } catch (err: any) {
      let errMsg = 'Unknown error';
      try {
        if (err?.status) errMsg = `Status ${err.status}: ${err?.text || err?.message || JSON.stringify(err)}`;
        else errMsg = err?.text || err?.message || String(err);
      } catch (e) {
        errMsg = String(err);
      }

      const record: ReplyRecord = { ...baseRecord, status: 'failed', error: errMsg };
      persistReply(request.id, record);
      setLocalReplies(prev => [...prev, record]);

      console.error('EmailJS error', err);

      // If it's a 400 template-related error, surface more actionable guidance and link to the templates dashboard
      if ((err?.status === 400 || /template/i.test(errMsg))) {
        toast({
          title: "Template ID not found",
          description: (
            <>
              <div>Template ID <strong>{EMAILJS_TEMPLATE_ID}</strong> was not found or is invalid.</div>
              <div className="mt-2">Open <a className="underline" href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noreferrer">EmailJS Templates</a> to confirm or create the correct template.</div>
            </>
          ),
          variant: "destructive",
          action: (
            <ToastAction asChild altText="Open templates">
              <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noreferrer">Open templates</a>
            </ToastAction>
          )
        });
      } else {
        toast({
          title: "Email Failed",
          description: errMsg,
          variant: "destructive"
        });
      }

      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage || !request) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message.",
        variant: "destructive"
      });
      return;
    }

    await sendReply(emailSubject, emailMessage);
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
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>

                  {!isEditingEmail ? (
                    <div className="flex items-center justify-between">
                      <div>
                        {currentEmail ? (
                          <p className="font-medium">{currentEmail}</p>
                        ) : (
                          <Badge variant="destructive">No email provided</Badge>
                        )}
                        {!currentEmail && (
                          <div className="text-xs text-muted-foreground mt-1">Add a valid email to send replies from the dashboard.</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => { setIsEditingEmail(true); setEditableEmail(currentEmail); }}>
                          {currentEmail ? 'Edit' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editableEmail}
                        onChange={(e) => setEditableEmail(e.target.value)}
                        placeholder="customer@example.com"
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => {
                        if (!validateEmail(editableEmail)) {
                          toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive' });
                          return;
                        }

                        // persist update
                        try {
                          const all = JSON.parse(localStorage.getItem('quotationSubmissions') || '[]');
                          const idx = all.findIndex((s: any) => s.id === request.id);
                          if (idx !== -1) {
                            all[idx].email = editableEmail;
                            localStorage.setItem('quotationSubmissions', JSON.stringify(all));
                          }
                        } catch (err) {
                          console.error('Failed to update email in localStorage', err);
                        }

                        setCurrentEmail(editableEmail);
                        setIsEditingEmail(false);
                        toast({ title: 'Email updated', description: 'Recipient email was updated.' });
                      }}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setIsEditingEmail(false); setEditableEmail(currentEmail); }}>Cancel</Button>
                    </div>
                  )}
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
                Note: This will send an email directly to {currentEmail || 'the customer email'}
              </p>


            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};