import { ReactNode } from "react";
import { auth } from "@/modules/auth/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";

type AdminSession = {
  user: { id: string; email?: string | null; name?: string | null; isSuperAdmin?: boolean };
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = (await auth()) as AdminSession | null;

  if (!session || !session.user.isSuperAdmin) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
