import { z } from "zod";

const updateUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    profilePic: z.string().optional(),
  }),
});

const getAllUsersValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    searchTerm: z.string().optional(),
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
  getAllUsersValidationSchema,
};
