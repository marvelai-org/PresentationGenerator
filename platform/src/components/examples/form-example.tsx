import React from 'react';
import { z } from 'zod';
import { useZodForm } from '@/lib/hooks/useZodForm';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';

// Define the form schema using zod
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  age: z.coerce.number().min(18, 'You must be at least 18 years old').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
});

// Create a type from the schema
type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactFormExample() {
  // Use the useZodForm hook with our schema
  const form = useZodForm(contactSchema, {
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      age: undefined,
      website: ''
    },
    mode: 'onBlur'
  });

  // Type-safe form submission
  const onSubmit = form.handleSubmit((data) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to an API
    alert(JSON.stringify(data, null, 2));
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          id="name"
          label="Full Name"
          placeholder="John Doe"
          required
          register={form.register}
          errors={form.formState.errors}
        />

        <FormInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
          register={form.register}
          errors={form.formState.errors}
        />

        <FormInput
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="0123456789"
          description="10 digit phone number without spaces or dashes"
          register={form.register}
          errors={form.formState.errors}
        />

        <FormInput
          id="age"
          type="number"
          label="Age"
          placeholder="25"
          register={form.register}
          errors={form.formState.errors}
        />

        <FormInput
          id="website"
          type="url"
          label="Website"
          placeholder="https://example.com"
          register={form.register}
          errors={form.formState.errors}
        />

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            Message
            <span className="text-destructive ml-1">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Your message here..."
            {...form.register('message')}
            className="w-full min-h-[100px] p-3 border rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {form.formState.errors.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.message.message as string}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
} 