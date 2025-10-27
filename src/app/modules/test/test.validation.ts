// Validation: Zod schemas for Test module
import { z } from "zod";

const createTestValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Test name is required"),
  }),
});

const updateTestValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Test name is required").optional(),
  }),
});

export const TestValidation = {
  createTestValidationSchema,
  updateTestValidationSchema,
};
