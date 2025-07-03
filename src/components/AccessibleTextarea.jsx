import React from 'react';

const AccessibleTextarea = React.forwardRef(({ 
  label, 
  error, 
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  const { speak, speakField, isAudioEnabled, ...textareaProps } = props;
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        aria-describedby={error ? `${props.id || 'textarea'}-error` : undefined}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        }`}
        style={{ minHeight: `${rows * 1.5}rem` }}
        {...textareaProps}
        onFocus={e => {
          speakField && speakField(label);
          textareaProps.onFocus && textareaProps.onFocus(e);
        }}
        onChange={e => {
          textareaProps.onChange && textareaProps.onChange(e);
          if (speak && e.target.value) {
            speak(e.target.value);
          }
        }}
      />
      {error && (
        <span id={`${props.id || 'textarea'}-error`} className="text-red-500 text-sm mt-1 block">
          {typeof error === 'object' && error.message ? error.message : error}
        </span>
      )}
    </div>
  );
});

AccessibleTextarea.displayName = 'AccessibleTextarea';

export default AccessibleTextarea; 