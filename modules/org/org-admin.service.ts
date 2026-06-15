import { prisma } from "@/db/prisma";
import crypto from "crypto";
import { OrganizationRepo } from "@/db/repos/org.repo";
import { UserRepo } from "@/db/repos/user.repo";
import { InvitationRepo } from "@/db/repos/invitation.repo";
import { OrgRole } from "@/lib/generated/prisma/enums";
import { cache } from "@/lib/cache";
import { CacheKeys } from "@/lib/cache-keys";
import { ConflictError, NotFoundError, ForbiddenError } from "@/shared/errors";
import { sendMemberInvite } from "@/lib/email";
import { InviteMemberDTO, updateRoleDTO } from "./org.schema";

export class OrgAdminService {
  //to send a fresh invite
  // and re-invite already invited by expiring existing token
  async inviteMember(
    orgId: string,
    data: InviteMemberDTO,
    invitedByUserId: string,
  ) {
    //1. verify wehter org exists
    const org = await cache.wrap(CacheKeys.orgById(orgId), 900, () =>
      OrganizationRepo.findById(orgId),
    );

    if (!org) throw new NotFoundError("Organization Not Found");
    if (org.deletedAt) throw new NotFoundError("Organization Not Found");

    //2. check if the email is already active or pending inside member table
    //of this org

    const existingUser = await cache.wrap(
      CacheKeys.userByEmail(data.email),
      600,
      () => UserRepo.findByMail(data.email),
    );

    if (existingUser) {
      const existingMemberShip = await OrganizationRepo.findMemberByUserId(
        existingUser.id,
        orgId,
      );
      if (existingMemberShip)
        throw new ConflictError("User is already a member of this org");
    }

    //3. expire any current invitation token

    const existingInvite = await OrganizationRepo.findPendingInvitation(
      data.email,
      orgId,
    );

    if (existingInvite) {
      await InvitationRepo.markExpired(existingInvite.id);
      await cache.del(CacheKeys.invitationByToken(existingInvite.token));
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //4. Atomically create/find user, create orgMember, create invitation
    await prisma.$transaction(async (tx) => {
      const user =
        existingUser ?? (await UserRepo.createPending(data.email, tx));
      await OrganizationRepo.createMember(
        { orgId, userId: user.id, role: data.role },
        tx,
      );
      await InvitationRepo.create(
        {
          email: data.email,
          orgId,
          role: data.role,
          token,
          invitedBy: invitedByUserId,
          expiresAt,
        },
        tx,
      );
    });

    await cache.del(CacheKeys.orgMembers(orgId));
    //TODO: complete mail later
    // await sendMailInvite({
    //   email: data.email,
    //   token,
    //   orgName: org.name,
    //   role: data.role,
    // });
  }

  async listMembers(orgId: string) {
    return cache.wrap(CacheKeys.orgMembers(orgId), 300, () =>
      OrganizationRepo.findAllMembers(orgId),
    );
  }

  async updateMemberRole(
    orgId: string,
    memberId: string,
    data: updateRoleDTO,
    updatedByUserId: string,
  ) {
    const member = await OrganizationRepo.findMemberByUserId(memberId, orgId);
    if (!member) throw new NotFoundError("Member not found");
    if (member.role === OrgRole.org_admin)
      throw new ForbiddenError("Cannot change the role of Organization Admin");

    const updated = await OrganizationRepo.updateMemberRole(
      member.id,
      orgId,
      data.role,
      updatedByUserId,
    );

    await cache.del(
      CacheKeys.orgMembers(orgId),
      CacheKeys.orgMemberByUserId(member.userId, orgId),
    );

    return updated;
  }

  async removeMember(memberId: string, orgId: string) {
    const member = await OrganizationRepo.findMemberByUserId(memberId, orgId);
    if (!member) throw new NotFoundError("Member not found");
    if (member.role === OrgRole.org_admin)
      throw new ForbiddenError("Cannot change the role of Organization Admin");

    await OrganizationRepo.removeMember(orgId, member.id);

    await cache.del(
      CacheKeys.orgMembers(orgId),
      CacheKeys.orgMemberByUserId(member.userId, orgId),
    );
  }
}
