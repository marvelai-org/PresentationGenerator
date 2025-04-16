import React, { useState, useEffect, ChangeEvent } from 'react';
import { z } from 'zod';

interface FormTextareaProps {
  // Textarea basics
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  
  // Validation
  schema?: z.ZodType;
  errors?: string[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  
  // UI customization
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  
  // Extra props
  maxLength?: number;
  minLength?: number;
}

export function FormTextarea({
  name,
  value,
  onChange,
  label,
  placeholder,
  schema,
  errors = [],
  validateOnBlur = true,
  validateOnChange = false,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  errorClassName = '',
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  minLength,
}: FormTextareaProps) {
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [validating, setValidating] = useState(false);
  
  // Combine component errors with passed-in errors
  const allErrors = [...errors, ...localErrors];
  
  // Reset local errors when passed-in errors change
  useEffect(() => {
    if (errors.length > 0) {
      setLocalErrors([]);
    }
  }, [errors]);
  
  // Reset validation state when value changes
  useEffect(() => {
    if (touched && validateOnChange) {
      validateInput();
    }
  }, [value]);
  
  // Validate the input against the schema
  const validateInput = () => {
    if (!schema) return true;
    
    setValidating(true);
    
    try {
      schema.parse(value);
      setLocalErrors([]);
      setValidating(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => err.message);
        setLocalErrors(messages);
      } else {
        setLocalErrors(['Invalid input']);
      }
      setValidating(false);
      return false;
    }
  };
  
  // Handle textarea change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  // Handle textarea blur
  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validateInput();
    }
  };
  
  // Determine textarea state classes for styling
  const getStateClasses = () => {
    if (disabled) return 'form-textarea-disabled';
    if (validating) return 'form-textarea-validating';
    if (allErrors.length > 0 && touched) return 'form-textarea-error';
    if (touched && value) return 'form-textarea-valid';
    return '';
  };
  
  // Character count display
  const showCharCount = maxLength !== undefined;
  const charCount = value.length;
  const isOverLimit = maxLength !== undefined && charCount > maxLength;
  
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <div className="form-label-container">
          <label 
            htmlFor={name} 
            className={`form-label ${labelClassName} ${required ? 'form-label-required' : ''}`}
          >
            {label}
            {required && <span className="form-required-mark">*</span>}
          </label>
          
          {showCharCount && (
            <div className={`form-char-count ${isOverLimit ? 'form-char-count-error' : ''}`}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`form-textarea ${textareaClassName} ${getStateClasses()}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        aria-invalid={allErrors.length > 0}
        aria-describedby={allErrors.length > 0 ? `${name}-error` : undefined}
      />
      
      {allErrors.length > 0 && touched && (
        <div 
          id={`${name}-error`}
          className={`form-error ${errorClassName}`}
          role="alert"
        >
          {allErrors[0]}
        </div>
      )}
    </div>
  );
} 