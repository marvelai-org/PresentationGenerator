import { z } from 'zod';

export const documentMetadataSchema = z.object({
  tags: z.array(z.string()),
  category: z.string(),
  aiSummary: z.string().optional(),
  lastAIAnalysis: z.date().optional(),
  vectorEmbedding: z.array(z.number()).optional(),
});

export const documentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  metadata: documentMetadataSchema,
});

export const documentUpdateSchema = documentSchema.partial();

export const documentVersionSchema = z.object({
  version: z.number().int().positive(),
  content: z.string(),
  changes: z.array(
    z.object({
      type: z.enum(['insert', 'delete', 'replace']),
      position: z.number().int().nonnegative(),
      content: z.string(),
      timestamp: z.date(),
      userId: z.string(),
    })
  ),
});