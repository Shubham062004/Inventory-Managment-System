import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import { apiService, Product } from '@/services/api'; // Changed: Import API instead of local products
import LocationSelector from '@/components/ui/LocationSelector';
import FreeDeliveryBanner from '@/components/home/FreeDeliveryBanner';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { CartProvider } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle } from 'lucide-react';
import { useScrollReveal, applySequentialAnimations } from '@/utils/scrollAnimation';
import ChatbotButton from '@/components/ui/ChatbotButton';

const Index = () => {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [location, setLocation] = useState('Select Location');
  
  // Changed: Add state for products from API
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the scroll reveal animation
  useScrollReveal({ 
    selector: '.reveal', 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Changed: Load products from backend API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiService.getProducts();
        setAllProducts(response.data);
        console.log('✅ Products loaded for home page:', response.data.length);
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Apply sequential animations to products
  useEffect(() => {
    if (allProducts.length > 0) {
      applySequentialAnimations(
        '.grid', 
        '.food-card', 
        'animate-fade-in', 
        0.05
      );
    }
  }, [allProducts]); // Changed: Trigger animations when products load

  // Group products by category (same logic as before)
  const productsByCategory = allProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>); // Changed: Use Product[] type

  // Sort categories to show most popular first (same as before)
  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    const popularOrder = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Fruits', 'Vegetables'];
    const aIndex = popularOrder.indexOf(a);
    const bIndex = popularOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
        <Header />
        
        <main className="flex-grow pt-16">
          <Hero />
          <div className="container mx-auto px-4">
            <div className="reveal reveal-from-bottom py-4">
              <FreeDeliveryBanner />
            </div>
            <div className="py-4 flex justify-between reveal reveal-from-right">
              <Link to="/support">
                <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 hover:text-blink hover:border-blink hover:bg-blink/10 dark:hover:border-blink-400 dark:hover:text-blink-400 dark:hover:bg-blink-400/10 hover-scale">
                  <MessageCircle className="h-4 w-4" />
                  <span>Customer Support</span>
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 hover:text-blink hover:border-blink hover:bg-blink/10 dark:hover:border-blink-400 dark:hover:text-blink-400 dark:hover:bg-blink-400/10 hover-scale">
                  <Package className="h-4 w-4" />
                  <span>Full Menu</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Changed: Add loading state */}
          {isLoading ? (
            <div className="container mx-auto px-4 text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            /* Display all categories (same as before) */
            sortedCategories.map((category) => (
              <div key={category} className="reveal reveal-from-bottom">
                <CategorySection 
                  title={category} 
                  products={productsByCategory[category]} 
                />
              </div>
            ))
          )}
        </main>
        
        <Footer />
        
        {/* Theme toggle - moved to bottom right corner */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Chatbot button */}
        <ChatbotButton />
        
        {/* Modals */}
        <LocationSelector 
          isOpen={isLocationSelectorOpen}
          onClose={() => setIsLocationSelectorOpen(false)}
          onSelectLocation={(loc) => setLocation(loc)}
        />
      </div>
    </CartProvider>
  );
};

export default Index;
