"use server";

import { auth } from "@/modules/auth/auth";
import { getOrgService } from "@/lib/container";
import { revalidatePath } from "next/cache";

type AdminSession = {
  user: { id: string; isSuperAdmin?: boolean };
};

export type OrgActionState = { error: string | null; success?: boolean };

export async function createOrgAction(
  _prevState: OrgActionState,
  formData: FormData
): Promise<OrgActionState> {
  const session = (await auth()) as AdminSession | null;
  if (!session?.user.isSuperAdmin) {
    return { error: "Unauthorized" };
  }

  const org_name = (formData.get("org_name") as string | null)?.trim();
  const adminEmail = (formData.get("adminEmail") as string | null)?.trim();

  if (!org_name || !adminEmail) {
    return { error: "Org name and admin email are required" };
  }

  try {
    await getOrgService().createOrgwithAdmin(
      { org_name, adminEmail },
      session.user.id,
    );
    revalidatePath("/super-admin/orgs");
    return { error: null, success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create organization";
    return { error: message };
  }
}
