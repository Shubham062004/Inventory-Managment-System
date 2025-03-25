import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductDetailModal from '@/components/product/ProductDetailModal';
import { ProductDetails } from '@/data/products';

interface ProductCardProps {
  product: ProductDetails;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Find the current item in the cart (if it exists)
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Fix: Prevent opening modal on button click

    if (quantity === 0) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    } else {
      updateQuantity(product.id, quantity + 1);
      toast({
        title: "Updated quantity",
        description: `${product.name} quantity updated to ${quantity + 1}.`,
        duration: 2000,
      });
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation(); // Fix: Prevent opening modal on button click

    if (quantity === 1) {
      removeFromCart(product.id);
      toast({
        title: "Removed from cart",
        description: `${product.name} has been removed from your cart.`,
        duration: 2000,
      });
    } else if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
      toast({
        title: "Updated quantity",
        description: `${product.name} quantity updated to ${quantity - 1}.`,
        duration: 2000,
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        onClick={openModal} 
        className="group relative bg-white dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] animate-fade-in food-card block cursor-pointer"
      >
        {/* Product image */}
        <div className="aspect-square overflow-hidden bg-secondary/30 dark:bg-gray-700/30">
          <img 
            src={imageError ? "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" : product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Product info */}
        <div className="p-4">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1 font-medium">{product.unit}</div>
          <h3 className="font-display font-medium mb-2 text-shorten dark:text-white">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-semibold dark:text-white">₹{product.price.toFixed(2)}</span>

            {quantity === 0 ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0 bg-blink dark:bg-blink-600 text-white hover:bg-blink-600 dark:hover:bg-blink-700 transform transition-all duration-200 hover:scale-110 active:scale-90"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
              </Button>
            ) : (
              <div className="flex items-center bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-l-full bg-background hover:bg-secondary dark:bg-gray-700 dark:hover:bg-gray-600 text-foreground dark:text-white border-r border-border dark:border-gray-600"
                  onClick={handleDecreaseQuantity}
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Minus size={14} />
                </Button>

                <span className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-r-full bg-background hover:bg-secondary dark:bg-gray-700 dark:hover:bg-gray-600 text-foreground dark:text-white border-l border-border dark:border-gray-600"
                  onClick={handleAddToCart}
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Plus size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={product}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default ProductCard;
