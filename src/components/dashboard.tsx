import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Mail, FileText, Eye, EyeOff, 
  Download, Search, Filter, Calendar, Trash2, ExternalLink, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QuotationDetailModal } from '@/components/quotation-detail-modal';

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

interface EmailSubscription {
  id: string;
  email: string;
  timestamp: string;
  source: string;
}

export const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [quotationRequests, setQuotationRequests] = useState<QuotationRequest[]>([]);
  const [emailSubscriptions, setEmailSubscriptions] = useState<EmailSubscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'quotations' | 'emails'>('quotations');
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  // Simple authentication - in production, use proper authentication
  const DASHBOARD_PASSWORD = 'printpro2024';

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the dashboard!",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadData = () => {
    // Load quotation requests
    const quotations = JSON.parse(localStorage.getItem('quotationSubmissions') || '[]');
    setQuotationRequests(quotations);

    // Load email subscriptions
    const emails = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]');
    setEmailSubscriptions(emails);
  };

  const deleteQuotation = (id: string) => {
    const updated = quotationRequests.filter(req => req.id !== id);
    setQuotationRequests(updated);
    localStorage.setItem('quotationSubmissions', JSON.stringify(updated));
    toast({
      title: "Quotation Deleted",
      description: "The quotation request has been removed.",
    });
  };

  const deleteEmail = (id: string) => {
    const updated = emailSubscriptions.filter(sub => sub.id !== id);
    setEmailSubscriptions(updated);
    localStorage.setItem('emailSubscriptions', JSON.stringify(updated));
    toast({
      title: "Subscription Removed",
      description: "The email subscription has been removed.",
    });
  };

  const exportToCSV = (type: 'quotations' | 'emails') => {
    const data = type === 'quotations' ? quotationRequests : emailSubscriptions;
    
    if (data.length === 0) {
      toast({
        title: "No Data to Export",
        description: `No ${type} found to export.`,
        variant: "destructive"
      });
      return;
    }

    let csvContent = '';
    
    if (type === 'quotations') {
      // CSV headers for quotations
      csvContent = 'Name,Email,Phone,Company,Product Type,Quantity,Timeline,Budget,Date,Status\n';
      
      // CSV rows
      quotationRequests.forEach(req => {
        csvContent += `"${req.fullName}","${req.email}","${req.phone}","${req.company || ''}","${req.productType}","${req.quantity}","${req.timeline}","${req.budget || ''}","${new Date(req.timestamp).toLocaleDateString()}","${req.status}"\n`;
      });
    } else {
      // CSV headers for emails
      csvContent = 'Email,Source,Date Subscribed\n';
      
      // CSV rows
      emailSubscriptions.forEach(sub => {
        csvContent += `"${sub.email}","${sub.source}","${new Date(sub.timestamp).toLocaleDateString()}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Exported Successfully",
      description: `${type} data has been exported to CSV format.`,
    });
  };

  const filteredQuotations = quotationRequests.filter(req => 
    req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = emailSubscriptions.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hero-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Dashboard Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dashboard password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-brand-gradient">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-business-dark">PrintPro Dashboard</h1>
            <p className="text-muted-foreground">Manage quotation requests and email subscriptions</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Quotations</p>
                  <p className="text-2xl font-bold text-business-dark">{quotationRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email Subscribers</p>
                  <p className="text-2xl font-bold text-business-dark">{emailSubscriptions.length}</p>
                </div>
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-business-dark">
                    {quotationRequests.filter(req => {
                      const reqDate = new Date(req.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return reqDate > weekAgo;
                    }).length}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-business-dark">
                    {emailSubscriptions.length > 0 ? Math.round((quotationRequests.length / emailSubscriptions.length) * 100) : 0}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <Button
                  variant={activeTab === 'quotations' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('quotations')}
                  className={activeTab === 'quotations' ? 'bg-brand-gradient' : ''}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Quotation Requests
                </Button>
                <Button
                  variant={activeTab === 'emails' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('emails')}
                  className={activeTab === 'emails' ? 'bg-brand-gradient' : ''}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Subscriptions
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => exportToCSV(activeTab)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {activeTab === 'quotations' ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.map((request) => (
                      <TableRow 
                        key={request.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div>
                              <div className="font-medium flex items-center">
                                {request.fullName}
                                <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                              </div>
                              <div className="text-sm text-muted-foreground">{request.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.company || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.productType}</Badge>
                        </TableCell>
                        <TableCell>{request.quantity.toLocaleString()}</TableCell>
                        <TableCell>{request.budget || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(request.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(request);
                                setIsDetailModalOpen(true);
                              }}
                              title="View Details & Reply"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQuotation(request.id);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredQuotations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No quotation requests found.
                  </div>
                )}

                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Click on any row to view full details and send email replies to customers.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date Subscribed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmails.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{subscription.source}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteEmail(subscription.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredEmails.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No email subscriptions found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quotation Detail Modal */}
        <QuotationDetailModal
          request={selectedRequest}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRequest(null);
          }}
        />
      </div>
    </div>
  );
};