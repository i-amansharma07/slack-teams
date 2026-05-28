import { email, z } from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(3),
  password: z.string().min(8, "Password must be at leasgt 8 Characters"),
});

//typescript can use it directly like :
/*
type LoginDTO = {
  email: string
  password: string
}
*/
//Data Transfer Objects
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
