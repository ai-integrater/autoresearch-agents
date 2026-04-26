"use client";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, type AccountInfo } from "@azure/msal-browser";
import { useEffect, useState } from "react";
import { msalConfig } from "./msal-config";

let pca: PublicClientApplication | null = null;

function getInstance(): PublicClientApplication {
  if (!pca) pca = new PublicClientApplication(msalConfig);
  return pca;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const instance = getInstance();
    instance.initialize().then(() => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) instance.setActiveAccount(accounts[0]);

      instance.addEventCallback((event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS &&
          event.payload &&
          "account" in event.payload
        ) {
          instance.setActiveAccount(event.payload.account as AccountInfo);
        }
      });

      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-400">
        Initializing…
      </div>
    );
  }

  return <MsalProvider instance={getInstance()}>{children}</MsalProvider>;
}
