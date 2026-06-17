"use client";

import { useActionState, useEffect, useState } from "react";
import { createOrgAction } from "@/app/actions/org-actions";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateOrgButton() {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState(createOrgAction, { error: null });

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Organization
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create organization"
      >
        <form action={action} className="space-y-4">
          <Input
            id="org_name"
            name="org_name"
            label="Organization name"
            placeholder="Acme Corp"
            required
            minLength={2}
          />
          <Input
            id="adminEmail"
            name="adminEmail"
            type="email"
            label="Org admin email"
            placeholder="admin@acme.com"
            required
          />
          <p className="text-xs text-gray-500">
            An invitation will be sent to this email to set up the admin account.
          </p>

          {state.error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
