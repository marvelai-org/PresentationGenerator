import { z } from 'zod';
import { useState, FormEvent } from 'react';

/**
 * Type for validation errors
 */
export type FormErrors<T> = {
  [K in keyof T]?: string[];
} & {
  _form?: string[];
};

/**
 * Options for the useZodForm hook
 */
export interface UseZodFormOptions<T> {
  /**
   * Initial form data
   */
  defaultValues?: Partial<T>;
  
  /**
   * Callback when form is successfully submitted and validated
   */
  onSubmit?: (values: T) => void | Promise<void>;
  
  /**
   * Callback when form validation fails
   */
  onError?: (errors: FormErrors<T>) => void;
}

/**
 * Custom hook for validating forms with Zod
 * @param schema Zod schema to validate against
 * @param options Form options
 * @returns Form handlers and state
 */
export function useZodForm<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  options: UseZodFormOptions<z.infer<typeof schema>> = {}
) {
  const [formData, setFormData] = useState<Partial<z.infer<typeof schema>>>(
    options.defaultValues || {}
  );
  const [errors, setErrors] = useState<FormErrors<z.infer<typeof schema>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Validate the form data
      const validatedData = schema.parse(formData);
      setIsValid(true);
      
      // Call onSubmit callback if provided
      if (options.onSubmit) {
        await options.onSubmit(validatedData);
      }
    } catch (error) {
      setIsValid(false);
      
      if (error instanceof z.ZodError) {
        // Transform Zod errors into FormErrors format
        const formattedErrors: FormErrors<z.infer<typeof schema>> = {};
        
        error.errors.forEach(err => {
          const path = err.path[0] as keyof z.infer<typeof schema>;
          
          if (path) {
            if (!formattedErrors[path]) {
              formattedErrors[path] = [];
            }
            formattedErrors[path]?.push(err.message);
          } else {
            if (!formattedErrors._form) {
              formattedErrors._form = [];
            }
            formattedErrors._form?.push(err.message);
          }
        });
        
        setErrors(formattedErrors);
        
        // Call onError callback if provided
        if (options.onError) {
          options.onError(formattedErrors);
        }
      } else {
        // Handle unexpected errors
        setErrors({
          _form: ["An unexpected error occurred"]
        });
        
        console.error("Form validation error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Update a single form field
   */
  const updateField = (field: keyof z.infer<typeof schema>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when it's updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  /**
   * Reset the form to default values
   */
  const resetForm = () => {
    setFormData(options.defaultValues || {});
    setErrors({});
    setIsValid(false);
  };
  
  /**
   * Validate a single field
   */
  const validateField = (field: keyof z.infer<typeof schema>) => {
    // Create a partial schema for just this field
    const fieldSchema = z.object({ 
      [field]: schema.shape[field as keyof T] 
    }) as z.ZodType<Partial<z.infer<typeof schema>>>;
    
    try {
      fieldSchema.parse({ [field]: formData[field] });
      // Clear error if validation passes
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set errors for this field
        const fieldErrors = error.errors
          .filter(err => err.path[0] === field)
          .map(err => err.message);
        
        setErrors(prev => ({
          ...prev,
          [field]: fieldErrors
        }));
      }
      return false;
    }
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    isValid,
    handleSubmit,
    updateField,
    resetForm,
    validateField,
  };
}

/**
 * Function to create a reusable form schema with common fields
 * @param extraFields Additional fields for the schema
 * @returns A Zod schema with base fields and custom fields
 */
export function createFormSchema<T extends z.ZodRawShape>(extraFields: T) {
  // Common form fields
  const baseFields = {
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  };
  
  return z.object({
    ...baseFields,
    ...extraFields,
  });
}

/**
 * Example Usage:
 * 
 * // Define your form schema with Zod
 * const contactFormSchema = z.object({
 *   name: z.string().min(2, "Name must be at least 2 characters"),
 *   email: z.string().email("Invalid email address"),
 *   message: z.string().min(10, "Message must be at least 10 characters")
 * });
 * 
 * // Use in a component
 * function ContactForm() {
 *   const { 
 *     formData, 
 *     errors, 
 *     isSubmitting, 
 *     handleSubmit,
 *     updateField
 *   } = useZodForm(contactFormSchema, {
 *     defaultValues: {
 *       name: "",
 *       email: "",
 *       message: ""
 *     },
 *     onSubmit: async (values) => {
 *       // Send to API
 *       await api.sendContactForm(values);
 *       toast.success("Message sent!");
 *     }
 *   });
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <div>
 *         <label>Name</label>
 *         <input
 *           value={formData.name || ""}
 *           onChange={(e) => updateField("name", e.target.value)}
 *         />
 *         {errors.name && <div className="error">{errors.name[0]}</div>}
 *       </div>
 *       
 *       {/* Similar fields for email and message */}
 *       
 *       <button type="submit" disabled={isSubmitting}>
 *         {isSubmitting ? "Sending..." : "Send Message"}
 *       </button>
 *     </form>
 *   );
 * }
 */ 