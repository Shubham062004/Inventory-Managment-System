
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blink/10 to-blink-600/5 dark:from-blink-900/30 dark:to-blink-800/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584736286279-5d6e7770bede?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 dark:opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,white_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,#0f172a_100%)]" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {isMobile ? (
            <>
              {/* Mobile layout: Image first, then text */}
              <div className="relative reveal reveal-from-right">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80&w=1160&h=800"
                    alt="Fresh grocery products"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="text-sm font-medium inline-block px-3 py-1 rounded-full bg-blink/80 mb-3">
                      Popular Items
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Freshly Stocked</h3>
                    <p className="text-white/80">Premium quality, competitive prices</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blink/10 dark:bg-blink-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-2xl"></div>
              </div>

              <div className="text-center lg:text-left reveal reveal-from-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                  Fresh Groceries <br />
                  <span className="text-blink dark:text-blink-400">Delivered Daily</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  Premium quality groceries delivered to your doorstep. From bakery items to dairy essentials, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/menu" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 hover:scale-105 transition-transform">
                      Shop Now
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/support" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                      Support
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Desktop layout: Text first, then image */}
              <div className="text-center lg:text-left reveal reveal-from-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                  Fresh Groceries <br />
                  <span className="text-blink dark:text-blink-400">Delivered Daily</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  Premium quality groceries delivered to your doorstep. From bakery items to dairy essentials, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/menu">
                    <Button size="lg" className="w-full sm:w-auto gap-2 hover:scale-105 transition-transform">
                      Shop Now
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/support">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                      Support
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative reveal reveal-from-right">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80&w=1160&h=800"
                    alt="Fresh grocery products"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="text-sm font-medium inline-block px-3 py-1 rounded-full bg-blink/80 mb-3">
                      Popular Items
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Freshly Stocked</h3>
                    <p className="text-white/80">Premium quality, competitive prices</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blink/10 dark:bg-blink-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-2xl"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
