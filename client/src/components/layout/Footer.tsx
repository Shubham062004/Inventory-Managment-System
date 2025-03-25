
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-16 transition-colors duration-300 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <span className="text-2xl mr-1">🛒</span>
              Balaji Store
            </h3>
            <p className="text-muted-foreground mb-4">
              Fresh groceries delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-blink smooth-transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-blink smooth-transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-blink smooth-transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-blink smooth-transition">Home</Link></li>
              <li><Link to="/menu" className="text-muted-foreground hover:text-blink smooth-transition">Menu</Link></li>
              <li><Link to="/cart" className="text-muted-foreground hover:text-blink smooth-transition">Cart</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-blink smooth-transition">Login</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/menu?category=Dairy" className="text-muted-foreground hover:text-blink smooth-transition">Dairy & Breakfast</Link></li>
              <li><Link to="/menu?category=Fruits" className="text-muted-foreground hover:text-blink smooth-transition">Fruits & Vegetables</Link></li>
              <li><Link to="/menu?category=Snacks" className="text-muted-foreground hover:text-blink smooth-transition">Snacks & Munchies</Link></li>
              <li><Link to="/menu?category=Beverages" className="text-muted-foreground hover:text-blink smooth-transition">Beverages</Link></li>
            </ul>
          </div>
          
          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-muted-foreground hover:text-blink smooth-transition">Customer Support</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-blink smooth-transition">FAQs</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-blink smooth-transition">Terms & Conditions</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-blink smooth-transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Balaji Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
