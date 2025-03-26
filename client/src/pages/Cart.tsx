import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2 } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    totalPrice,
    deliveryFee,
    qualifiesForFreeDelivery,
    amountAwayFromFreeDelivery,
    shippingAddress,
    paymentMethod
  } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderComplete = () => {
    if (!shippingAddress || !paymentMethod) {
      toast({ title: "Missing Information", description: "Please provide shipping address and payment method." });
      return;
    }

    setIsLoading(true);
    
    const orderDetails = {
      id: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      items,
      total: totalPrice + (qualifiesForFreeDelivery ? 0 : deliveryFee),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      address: shippingAddress,
      paymentMethod,
    };
    
    localStorage.setItem('last-order', JSON.stringify(orderDetails));
    
    setTimeout(() => {
      clearCart();
      setIsLoading(false);
      navigate('/order-confirmation');
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh] flex flex-col items-center justify-center">
          <div className="max-w-md text-center">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/menu">
              <Button className="bg-blink hover:bg-blink-600">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft size={16} /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <div className={`p-4 mb-6 rounded-lg text-sm flex items-center gap-2 ${qualifiesForFreeDelivery ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
            {qualifiesForFreeDelivery ? <Check size={18} className="flex-shrink-0" /> : <ShoppingBag size={18} className="flex-shrink-0" />}
            <span>{qualifiesForFreeDelivery ? "You've qualified for free delivery!" : `Add ₹${amountAwayFromFreeDelivery.toFixed(2)} more to your order for free delivery.`}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Cart Items ({items.length})</h2>
                </div>
                <ul className="divide-y divide-border">
                  {items.map(item => (
                    <li key={item.product.id} className="p-4 flex gap-4">
                      <img src={item.product.image} alt={item.product.name} className="h-20 w-20 object-cover rounded-md flex-shrink-0" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b')} />
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{item.product.unit}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-full shadow-sm">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus size={16} /></Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus size={16} /></Button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"><Trash2 size={16} /></Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-card rounded-lg border border-border shadow-sm sticky top-24 p-4">
                <h2 className="font-semibold">Order Summary</h2>
                <div className="flex justify-between mt-4"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{qualifiesForFreeDelivery ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span></div>
                <div className="flex justify-between mt-4 font-semibold border-t pt-4"><span>Total</span><span>₹{(totalPrice + deliveryFee).toFixed(2)}</span></div>
                <Button className="w-full mt-6" disabled={isLoading} onClick={handleOrderComplete}>{isLoading ? "Processing..." : "Complete Order"}</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
