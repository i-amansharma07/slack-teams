import { getOrgService } from "@/lib/container";
import { OrgTable } from "@/components/admin/super-admin/org-table";
import { CreateOrgButton } from "@/components/admin/super-admin/create-org-form";
import { PageHeader } from "@/components/shared/page-header";
import { OrgWithAdmin } from "@/utils/api";

export default async function OrgsPage() {

  //TODO: ui should not use containers or they should use?, check on this later
  const orgs = (await getOrgService().listOrgs()) as OrgWithAdmin[];

  return (
    <div>
      <PageHeader
        title="Organizations"
        description={`${orgs.length} organization${orgs.length !== 1 ? "s" : ""} on the platform`}
        action={<CreateOrgButton />}
      />
      <OrgTable orgs={orgs} />
    </div>
  );
}
