import { requireOrgAdmin } from "@/lib/guards";
import { getOrgAdminService } from "@/lib/container";
import { handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";

export const GET = withLogger(async (_req, session = null, { params }) => {
  try {
    const { orgId } = await params;
    await requireOrgAdmin(session, orgId);
    const members = await getOrgAdminService().listMembers(orgId);
    return Response.json(members);
  } catch (error) {
    return handleError(error);
  }
});
