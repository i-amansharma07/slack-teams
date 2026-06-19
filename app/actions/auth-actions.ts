"use server";

import { signIn } from "@/modules/auth/auth";
import { AuthError } from "next-auth";
import { getAuthService } from "@/lib/container";
import { AppError } from "@/shared/errors";

export type AuthState = { error: string | null };
export type RegisterState = { error: string | null };

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const token = formData.get("token") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  try {
    const user = await getAuthService().register({ token, name, password });
    await signIn("credentials", {
      email: user.email,
      password,
      redirectTo: "/login",
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message }; // surface service errors to the form
    }
    if (error instanceof AuthError) {
      return { error: "Registration failed. Please try again." };
    }
    throw error; // must stay as-is — NEXT_REDIRECT travels this path
  }
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
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
