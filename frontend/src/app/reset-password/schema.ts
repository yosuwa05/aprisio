import { z } from "zod";

export const formSchema = z
  .object({
    password: z.string().min(1, {
      message: "Password Required",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm Password Required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
