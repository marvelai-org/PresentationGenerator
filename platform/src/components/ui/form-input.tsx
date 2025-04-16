import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';

type InputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | 'date';

interface FormInputProps {
  id: string;
  label?: string;
  type?: InputType;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  description?: string;
  disabled?: boolean;
  validation?: Record<string, any>;
  autoComplete?: string;
}

export function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  register,
  errors,
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  description,
  disabled = false,
  validation = {},
  autoComplete,
}: FormInputProps) {
  const errorMessage = errors[id]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label 
          htmlFor={id}
          className={cn(
            'block text-sm font-medium leading-none text-foreground',
            hasError && 'text-destructive',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        {...register(id, validation)}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive',
          inputClassName
        )}
      />
      
      {description && !hasError && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {hasError && (
        <p className={cn('text-sm font-medium text-destructive', errorClassName)}>
          {errorMessage}
        </p>
      )}
    </div>
  );
} 