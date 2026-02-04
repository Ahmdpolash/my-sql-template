// Validation: Zod schemas for Plan module
import { z } from "zod";

const createPlanValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Plan name is required"),
  }),
});

const updatePlanValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Plan name is required").optional(),
  }),
});

export const PlanValidation = {
  createPlanValidationSchema,
  updatePlanValidationSchema,
};
