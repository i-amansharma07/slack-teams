import { requireSuperAdmin } from "@/lib/guards";
import { getOrgService } from "@/lib/container";
import { CreateOrgSchema } from "@/modules/org/org.schema";
import { BadRequestError, handleError } from "@/shared/errors";
import { withLogger } from "@/lib/with-logger";
import { NextRequest } from "next/server";

//super admin can see all the orgs 
export const GET = withLogger(async () => {
  try {
    await requireSuperAdmin();
    const orgs = await getOrgService().listOrgs();
    return Response.json(orgs);
  } catch (error) {
    return handleError(error);
  }
});


//super admin create a new org (only super admin can create org)
//TODO: at application and db layer
/* ***Prod*** :  we ask orgs like give me the name and email of the person
                 who's gonna be the head of this app in your company. 
*/  
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
    return Response.json({
      message: "Org created",
      org: createOrg,
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
});
