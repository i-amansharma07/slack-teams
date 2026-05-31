import { requireSuperAdmin } from "@/lib/guards";
import { getOrgService } from "@/lib/container";
import { CreateOrgSchema } from "@/modules/org/org.schema";
import { BadRequestError, handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";
import { NextRequest } from "next/server";
import { id } from "zod/locales";

export const GET = withLogger(async () => {
  try {
    await requireSuperAdmin();
    const orgs = await getOrgService().listOrgs();
    return Response.json(orgs);
  } catch (error) {
    return handleError(error);
  }
});

export const POST = withLogger(async (req: NextRequest) => {
  try {
    const session = await requireSuperAdmin();
    const rawBody = await req.json();
    const body = CreateOrgSchema.safeParse(rawBody);
    if (!body.success) throw new BadRequestError(body.error.message);
    const createOrg = await getOrgService().createOrgwithAdmin(
      body.data,
      session.user?.id as string,
    );
    return Response.json({});
  } catch (error) {
    return handleError(error);
  }
});
