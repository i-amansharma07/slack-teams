import { prisma } from "@/db/prisma";
import {
  Prisma,
  Organization,
  OrgRole,
  OrgMember,
  MemberStatus,
  InvitationStatus,
} from "@/lib/generated/prisma/client";

type Tx = Prisma.TransactionClient;

const org = prisma.organization;
const orgMember = prisma.orgMember;
const invitation = prisma.invitation;

function getOrgClient(tx: Tx | undefined) {
  return tx ? tx.organization : org;
}

function getOrgMemberClient(tx: Tx | undefined) {
  return tx ? tx.orgMember : orgMember;
}

function getInviteClient(tx: Tx | undefined) {
  return tx ? tx.invitation : invitation;
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
      select: {
        id : true,
        name : true,
        members: {
          where: { role: OrgRole.org_admin },
          select: {
            id: true,
            status: true,
            role: true,
            user: {
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
    });
  }

  /*****Org Members******/
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

  //Used by the `requireOrgAdmin` guard.
  findMemberByUserId(userId: string, orgId: string, tx?: Tx) {
    const client = getOrgMemberClient(tx);
    return client.findUnique({
      where: { userId_orgId: { userId, orgId } },
    });
  }

  //Returns all members of an org with their user details — both `active` and `pending` so the Org
  //Admin can see who hasn't registered yet.
  findAllMembers(orgId: string, tx?: Tx) {
    const client = getOrgMemberClient(tx);
    return client.findMany({
      where: { orgId },
      select: {
        id :true,
        role : true,
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { joinedAt: "asc" },
    });
  }

  //orgId is included in this method for extra precaution
  //so that orgAdmin from one org can't delete member of some other org
  updateMemberRole(
    memberId: string,
    orgId: string,
    newRole: OrgRole,
    updatedBy: string,
    tx?: Tx,
  ) {
    const client = getOrgMemberClient(tx);
    return client.update({
      where: { id: memberId, orgId: orgId },
      data: {
        role: newRole,
        roleUpdatedBy: updatedBy,
        roleUpdatedAt: new Date(),
      },
    });
  }

  //hard delete
  removeMember(orgId: string, memberId: string, tx?: Tx) {
    const client = getOrgMemberClient(tx);
    return client.delete({
      where: { id: memberId, orgId },
    });
  }

  //Checks whether a pending invitation already exists for an email in an org. Used before creating
  //a new invite so we can expire the old one first (re-invite flow).
  findPendingInvitation(email: string, orgId: string, tx?: Tx) {
    const client = getInviteClient(tx);
    return client.findUnique({
      where: {
        email_orgId_status: {
          email,
          orgId,
          status: InvitationStatus.pending,
        },
      },
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
