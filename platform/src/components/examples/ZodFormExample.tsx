'use client';

import { z } from 'zod';
import { FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormError, FormSuccess } from '@/components/ui/form/FormField';
import { useZodForm, createFormSchema } from '@/lib/hooks/useZodForm';

// Create form schema using our utility function
const userFormSchema = createFormSchema({
  name: { 
    required: true,
    min: 2,
    max: 50,
  },
  email: { 
    required: true 
  },
  password: { 
    required: true,
    min: 8,
    requireSpecialChar: true,
    requireNumber: true,
  },
  website: {
    required: false,
    isUrl: true,
  }
});

// Type for our form values derived from the schema
type UserFormValues = z.infer<typeof userFormSchema>;

export function ZodFormExample() {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use our custom hook with the schema
  const form = useZodForm({
    schema: userFormSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      website: '',
    },
  });

  // Handle form submission
  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    setError(undefined);
    setSuccess(undefined);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form data:', data);
      setSuccess('Form submitted successfully!');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">User Registration</h2>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormError error={error} />
          <FormSuccess message={success} />
          
          <FormField
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            required
          />
          
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            required
          />
          
          <FormField
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            description="Must be at least 8 characters with a number and special character"
          />
          
          <FormField
            name="website"
            label="Website"
            placeholder="https://example.com"
            description="Optional: Your personal website"
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
} 