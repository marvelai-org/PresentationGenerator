import { z } from 'zod';

export const projectSettingsSchema = z.object({
  allowCollaboration: z.boolean(),
  defaultVisibility: z.enum(['private', 'public']),
  aiFeatures: z.object({
    enabled: z.boolean(),
    model: z.string(),
    temperature: z.number().min(0).max(1),
  }),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  settings: projectSettingsSchema,
});

export const projectUpdateSchema = projectSchema.partial();

export const projectMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'editor', 'viewer']),
});

export const projectInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  expiresIn: z.number().min(1).max(30), // days
});