/*

Why: Every super-admin route needs two checks — is the user authenticated, and do they have
`isSuperAdmin = true`. Instead of repeating this in every route handler, we extract it into one
function. Any route that calls `requireSuperAdmin()` gets both checks in one line and throws the
right HTTP error automatically.

*/

import { AppError, ForbiddenError, UnauthorizedError } from "@/shared/errors";
import { Session } from "next-auth";
import { cache } from "@/lib/cache";
import { CacheKeys } from "./cache-keys";
import { OrganizationRepo } from "@/db/repos/org.repo";

export async function requireSuperAdmin(session: Session | null) {
  //checking wether user is logged in or not
  if (!session?.user) throw new UnauthorizedError();

  if (!(session.user as any).isSuperAdmin)
    throw new ForbiddenError("Super Admin access is required");

  return session;
}

export async function requireOrgAdmin(session: Session | null, orgId: string) {
  if (!session?.user) throw new UnauthorizedError();

  if (!orgId)
    throw new AppError(
      "Internal Server Error - OrgId is not passed to Guard",
      500,
    );

  const membership = await cache.wrap(
    CacheKeys.orgMemberByUserId(session.user.id as string, orgId),
    600,
    () =>
      OrganizationRepo.findMemberByUserId(session.user?.id as string, orgId),
  );

  if (
    !membership ||
    membership.role !== "org_admin" ||
    membership.status !== "active"
  ) {
    throw new ForbiddenError("Org Admin Access is required");
  }

  return session;
}
