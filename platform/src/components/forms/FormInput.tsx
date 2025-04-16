import React, { useState, useEffect, ChangeEvent } from 'react';
import { z } from 'zod';
import { FormErrors } from '@/lib/form-validation';

interface FormInputProps {
  // Input basics
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
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  
  // Extra props
  min?: number;
  max?: number;
  step?: number;
}

export function FormInput({
  name,
  value,
  onChange,
  label,
  placeholder,
  schema,
  errors = [],
  validateOnBlur = true,
  validateOnChange = false,
  type = 'text',
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  required = false,
  disabled = false,
  autoComplete = 'off',
  min,
  max,
  step,
}: FormInputProps) {
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
  
  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  // Handle input blur
  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validateInput();
    }
  };
  
  // Determine input state classes for styling
  const getStateClasses = () => {
    if (disabled) return 'form-input-disabled';
    if (validating) return 'form-input-validating';
    if (allErrors.length > 0 && touched) return 'form-input-error';
    if (touched && value) return 'form-input-valid';
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
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`form-input ${inputClassName} ${getStateClasses()}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={allErrors.length > 0}
        aria-describedby={allErrors.length > 0 ? `${name}-error` : undefined}
        min={min}
        max={max}
        step={step}
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

/**
 * Example usage:
 * 
 * const emailSchema = z.string().email("Please enter a valid email address");
 * 
 * function MyForm() {
 *   const [email, setEmail] = useState('');
 *   const [errors, setErrors] = useState<FormErrors<{email: string}>>({});
 * 
 *   return (
 *     <form>
 *       <FormInput
 *         name="email"
 *         label="Email Address"
 *         value={email}
 *         onChange={setEmail}
 *         schema={emailSchema}
 *         errors={errors.email}
 *         type="email"
 *         required
 *       />
 *     </form>
 *   );
 * }
 */ 