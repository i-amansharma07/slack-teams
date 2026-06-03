/*

Why: Every super-admin route needs two checks — is the user authenticated, and do they have
`isSuperAdmin = true`. Instead of repeating this in every route handler, we extract it into one
function. Any route that calls `requireSuperAdmin()` gets both checks in one line and throws the
right HTTP error automatically.

*/

import { ForbiddenError, UnauthorizedError } from "@/shared/errors";
import { Session } from "next-auth";

export async function requireSuperAdmin(session: Session | null) {
  //checking wether user is logged in or not
  if (!session?.user) throw new UnauthorizedError();

  if (!(session.user as any).isSuperAdmin)
    throw new ForbiddenError("Super Admin access is required");

  return session;
}
