import { requireOrgAdmin } from "@/lib/guards";
import { BadRequestError, handleError } from "@/shared/errors";
import { updateRoleSchema } from "@/modules/org/org.schema";
import { withLogger } from "@/lib/with-logger";
import { NextRequest, NextResponse } from "next/server";
import { getOrgAdminService } from "@/lib/container";

export const POST = withLogger(
  async (req: NextRequest, session = null, { params }) => {
    try {
      const { orgId, memberId } = await params;
      await requireOrgAdmin(session, orgId);
      const rawBody = await req.json();
      const body = updateRoleSchema.safeParse(rawBody);
      if (!body.success) {
        throw new BadRequestError(body.error?.message);
      }
      const updatedMember = await getOrgAdminService().updateMemberRole(
        orgId,
        memberId,
        body.data,
        session?.user?.id as string,
      );
      return NextResponse.json(
        { message: "member updated", data: updatedMember },
        { status: 201 },
      );
    } catch (error) {
      return handleError(error);
    }
  },
);

export const DELETE = withLogger(
  async (_req: NextRequest, session = null, { params }) => {
    try {
      const { orgId, memberId } = await params;
      await requireOrgAdmin(session, orgId);
      await getOrgAdminService().removeMember(memberId, orgId);
      return NextResponse.json({ message: "Member deleted" }, { status: 204 });
    } catch (error) {
      return handleError(error);
    }
  },
);
