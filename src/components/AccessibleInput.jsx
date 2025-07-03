import React from 'react';

const AccessibleInput = React.forwardRef(({ 
  label, 
  error, 
  className = '',
  fieldKey,
  ...props 
}, ref) => {
  // Destructure out custom props so they are not passed to <input>
  const { speak, speakField, isAudioEnabled, ...inputProps } = props;

  return (
    <div>
      <label>
        {label}
        {props.required && <span>*</span>}
      </label>
      <input
        ref={ref}
        className={className}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
        {...inputProps}
        onFocus={e => {
          speakField && speakField(fieldKey || label);
          inputProps.onFocus && inputProps.onFocus(e);
        }}
        onChange={e => {
          inputProps.onChange && inputProps.onChange(e);
          if (speak && e.target.value) {
            speak(e.target.value);
          }
        }}
      />
      {error && (
        <span id={`${props.id || 'input'}-error`}>
          {JSON.stringify(error)}
        </span>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput; 