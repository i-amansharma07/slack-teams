import { email, z } from "zod";
import { OrgRole } from "@/lib/generated/prisma/enums";

export const CreateOrgSchema = z.object({
  org_name: z.string().min(2, "Org name must be atleast 2 chars"),
  adminEmail: z.email("invalid email"),
});

export const InviteMemberSchema = z.object({
  email: z.email("invalid email"),
  role: z.enum([OrgRole.moderator, OrgRole.member, OrgRole.guest], {
    message: "Role must be moderator, member or guest",
  }),
});

export const updateRoleSchema = z.object({
  role: z.enum([OrgRole.moderator, OrgRole.member, OrgRole.guest], {
    message: "Role must be moderator, member or guest",
  }),
});

export type CreateOrgDTO = z.infer<typeof CreateOrgSchema>;
export type InviteMemberDTO = z.infer<typeof InviteMemberSchema>;
export type updateRoleDTO = z.infer<typeof updateRoleSchema>;
