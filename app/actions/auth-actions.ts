"use server";

import { signIn } from "@/modules/auth/auth";
import { AuthError } from "next-auth";

export type AuthState = { error: string | null };

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/super-admin/orgs",
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password. Please try again." };
    }
    // NEXT_REDIRECT is thrown as a non-AuthError — must be rethrown
    throw error;
  }
}
