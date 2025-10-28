// Validation: Zod schemas for Otp module
import { z } from "zod";

const SendOtpValidation = z.object({
  body: z.object({
    email: z.string().email(),
    otpCode: z
      .number()
      .int()
      .min(100000, "OTP must be at least 6 digits")
      .max(999999, "OTP must be at most 6 digits"),
  }),
});

const updateOtpValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Otp name is required").optional(),
  }),
});

export const OtpValidation = {
  SendOtpValidation,
  updateOtpValidationSchema,
};
