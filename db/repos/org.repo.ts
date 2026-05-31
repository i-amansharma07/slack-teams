import { prisma } from "@/db/prisma";
import {
  Prisma,
  Organization,
  OrgRole,
  OrgMember,
  MemberStatus,
} from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;

const org = prisma.organization;
const orgMember = prisma.orgMember;

function getOrgClient(tx: Tx | undefined) {
  return tx ? tx.organization : org;
}

function getOrgMemberClient(tx: Tx | undefined) {
  return tx ? tx.orgMember : orgMember;
}

class OrgClass {
  //create organisation (by super admin)
  create(data: { name: string; createBy: string }, tx?: Tx) {
    const client = getOrgClient(tx);
    return client.create({
      data: {
        name: data.name,
        createdBy: data.createBy,
      },
    });
  }

  //findOrg
  findById(id: string, tx?: Tx) {
    const client = getOrgClient(tx);
    return client.findUnique({
      where: { id },
    });
  }

  //soft delete
  softDelete(id: string, deletedBy: string, tx?: Tx) {
    const client = getOrgClient(tx);
    return client.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy },
    });
  }

  //org (join) -> members (join) -> user
  findAllOrgAdmin(tx?: Tx) {
    const client = getOrgClient(tx);
    return client.findMany({
      where: { deletedAt: null },
      include: {
        members: {
          where: { role: OrgRole.org_admin },
          include: {
            user: {
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
    });
  }

  /*****Org Members******/
  //create orgMember by orgAdmin & Super Admin(only initially)
  createMember(
    data: { orgId: string; userId: string; role: OrgRole },
    tx?: Tx,
  ): Promise<OrgMember | null> {
    const client = getOrgMemberClient(tx);
    return client.create({
      data: {
        orgId: data.orgId,
        userId: data.userId,
        role: data.role,
      },
    });
  }

  markMemberActive(id: string, tx?: Tx): Promise<OrgMember | null> {
    const client = tx ? tx.orgMember : orgMember;
    return client.update({
      where: { userId: id },
      data: { status: MemberStatus.active },
    });
  }
}

export const OrganizationRepo = new OrgClass();

/*  
 This is handled cleanly. Here's the exact flow:

Super Admin creates an org:

Super Admin enters org details + an Org Admin email in their interface
The system atomically creates 4 DB rows in one shot:
organizations row (the new org)
users row for the Org Admin (email only, no password yet)
org_members row (role = org_admin, status = pending)
invitations row (token + expiry)
An invite email with a token link is sent to the Org Admin email
Org Admin activates:
4. Org Admin clicks the link → lands on a "set your password" page
5. On submit: org_members.status → active, 
invitations.status → accepted, users.password_hash set

So the "Super Admin can't add members to an org" 
rule holds — they're not adding a member, they're creating the org 
and its first admin together as a single atomic operation. The "Add / remove users from org" 
permission in the matrix covers the day-to-day Org Admin workflow after that bootstrap step.
 
 */
