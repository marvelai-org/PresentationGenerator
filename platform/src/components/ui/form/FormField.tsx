import { useFormContext, Controller, Path, FieldValues } from 'react-hook-form';
import { Input } from '../input';
import { Label } from '../label';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

/**
 * Reusable form field component that integrates with React Hook Form
 * and displays validation errors
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  required = false,
  disabled = false,
  description,
}: FormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between">
          <Label 
            htmlFor={name} 
            className={cn(error && "text-destructive")}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error && "border-destructive", className)}
          />
        )}
      />
      
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      
      {description && !error && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}

/**
 * Form component that displays form-level errors
 */
export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
      {error}
    </div>
  );
}

/**
 * Form success message component
 */
export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  
  return (
    <div className="bg-emerald-500/15 text-emerald-500 text-sm p-3 rounded-md">
      {message}
    </div>
  );
} 