import { requireOrgAdmin } from "@/lib/guards";
import { getOrgAdminService } from "@/lib/container";
import { InviteMemberSchema } from "@/modules/org/org.schema";
import { withLogger } from "@/lib/with-logger";
import { NextRequest, NextResponse } from "next/server";
import { BadRequestError, handleError } from "@/shared/errors";

export const POST = withLogger(
  async (req: NextRequest, session = null, { params }) => {
    try {
      const { orgId } = await params;
      await requireOrgAdmin(session, orgId);
      const rawBody = await req.json();
      const body = InviteMemberSchema.safeParse(rawBody);
      if (!body.success) {
        throw new BadRequestError(body.error.message);
      }
      await getOrgAdminService().inviteMember(
        orgId,
        body.data,
        session?.user?.id as string,
      );

      return NextResponse.json({ message: "Invitation sent" }, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  },
);
