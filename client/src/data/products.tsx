import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import { apiService, Product } from '@/services/api';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the scroll reveal animation (if this hook exists)
  try {
    useScrollReveal({
      selector: '.reveal',
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
  } catch (e) {
    // Hook doesn't exist, skip animation
  }

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🔄 Loading products from backend...');
        const response = await apiService.getProducts();
        setProducts(response.data);
        console.log('✅ Products loaded:', response.data.length);
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        setError('Failed to load products. Please check your backend connection.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply sequential animations to products after they load (if function exists)
  useEffect(() => {
    if (products.length > 0) {
      try {
        applySequentialAnimations(
          '.grid',
          '.food-card',
          'animate-fade-in',
          0.05
        );
      } catch (e) {
        // Animation function doesn't exist, skip
      }
    }
  }, [products]);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Sort categories to show most popular first
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
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <FreeDeliveryBanner />
          
          {/* Quick Action Buttons */}
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/support">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Customer Support
                </Button>
              </Link>
              <Link to="/menu">
                <Button className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Full Menu
                </Button>
              </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">Loading fresh products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8 bg-red-50 dark:bg-red-950/10 rounded-lg p-6">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <div className="space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                  <Link to="/menu">
                    <Button>
                      Browse Menu
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Display products by category */}
            {!isLoading && !error && (
              <>
                {sortedCategories.length > 0 ? (
                  <div className="space-y-8">
                    {sortedCategories.slice(0, 6).map((category) => (
                      <CategorySection
                        key={category}
                        category={category}
                        products={productsByCategory[category]}
                        className="reveal"
                      />
                    ))}
                    
                    {/* Show more categories button */}
                    {sortedCategories.length > 6 && (
                      <div className="text-center py-8">
                        <Link to="/menu">
                          <Button size="lg" className="px-8">
                            View All Categories ({sortedCategories.length - 6} more)
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
                    <p className="text-muted-foreground mb-6">
                      Our products are being updated. Please check back soon!
                    </p>
                    <div className="space-x-4">
                      <Button onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                      <Link to="/support">
                        <Button variant="outline">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />

        {/* Theme toggle - bottom right corner */}
        <div className="fixed bottom-4 right-4 z-40">
          <ThemeToggle />
        </div>

        {/* Chatbot button (if component exists) */}
        {typeof ChatbotButton !== 'undefined' && <ChatbotButton />}

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
