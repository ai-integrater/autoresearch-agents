"use client";

import { useEffect, useState } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import { graphFetch, GraphError } from "@/lib/graph";
import { scopes } from "@/auth/msal-config";

interface UsersResponse {
  "@odata.count"?: number;
  value: unknown[];
}

export function UsersCountTile() {
  const { instance } = useMsal();
  const account = useAccount();
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    graphFetch<UsersResponse>(
      instance,
      account,
      "/users/$count",
      scopes.usersList,
      { headers: { ConsistencyLevel: "eventual" } },
    )
      .then(async () => {
        // /users/$count returns a number, not JSON; refetch as text.
        const result = await fetch("https://graph.microsoft.com/v1.0/users/$count", {
          headers: {
            Authorization: `Bearer ${(await instance.acquireTokenSilent({ account, scopes: [...scopes.usersList] })).accessToken}`,
            ConsistencyLevel: "eventual",
          },
        });
        if (!result.ok) throw new GraphError(result.status, await result.text());
        const text = await result.text();
        if (!cancelled) setCount(Number(text));
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(
            e.message.includes("Authorization_RequestDenied") || e.message.includes("403")
              ? "Needs User.Read.All admin consent"
              : e.message,
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [instance, account]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-4">
      <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Users
      </header>
      <div className="flex flex-1 items-center">
        {error ? (
          <p className="text-sm text-amber-400">{error}</p>
        ) : count === null ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : (
          <p className="text-3xl font-semibold tabular-nums">{count.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
