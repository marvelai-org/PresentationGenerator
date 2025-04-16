import React, { useState, useEffect, ChangeEvent } from 'react';
import { z } from 'zod';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  // Select basics
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
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
  selectClassName?: string;
  errorClassName?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  name,
  value,
  onChange,
  options,
  label,
  placeholder,
  schema,
  errors = [],
  validateOnBlur = true,
  validateOnChange = false,
  className = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  required = false,
  disabled = false,
}: FormSelectProps) {
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
        setLocalErrors(['Invalid selection']);
      }
      setValidating(false);
      return false;
    }
  };
  
  // Handle select change
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  // Handle select blur
  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validateInput();
    }
  };
  
  // Determine select state classes for styling
  const getStateClasses = () => {
    if (disabled) return 'form-select-disabled';
    if (validating) return 'form-select-validating';
    if (allErrors.length > 0 && touched) return 'form-select-error';
    if (touched && value) return 'form-select-valid';
    return '';
  };
  
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`form-label ${labelClassName} ${required ? 'form-label-required' : ''}`}
        >
          {label}
          {required && <span className="form-required-mark">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`form-select ${selectClassName} ${getStateClasses()}`}
        disabled={disabled}
        required={required}
        aria-invalid={allErrors.length > 0}
        aria-describedby={allErrors.length > 0 ? `${name}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
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