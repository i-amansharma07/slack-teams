import { prisma } from "@/db/prisma";
import crypto from "crypto";
import { CreateOrgDTO } from "./org.schema";
import { OrganizationRepo } from "@/db/repos/org.repo";
import { UserRepo } from "@/db/repos/user.repo";
import { InvitationRepo } from "@/db/repos/invitation.repo";
import { OrgRole } from "@/lib/generated/prisma/enums";
import { ConflictError, NotFoundError } from "@/shared/errors";
// import {sendOrgAdminInvite} from "@/lib/email";
import { cache } from "@/lib/cache";
import { CacheKeys } from "@/lib/cache-keys";

export class OrgService {
  async createOrgwithAdmin(data: CreateOrgDTO, superAdminId: string) {
    //check the superAdminId is valid or not
    //create a new user with email and some id
    //create org and add the org member with role as org_admin
    //create invitation with pending status

    const existingUser = await cache.wrap(
      CacheKeys.userByEmail(data.adminEmail),
      600,
      () => UserRepo.findByMail(data.adminEmail),
    );

    if (existingUser)
      throw new ConflictError("A user with this email Already exists");

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-days

    const result = await prisma.$transaction(async (tx) => {
      const newOrg = await OrganizationRepo.create(
        {
          name: data.org_name,
          createBy: superAdminId,
        },
        tx,
      );
      const newUser = await UserRepo.createPending(data.adminEmail, tx);
      await OrganizationRepo.createMember(
        {
          orgId: newOrg.id,
          userId: newUser.id,
          role: OrgRole.org_admin,
        },
        tx,
      );
      await InvitationRepo.create(
        {
          email: data.adminEmail,
          orgId: newOrg.id,
          role: OrgRole.org_admin,
          token,
          invitedBy: superAdminId,
          expiresAt,
        },
        tx,
      );
      return newOrg;
    });

    await cache.del(CacheKeys.orgAdminList());
    //TODO: will complete email service this later
    // await sendOrgAdminInvite({email : data.adminEmail, token, orgName : data.name});
    return result;
  }

  async listOrgs() {
    // return await cache.wrap(
    //   CacheKeys.orgAdminList(),
    //   600, //10 mins,
    //   () => OrganizationRepo.findAllOrgAdmin(),
    // );

    return  OrganizationRepo.findAllOrgAdmin();
  }

  async deleteOrg(orgId: string, superAdminId: string) {
    const org = await cache.wrap(
      CacheKeys.orgById(orgId),
      900, // 15 minutes
      () => OrganizationRepo.findById(orgId),
    );

    if (!org) throw new NotFoundError("Organization not found");
    if (org.deletedAt)
      throw new ConflictError("Organization is already deleted");

    const result = await OrganizationRepo.softDelete(orgId, superAdminId);

    // Bust both keys — the specific org AND the list
    await cache.del(CacheKeys.orgById(orgId), CacheKeys.orgAdminList());

    return result;
  }
}
