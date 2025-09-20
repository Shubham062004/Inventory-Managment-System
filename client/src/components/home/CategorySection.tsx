import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/context/CartContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  title?: string;
  category?: string;
  products: Product[];
  className?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  category, 
  products, 
  className 
}) => {
  // Use title if provided, otherwise use category
  const displayTitle = title || category || 'Products';

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{displayTitle}</h2>
        <span className="text-sm text-muted-foreground">
          {products.length} items
        </span>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map(product => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategorySection;
