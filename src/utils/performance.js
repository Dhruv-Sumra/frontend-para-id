import { useMemo, useCallback, useRef, useState, useEffect } from 'react';

// Debounce hook for expensive operations
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized form validation
export const useFormValidation = (formData, validationRules) => {
  return useMemo(() => {
    const errors = {};
    
    Object.keys(validationRules).forEach(field => {
      const value = formData[field];
      const rules = validationRules[field];
      
      if (rules.required && !value) {
        errors[field] = `${field} is required`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = rules.message || `Invalid ${field}`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.maxLength && value && value.length > rules.maxLength) {
        errors[field] = `${field} must be less than ${rules.maxLength} characters`;
      }
    });
    
    return errors;
  }, [formData, validationRules]);
};

// Memoized API calls
export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);
  
  return { data, loading, error, execute };
};

// Memoized search functionality
export const useSearch = (items, searchTerm, searchFields = []) => {
  return useMemo(() => {
    if (!searchTerm || !items || items.length === 0) {
      return items;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }, [items, searchTerm, searchFields]);
};

// Memoized pagination
export const usePagination = (items, page, itemsPerPage) => {
  return useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      items: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / itemsPerPage),
      currentPage: page,
      hasNextPage: endIndex < items.length,
      hasPrevPage: page > 1
    };
  }, [items, page, itemsPerPage]);
};

// Memoized sorting
export const useSorting = (items, sortBy, sortOrder = 'asc') => {
  return useMemo(() => {
    if (!sortBy || !items || items.length === 0) {
      return items;
    }
    
    return [...items].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortBy, sortOrder]);
};

// Memoized filtering
export const useFiltering = (items, filters) => {
  return useMemo(() => {
    if (!filters || Object.keys(filters).length === 0 || !items) {
      return items;
    }
    
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === '') return true;
        return item[key] === value;
      });
    });
  }, [items, filters]);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times. Time since last render: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return { renderCount: renderCount.current };
};

// Lazy loading hook for images
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder);
      setLoading(false);
      return;
    }
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      setImageSrc(placeholder);
      setLoading(false);
    };
  }, [src, placeholder]);
  
  return { imageSrc, loading };
};

// Throttle hook for scroll events
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef(null);
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCall.current >= delay) {
      callback(...args);
      lastCall.current = now;
    } else {
      clearTimeout(lastCallTimer.current);
      lastCallTimer.current = setTimeout(() => {
        callback(...args);
        lastCall.current = Date.now();
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]);
}; 