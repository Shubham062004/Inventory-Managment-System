
import React, { useState } from 'react';
import { MessageCircle, X, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <Button 
        onClick={toggleChat}
        variant="outline" 
        size="icon"
        className="fixed bottom-20 right-4 z-50 rounded-full h-12 w-12 bg-blink dark:bg-blink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 z-50 overflow-hidden flex flex-col"
          >
            <div className="p-3 bg-blink dark:bg-blink-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <h3 className="font-medium">Chat Support</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto flex flex-col items-center justify-center">
              <div className="text-center">
                <Construction size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Under Construction</h3>
                <p className="text-muted-foreground">
                  🚧 We're experiencing technical issues. Please try again later! 🚧
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-border dark:border-gray-700 flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="w-full rounded-full px-4 py-2 text-sm bg-background dark:bg-gray-700 border border-border dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blink dark:focus:ring-blink-400"
              />
              <Button size="sm" className="rounded-full px-3 bg-blink hover:bg-blink-600">
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotButton;
