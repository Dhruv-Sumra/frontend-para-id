import React, { useEffect, useRef } from 'react';

const KeyboardNavigation = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement;

      // Handle Tab key for circular navigation
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab: move backwards
          if (currentElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move forwards
          if (currentElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Handle arrow keys for form navigation
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        
        const currentIndex = Array.from(focusableElements).indexOf(currentElement);
        let nextIndex;

        if (event.key === 'ArrowDown') {
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        }

        focusableElements[nextIndex].focus();
      }

      // Handle Enter key for form submission
      if (event.key === 'Enter' && currentElement.tagName === 'BUTTON') {
        currentElement.click();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default KeyboardNavigation; 