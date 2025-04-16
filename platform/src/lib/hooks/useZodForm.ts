import { z } from 'zod';
import {
  useForm,
  UseFormProps as UseReactHookFormProps,
  FieldValues,
  SubmitHandler,
  UseFormReturn
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * A hook to create a form with Zod schema validation
 * @param schema The Zod schema to validate the form against
 * @param formProps Additional props to pass to useForm
 * @returns A form handler with validation
 */
export const useZodForm = <TSchema extends z.ZodType>(
  schema: TSchema,
  formProps?: Omit<UseReactHookFormProps<z.infer<TSchema>>, 'resolver'>
) => {
  return useForm<z.infer<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
  });
};

/**
 * Helper function for creating typesafe onSubmit handlers
 */
export function createSubmitHandler<T extends FieldValues>(
  submitHandler: SubmitHandler<T>
) {
  return submitHandler;
} 