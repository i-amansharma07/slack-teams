import { getOrgService } from "@/lib/container";
import { OrgTable } from "@/components/admin/super-admin/org-table";
import { CreateOrgButton } from "@/components/admin/super-admin/create-org-form";
import { PageHeader } from "@/components/shared/page-header";
import { OrgWithAdmin } from "@/utils/api";
import { Badge } from "@/components/ui/badge";

export default async function OrgsPage() {
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
