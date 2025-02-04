import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "Password Required",
  }),
});
