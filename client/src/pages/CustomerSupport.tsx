
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MessageCircle, 
  Info, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlignJustify,
  HelpCircle
} from 'lucide-react';

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'pending' | 'answered';
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: "What are your delivery hours?",
    answer: "We deliver from 10:00 AM to 8:00 PM, 7 days a week including weekends and holidays.",
    category: "delivery"
  },
  {
    question: "What is the minimum order value for free delivery?",
    answer: "Orders above ₹500 qualify for free delivery. For orders below ₹500, a delivery charge of ₹40 is applicable.",
    category: "delivery"
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is confirmed, you will receive a tracking link via SMS and email. You can also track your order from the 'My Orders' section in your account.",
    category: "orders"
  },
  {
    question: "What if I receive damaged or incorrect items?",
    answer: "Please report any issues within 24 hours of delivery. You can use our Support page or call our customer service. We'll arrange for a replacement or refund.",
    category: "orders"
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "You can modify or cancel your order within 30 minutes of placing it. After that, the order goes into processing and cannot be changed.",
    category: "orders"
  },
  {
    question: "How do I return an item?",
    answer: "For returns, please contact our customer support within 48 hours of delivery. Our team will guide you through the return process and arrange for pickup.",
    category: "returns"
  },
  {
    question: "What is your refund policy?",
    answer: "Refunds are processed within 5-7 business days after the returned items are received and inspected. The amount will be credited to your original payment method.",
    category: "returns"
  },
  {
    question: "Do you offer any membership or loyalty program?",
    answer: "Yes, we offer a premium membership called 'Balaji Priority' which gives you free delivery on all orders, priority customer support, and exclusive discounts.",
    category: "account"
  }
];

const CustomerSupport = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('contact');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userMessages, setUserMessages] = useState<SupportMessage[]>([]);
  
  // Check if user is logged in and pre-fill form
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setName(user.name || '');
        setEmail(user.email || '');
      } catch (e) {
        console.error('Error parsing user data from localStorage');
      }
    }
    
    // Load user messages from localStorage
    const messagesString = localStorage.getItem('supportMessages');
    if (messagesString) {
      try {
        const messages = JSON.parse(messagesString);
        setUserMessages(messages);
      } catch (e) {
        console.error('Error parsing support messages from localStorage');
      }
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to submit your query.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new support message
    const newMessage: SupportMessage = {
      id: `TICK-${String(Date.now()).slice(-3)}`,
      name,
      email,
      message,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    // Update state and localStorage
    const updatedMessages = [...userMessages, newMessage];
    setUserMessages(updatedMessages);
    localStorage.setItem('supportMessages', JSON.stringify(updatedMessages));
    
    // Clear form
    setMessage('');
    
    // Show success message
    toast({
      title: "Message Sent",
      description: "Your message has been sent to our support team. We'll get back to you soon!",
    });
  };
  
  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);
  
  return (
    <>
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
            <p className="text-muted-foreground">We're here to help with any questions you might have</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="contact" className="py-3">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Us
              </TabsTrigger>
              <TabsTrigger value="faq" className="py-3">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="history" className="py-3">
                <AlignJustify className="mr-2 h-4 w-4" />
                Your Messages
              </TabsTrigger>
            </TabsList>
            
            {/* Contact Form Tab */}
            <TabsContent value="contact">
              <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Contact Our Support
                  </CardTitle>
                  <CardDescription>
                    Fill out this form with your questions or concerns and our team will respond as soon as possible.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@example.com" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your question or issue in detail..." 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                      />
                    </div>
                  
                    <div className="flex items-center p-4 bg-muted/40 rounded-lg">
                      <Info className="h-5 w-5 mr-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Your message will be answered by our support team through your provided email address.
                      </p>
                    </div>
                  </form>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full sm:w-auto gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      For general inquiries, you can email us at:
                    </p>
                    <p className="font-medium">support@balajistore.com</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Our customer support line is available:
                    </p>
                    <p className="font-medium">+91 9876543210</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Mon-Sat: 9 AM - 8 PM
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Visit Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Our main store is located at:
                    </p>
                    <p className="font-medium">123 Main Street, Sector 12</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Open daily: 8 AM - 10 PM
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find answers to common questions about our products and services
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={selectedCategory === 'delivery' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('delivery')}
                    >
                      Delivery
                    </Button>
                    <Button 
                      variant={selectedCategory === 'orders' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('orders')}
                    >
                      Orders
                    </Button>
                    <Button 
                      variant={selectedCategory === 'returns' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('returns')}
                    >
                      Returns & Refunds
                    </Button>
                    <Button 
                      variant={selectedCategory === 'account' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('account')}
                    >
                      Account
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm mb-2">
                    Didn't find what you were looking for?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('contact')}
                    className="flex items-center gap-1"
                  >
                    Contact Support
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Message History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Your Support Messages</CardTitle>
                  <CardDescription>
                    View your previous support requests and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <Info className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">You haven't sent any support messages yet.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('contact')} 
                        className="mt-4"
                      >
                        Contact Support
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">{msg.id}</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              msg.status === 'pending' 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            }`}>
                              {msg.status === 'pending' ? 'Awaiting Reply' : 'Answered'}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2">{msg.message}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> 
                            {new Date(msg.date).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerSupport;
