
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { allProducts, productCategories, ProductDetails } from '@/data/products';
import ProductCard from '@/components/home/ProductCard';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const Menu = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const { items } = useCart(); // Add this to ensure cart state is available

  // Load all products including custom ones
  useEffect(() => {
    const customProducts = localStorage.getItem('custom-products');
    if (customProducts) {
      try {
        const parsedCustomProducts = JSON.parse(customProducts);
        setProducts([...allProducts, ...parsedCustomProducts]);
      } catch (error) {
        console.error('Error parsing custom products:', error);
        setProducts(allProducts);
      }
    } else {
      setProducts(allProducts);
    }
  }, []);

  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />

      <main className="flex-grow pt-24 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-[rgb(14,167,90)]">Menu</h1>
            <p className="text-muted-foreground dark:text-gray-400 max-w-lg mx-auto">
              Browse our complete product catalog and add items to your cart.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 placeholder:text-[rgb(14,167,90)]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Category tabs */}
          <Tabs
            defaultValue="All"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <TabsList className="bg-muted overflow-x-auto flex w-full md:w-auto py-1 px-1 mb-4">
              <TabsTrigger
                key="All"
                value="All"
                className={`text-sm md:text-base whitespace-nowrap ${activeCategory === "All"
                    ? "bg-[rgb(14,167,90)] text-white"
                    : "text-[rgb(14,167,90)]"
                  }`}
              >
                All
              </TabsTrigger>

              {productCategories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`text-sm md:text-base whitespace-nowrap ${activeCategory === category
                      ? "bg-[rgb(14,167,90)] text-white"
                      : "text-[rgb(14,167,90)]"
                    }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-muted-foreground">
                    No products found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
