import { z } from "zod";

export const CreateOrgSchema = z.object({
  name: z.string().min(2, "Org name must be atleast 2 chars"),
  adminEmail: z.email("invalid email"),
});

export type CreateOrgDTO = z.infer<typeof CreateOrgSchema>;
