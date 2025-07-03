import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

const AccessibleSelect = React.forwardRef(({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  isClearable = false,
  isMulti = false,
  ...props
}, ref) => {
  // Destructure out custom props so they are not passed to the button
  const { speak, speakField, isAudioEnabled, ...selectProps } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedOption(options.find(option => option.value === value) || null);
  }, [value, options]);

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Always position dropdown below the input field
      setDropdownPosition('bottom');
    }
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options;

  const handleSelect = (option) => {
    if (!option) return; // Guard against undefined option
    
    setSelectedOption(option);
    setIsOpen(false);
    
    // Call onChange with the selected option
    if (onChange) {
      onChange(option);
    }
    if (speak && option.label) {
      speak(option.label);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    
    // Call onChange with null when clearing
    if (onChange) {
      onChange(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0) {
        handleSelect(filteredOptions[focusedIndex]);
      } else {
        setIsOpen(!isOpen);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          ref={ref}
          onClick={e => {
            setIsOpen(!isOpen);
            if (speakField && label) speakField(label);
          }}
          onFocus={e => {
            speakField && speakField(label);
            selectProps.onFocus && selectProps.onFocus(e);
          }}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={error ? `${props.id || 'select'}-error` : undefined}
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white text-left transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:border-gray-400 ${
            isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
          {...selectProps}
        >
          <span className={`flex-1 ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {isClearable && selectedOption && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear selection"
              >
                <X size={14} className="text-gray-400" />
              </button>
            )}
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden"
          style={{
            width: Math.min(dropdownRef.current?.offsetWidth || 300, window.innerWidth - 32),
            left: Math.max(16, Math.min(
              dropdownRef.current?.getBoundingClientRect().left || 0,
              window.innerWidth - (dropdownRef.current?.offsetWidth || 300) - 16
            )),
            top: (dropdownRef.current?.getBoundingClientRect().bottom || 0) + 2
          }}>
            
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedOption && selectedOption.value === option.value}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelect(option);
                    }}
                    className={`w-full text-left px-4 py-2 cursor-pointer transition-colors duration-150 ${
                      focusedIndex === index ? 'bg-blue-100' : ''
                    } ${selectedOption && selectedOption.value === option.value ? 'font-bold text-blue-700' : ''}`}
                  >
                    <span>{option.label}</span>
                    {selectedOption && selectedOption.value === option.value && (
                      <Check size={16} className="inline ml-2 text-blue-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">No options</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <span id={`${props.id || 'select'}-error`} className="text-red-500 text-sm mt-1 block">
          {typeof error === 'object' && error.message ? error.message : error}
        </span>
      )}
    </div>
  );
});

AccessibleSelect.displayName = 'AccessibleSelect';

export default AccessibleSelect; 