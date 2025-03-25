
import { useEffect } from 'react';

interface ScrollRevealOptions {
  selector: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook to add scroll reveal animations to elements
 */
export const useScrollReveal = ({ 
  selector = '.reveal', 
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px'
}: ScrollRevealOptions) => {
  useEffect(() => {
    const revealElements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Once the animation has played, we can unobserve the element
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );
    
    revealElements.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [selector, threshold, rootMargin]);
};

/**
 * Apply sequential animations to child elements
 */
export const applySequentialAnimations = (
  parentSelector: string, 
  childSelector: string, 
  className: string, 
  delayBetweenItems: number = 0.1
) => {
  const parents = document.querySelectorAll(parentSelector);
  
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    
    children.forEach((child, index) => {
      const element = child as HTMLElement;
      element.style.animationDelay = `${index * delayBetweenItems}s`;
      element.classList.add(className);
    });
  });
};

/**
 * Hook to initialize scroll animations on page load
 * This is a custom hook that should be used inside a React component
 */
export const useInitScrollAnimations = () => {
  useEffect(() => {
    // Apply sequential animations to items that should animate in sequence
    applySequentialAnimations('.inventory-grid', '.inventory-item', 'animate-fade-in');
    
    // Set up the intersection observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Once the animation has played, we can unobserve the element
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    revealElements.forEach((element) => {
      observer.observe(element);
    });
    
    // Apply additional sequential animations specific to components
    applySequentialAnimations('.grid', '.food-card', 'animate-fade-in', 0.05);
    
    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
};

export default useScrollReveal;
