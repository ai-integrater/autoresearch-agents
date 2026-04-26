"use client";

import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { baseLoginRequest } from "@/auth/msal-config";

export function SignInButton() {
  const { instance } = useMsal();
  const isAuthed = useIsAuthenticated();
  const account = useAccount();

  if (isAuthed && account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400">{account.username}</span>
        <button
          onClick={() => instance.logoutRedirect()}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => instance.loginRedirect(baseLoginRequest)}
      className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20"
    >
      Sign in with Microsoft
    </button>
  );
}
