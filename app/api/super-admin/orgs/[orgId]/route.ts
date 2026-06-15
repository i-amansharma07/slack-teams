import { requireSuperAdmin } from "@/lib/guards";
import { getOrgService } from "@/lib/container";
import { handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";
import { NextRequest } from "next/server";
import { logInfo } from "@/lib/logger";

export const DELETE = withLogger(
  async (_req: NextRequest, session = null, { params }) => {
    try {
      const { orgId } = await params;
      logInfo(`Org id is ${orgId}`);
      const userSession = await requireSuperAdmin(session);
      await getOrgService().deleteOrg(orgId, userSession.user?.id!);
      return Response.json({ message: "Organization deleted" });
    } catch (error) {
      return handleError(error);
    }
  },
);
