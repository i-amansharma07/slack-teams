"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, { error: null });

  return (
    <form action={action} className="space-y-4">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="admin@example.com"
        required
        autoComplete="email"
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />
      {state.error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <Button
        type="submit"
        loading={isPending}
        className="w-full mt-2"
        size="lg"
      >
        Sign in
      </Button>
    </form>
  );
}
