import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductCard from '@/components/home/ProductCard';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { apiService, Product } from '@/services/api'; // Import from api service

const Menu = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCart();

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getProducts(
          activeCategory !== 'All' ? activeCategory : undefined,
          searchTerm || undefined
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeCategory]);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(['All', ...response.data]);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to default categories if backend fails
        setCategories(['All', 'Dairy', 'Bakery', 'Grains', 'Fruits', 'Vegetables']);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Menu</h1>
          <p className="text-muted-foreground">
            Browse our complete product catalog and add items to your cart.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : `grid-cols-${Math.min(categories.length, 6)}`}`}>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Error state */}
        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))
          ) : products.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="contents"
            >
              {products.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}  
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : !isLoading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? `No products found matching "${searchTerm}"` : 'No products available'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
