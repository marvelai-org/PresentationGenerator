import { z } from "zod";

export const presentationSettingsSchema = z.object({
  allowCollaboration: z.boolean(),
  defaultVisibility: z.enum(["private", "public"]),
  aiFeatures: z.object({
    enabled: z.boolean(),
    model: z.string(),
    temperature: z.number().min(0).max(1),
  }),
  slideTransitions: z.enum(["none", "fade", "slide", "zoom"]).optional(),
  autoAdvance: z.boolean().optional(),
});

export const presentationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  settings: presentationSettingsSchema,
  slideCount: z.number().min(1).optional(),
  theme: z.string().optional(),
});

export const presentationUpdateSchema = presentationSchema.partial();

export const presentationMemberSchema = z.object({
  role: z.enum(["owner", "admin", "editor", "viewer"]),
});

export const presentationInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
  expiresIn: z.number().min(1).max(30), // days
});
