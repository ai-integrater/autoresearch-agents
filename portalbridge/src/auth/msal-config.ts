import type { Configuration } from "@azure/msal-browser";
import { LogLevel } from "@azure/msal-browser";

const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID ?? "common";
const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID ?? "";
const redirectUri =
  process.env.NEXT_PUBLIC_REDIRECT_URI ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: process.env.MSAL_VERBOSE === "true" ? LogLevel.Verbose : LogLevel.Error,
      loggerCallback(level, message, containsPii) {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error("[msal]", message);
        else if (process.env.MSAL_VERBOSE === "true") console.log("[msal]", message);
      },
    },
  },
};

// Scopes are kept minimal and grow per-tile. Each tile can request
// additional scopes incrementally via acquireTokenSilent / Popup.
export const baseLoginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Per-feature scope requests. Add new entries as new tiles are introduced.
export const scopes = {
  me: ["User.Read"],
  usersList: ["User.Read.All"],
} as const;
