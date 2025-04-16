import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

interface FormErrorsProps {
  errors: FieldErrors;
  id?: string;
}

export function FormErrors({ errors, id }: FormErrorsProps) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div 
      id={id} 
      aria-live="polite" 
      className="mt-2 text-sm text-red-500 space-y-1"
    >
      {Object.entries(errors).map(([key, error]) => (
        <div key={key} className="flex items-center gap-x-2">
          <AlertCircle className="h-4 w-4" />
          <p>{error?.message as string}</p>
        </div>
      ))}
    </div>
  );
}

export function FieldError({ 
  error 
}: { 
  error: string | undefined 
}) {
  if (!error) return null;
  
  return (
    <div className="mt-1 text-sm text-red-500 flex items-center gap-x-1">
      <AlertCircle className="h-3 w-3" />
      <p>{error}</p>
    </div>
  );
} 