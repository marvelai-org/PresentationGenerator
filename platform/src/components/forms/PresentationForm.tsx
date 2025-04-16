import React from 'react';
import { z } from 'zod';
import { FormInput, FormTextarea, FormSelect, useZodForm } from './index';

/**
 * Zod schema for presentation form
 */
const presentationFormSchema = z.object({
  name: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  
  theme: z.string()
    .min(1, "Please select a theme"),
  
  visibility: z.enum(["private", "public", "unlisted"], {
    errorMap: () => ({ message: "Please select a valid visibility option" })
  }),
  
  allowComments: z.boolean().optional(),
  allowDuplication: z.boolean().optional(),
});

// Derived TypeScript type from schema
type PresentationFormData = z.infer<typeof presentationFormSchema>;

interface PresentationFormProps {
  onSubmit: (data: PresentationFormData) => void;
  initialData?: Partial<PresentationFormData>;
  isSubmitting?: boolean;
}

/**
 * Available themes for presentation
 */
const themes = [
  { value: "default", label: "Default" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" },
  { value: "corporate", label: "Corporate" },
];

/**
 * Available visibility options
 */
const visibilityOptions = [
  { value: "private", label: "Private - Only you can view" },
  { value: "public", label: "Public - Anyone can view" },
  { value: "unlisted", label: "Unlisted - Only people with the link can view" },
];

/**
 * Presentation form with Zod validation
 */
export function PresentationForm({ 
  onSubmit, 
  initialData = {}, 
  isSubmitting = false 
}: PresentationFormProps) {
  // Initialize form with Zod schema
  const {
    formData,
    errors,
    handleSubmit,
    updateField,
    isValid,
  } = useZodForm(presentationFormSchema, {
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
      theme: initialData.theme || '',
      visibility: initialData.visibility || 'private',
      allowComments: initialData.allowComments ?? true,
      allowDuplication: initialData.allowDuplication ?? false,
    },
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  // Individual field schemas for inline validation
  const nameSchema = z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters");
  
  const descriptionSchema = z.string()
    .max(500, "Description must be less than 500 characters");

  return (
    <form onSubmit={handleSubmit} className="presentation-form">
      <div className="form-grid">
        <FormInput
          name="name"
          label="Presentation Title"
          value={formData.name || ''}
          onChange={(value) => updateField('name', value)}
          schema={nameSchema}
          errors={errors.name}
          required
          validateOnChange
        />
        
        <FormTextarea
          name="description"
          label="Description"
          value={formData.description || ''}
          onChange={(value) => updateField('description', value)}
          schema={descriptionSchema}
          errors={errors.description}
          placeholder="Enter a description for your presentation"
          rows={3}
          maxLength={500}
        />
        
        <FormSelect
          name="theme"
          label="Theme"
          value={formData.theme || ''}
          onChange={(value) => updateField('theme', value)}
          options={themes}
          errors={errors.theme}
          placeholder="Select a theme"
          required
        />
        
        <FormSelect
          name="visibility"
          label="Visibility"
          value={formData.visibility || 'private'}
          onChange={(value) => updateField('visibility', value as any)}
          options={visibilityOptions}
          errors={errors.visibility}
          required
        />
        
        <div className="form-checkboxes">
          <div className="form-checkbox-group">
            <input
              id="allowComments"
              type="checkbox"
              checked={formData.allowComments || false}
              onChange={(e) => updateField('allowComments', e.target.checked)}
            />
            <label htmlFor="allowComments">Allow comments</label>
          </div>
          
          <div className="form-checkbox-group">
            <input
              id="allowDuplication"
              type="checkbox"
              checked={formData.allowDuplication || false}
              onChange={(e) => updateField('allowDuplication', e.target.checked)}
            />
            <label htmlFor="allowDuplication">Allow duplication</label>
          </div>
        </div>
      </div>
      
      {errors._form && (
        <div className="form-error-summary" role="alert">
          {errors._form.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      
      <div className="form-actions">
        <button
          type="submit"
          className="form-submit-button"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Saving...' : 'Save Presentation'}
        </button>
      </div>
    </form>
  );
} 