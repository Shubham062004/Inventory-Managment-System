import React, { useState, useEffect } from 'react';
import { Truck, Clock, Tag } from 'lucide-react';

const promoMessages = [
  { title: "Free Delivery On Orders Above ₹150", description: "Order now and enjoy the convenience of doorstep delivery at no extra cost.", icon: Truck },
  { title: "Special Discount On Dairy Products", description: "Get up to 10% off on all dairy products this week. Limited time offer!", icon: Tag },
  { title: "Same Day Delivery Available", description: "Place your order before 2 PM for same-day delivery in selected areas.", icon: Clock }
];

const FreeDeliveryBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = promoMessages[currentIndex];

  return (
    <div className="bg-blink-50 dark:bg-blink-900/20 border border-blink-100 dark:border-blink-800 rounded-lg p-4 my-6 mx-auto max-w-5xl transition-all duration-500 ease-in-out hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-blink/10 dark:bg-blink/20 p-3 rounded-full animate-pulse-glow">
          {React.createElement(current.icon, { size: 24, className: "text-blink dark:text-blink-400" })}
        </div>
        <div>
          <h3 className="font-display font-semibold text-blink-800 dark:text-blink-400">{current.title}</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">{current.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FreeDeliveryBanner;