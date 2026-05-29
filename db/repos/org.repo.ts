import { prisma } from "@/db/prisma";
import {
  Prisma,
  Organization,
  OrgMember,
  MemberStatus,
} from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;

const org = prisma.organization;
const orgMember = prisma.orgMember;

class OrgClass {
  markMemberActive(id: string, tx?: Tx): Promise<OrgMember | null> {
    const client = tx ? tx.orgMember : orgMember;
    return client.update({
      where: { userId: id },
      data: { status: MemberStatus.active },
    });
  }
}

export const OrganizationRepo = new OrgClass();
