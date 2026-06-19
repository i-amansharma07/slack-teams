"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm({ token }: { token: string }) {
  const [state, action, isPending] = useActionState(registerAction, { error: null });
  
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Input
        id="name"
        name="name"
        type="text"
        label="Full name"
        placeholder="John Doe"
        required
        autoComplete="name"
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
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
        Create account
      </Button>
    </form>
  );
}
