import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/modules/auth/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/");

  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            {token ? "Complete your invitation to get started" : "No invitation token found"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {token ? (
            <RegisterForm token={token} />
          ) : (
            <p className="text-sm text-center text-red-500">
              This invite link is invalid or has expired. Please request a new one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
