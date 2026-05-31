import { requireSuperAdmin } from "@/lib/guards";
import { getOrgService } from "@/lib/container";
import { BadRequestError, handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";
import { NextRequest } from "next/server";

export const DELETE = withLogger(async (req: NextRequest) => {
  try {
    const session = await requireSuperAdmin();
    const orgId = req.nextUrl.pathname.split("/").at(-1);
    await getOrgService().deleteOrg(orgId!, session.user?.id!);
    return Response.json({ message: "Organization deleted" });
  } catch (error) {
    return handleError(error);
  }
});
