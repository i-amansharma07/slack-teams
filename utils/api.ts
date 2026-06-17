import { MemberStatus, OrgRole } from "@/lib/generated/prisma/client";

export type OrgAdmin = {
  id: string;
  status: MemberStatus;
  role: OrgRole;
  user: { id: string; email: string; name: string | null };
};

export type OrgWithAdmin = {
  id: string;
  name: string;
  members: OrgAdmin[];
};
