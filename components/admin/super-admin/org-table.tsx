import { OrgWithAdmin } from "@/utils/api";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  Th,
  Td,
} from "@/components/ui/table";
import { formatRole, formatStatus, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";

type OrgTableProps = {
  orgs: OrgWithAdmin[];
};

export function OrgTable({ orgs }: OrgTableProps) {
  if (orgs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900">
          No organizations yet
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Create your first organization to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <Th>Organization</Th>
          <Th>Admin email</Th>
          <Th>Admin name</Th>
          <Th>Role</Th>
          <Th>Status</Th>
        </tr>
      </TableHead>
      <TableBody>
        {orgs.map((org) => {
          const admin = org.members[0];
          return (
            <TableRow key={org.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Badge variant="primary">
                    {org.name.charAt(0).toUpperCase()}
                  </Badge>
                  <span className="font-medium text-gray-900">{org.name}</span>
                </div>
              </Td>
              <Td>
                {admin ? (
                  <span className="text-gray-700">{admin.user.email}</span>
                ) : (
                  <span className="text-gray-400 italic text-xs">No admin</span>
                )}
              </Td>
              <Td>
                {admin?.user.name ?? (
                  <span className="text-gray-400 italic text-xs">
                    Pending setup
                  </span>
                )}
              </Td>
              <Td>{admin ? <Badge>{formatRole(admin.role)}</Badge> : "—"}</Td>
              <Td>
                {admin ? (
                  admin.status === "active" ? (
                    <Badge variant="secondary">
                      {formatStatus(admin.status)}
                    </Badge>
                  ) : (
                    <Badge variant="danger">{formatStatus(admin.status)}</Badge>
                  )
                ) : (
                  "-"
                )}
              </Td>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
