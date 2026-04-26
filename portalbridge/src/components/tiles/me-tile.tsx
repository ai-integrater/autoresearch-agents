"use client";

import { useEffect, useState } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import { graphFetch } from "@/lib/graph";
import { scopes } from "@/auth/msal-config";

interface MeProfile {
  displayName: string;
  userPrincipalName: string;
  jobTitle?: string;
  mail?: string;
}

export function MeTile() {
  const { instance } = useMsal();
  const account = useAccount();
  const [data, setData] = useState<MeProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    graphFetch<MeProfile>(instance, account, "/me", scopes.me)
      .then((p) => !cancelled && setData(p))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [instance, account]);

  return (
    <TileShell title="Signed in">
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : !data ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : (
        <div className="space-y-1">
          <p className="text-base font-medium">{data.displayName}</p>
          <p className="text-xs text-zinc-400">{data.userPrincipalName}</p>
          {data.jobTitle && <p className="text-xs text-zinc-500">{data.jobTitle}</p>}
        </div>
      )}
    </TileShell>
  );
}

function TileShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-4">
      <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
