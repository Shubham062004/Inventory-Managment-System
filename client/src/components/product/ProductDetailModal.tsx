
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductDetails } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: ProductDetails;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  
  // Find the current item in the cart (if it exists)
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = () => {
    if (quantity === 0) {
      addToCart(product);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart(product.id);
    } else if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product image */}
          <div className="relative h-64 md:h-full">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
              }}
            />
          </div>
          
          {/* Product details */}
          <div className="p-6">
            <div className="mb-4">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">{product.category} • {product.unit}</span>
              <h2 className="text-2xl font-display font-bold mt-1 mb-2">{product.name}</h2>
              <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
            </div>
            
            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p className="text-muted-foreground dark:text-gray-300">{product.description}</p>
              </div>
            )}
            
            {/* Expiration & Storage */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.expirationDate && (
                <div className="text-sm">
                  <span className="font-medium">Expiration: </span>
                  <span className="text-muted-foreground dark:text-gray-300">{product.expirationDate}</span>
                </div>
              )}
              
              {product.storageInstructions && (
                <div className="text-sm">
                  <span className="font-medium">Storage: </span>
                  <span className="text-muted-foreground dark:text-gray-300">{product.storageInstructions}</span>
                </div>
              )}
              
              {product.packaging && (
                <div className="text-sm">
                  <span className="font-medium">Packaging: </span>
                  <span className="text-muted-foreground dark:text-gray-300">{product.packaging}</span>
                </div>
              )}
              
              {product.origin && (
                <div className="text-sm">
                  <span className="font-medium">Origin: </span>
                  <span className="text-muted-foreground dark:text-gray-300">{product.origin}</span>
                </div>
              )}
            </div>
            
            {/* Nutritional Information */}
            {product.nutritionalInfo && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm font-medium">Calories</div>
                    <div className="font-semibold">{product.nutritionalInfo.calories}</div>
                  </div>
                  
                  <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm font-medium">Protein</div>
                    <div className="font-semibold">{product.nutritionalInfo.protein}g</div>
                  </div>
                  
                  <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm font-medium">Carbs</div>
                    <div className="font-semibold">{product.nutritionalInfo.carbs}g</div>
                  </div>
                  
                  <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                    <div className="text-sm font-medium">Fat</div>
                    <div className="font-semibold">{product.nutritionalInfo.fat}g</div>
                  </div>
                  
                  {product.nutritionalInfo.fiber && (
                    <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                      <div className="text-sm font-medium">Fiber</div>
                      <div className="font-semibold">{product.nutritionalInfo.fiber}g</div>
                    </div>
                  )}
                  
                  {product.nutritionalInfo.sugar && (
                    <div className="bg-secondary/30 dark:bg-gray-700 p-2 rounded text-center">
                      <div className="text-sm font-medium">Sugar</div>
                      <div className="font-semibold">{product.nutritionalInfo.sugar}g</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Ingredients</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            )}
            
            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Allergens</h3>
                <div className="flex flex-wrap gap-1">
                  {product.allergens.map((allergen) => (
                    <span 
                      key={allergen}
                      className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-full text-xs font-medium"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add to cart actions */}
            <div className="mt-6">
              {quantity === 0 ? (
                <Button 
                  onClick={handleAddToCart} 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border dark:border-gray-600 rounded-md">
                    <Button 
                      variant="ghost" 
                      className="h-10 px-3 rounded-r-none hover:bg-secondary dark:hover:bg-gray-700"
                      onClick={handleDecreaseQuantity}
                    >
                      -
                    </Button>
                    
                    <div className="w-10 text-center font-medium">
                      {quantity}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="h-10 px-3 rounded-l-none hover:bg-secondary dark:hover:bg-gray-700"
                      onClick={handleAddToCart}
                    >
                      +
                    </Button>
                  </div>
                  
                  <Button 
                    variant="default"
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleAddToCart}
                  >
                    Add More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
