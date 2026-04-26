"use client";

import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { SignInButton } from "@/components/sign-in-button";
import { DashboardGrid } from "@/components/dashboard-grid";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-8 py-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">PortalBridge</h1>
          <p className="text-xs text-zinc-500">
            One command center for every business dashboard.
          </p>
        </div>
        <SignInButton />
      </header>

      <UnauthenticatedTemplate>
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <h2 className="text-lg font-medium">Sign in to view your dashboard</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Your tiles are personal and load only what your Entra roles allow.
          </p>
        </div>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <DashboardGrid />
      </AuthenticatedTemplate>
    </main>
  );
}
