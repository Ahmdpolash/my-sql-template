import { z } from "zod";

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    profilePic: z.string().optional(),
    displayName: z.string().optional(),
    bio: z.string().optional(),
    currentCountry: z.string().optional(),
    currentCity: z.string().optional(),
    language: z.string().optional(),
    interests: z.array(z.string()).optional(),
    isProfilePrivate: z.boolean().optional(),
  }),
});

const getAllUsersValidationSchema = z.object({
  body: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    searchTerm: z.string().optional(),
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
  getAllUsersValidationSchema,
};
