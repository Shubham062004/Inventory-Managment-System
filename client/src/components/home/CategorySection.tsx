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

interface CategorySectionProps {
  title: string;
  products: Product[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products }) => {
  return (
    <section className="py-8 md:py-10">
      <div className="container px-4 md:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6 title-underline pb-2">{title}</h2>
        
        <div className="relative">
          <Carousel 
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map(product => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 lg:-left-12" />
              <CarouselNext className="-right-4 lg:-right-12" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;