import { ConfidentialClientApplication } from "@azure/msal-node";

// BFF pattern: the SPA hands its access token to our server, the server
// exchanges it via the on-behalf-of flow for a Graph token scoped to whatever
// the SPA isn't allowed to call directly. Useful when:
//   - we want server-side audit logging on every Graph call
//   - we need to use scopes the SPA shouldn't hold (e.g., write actions)
//   - we want to centralize rate-limit/backoff handling
//
// Phase 1 keeps this minimal — most tiles still call Graph directly from the
// browser. Add routes here as audit/write requirements appear.

let cca: ConfidentialClientApplication | null = null;

function getClient(): ConfidentialClientApplication {
  if (cca) return cca;

  const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
  const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!clientId || !tenantId || !clientSecret) {
    throw new Error(
      "Missing Entra config — set NEXT_PUBLIC_AZURE_CLIENT_ID, NEXT_PUBLIC_AZURE_TENANT_ID, AZURE_CLIENT_SECRET",
    );
  }

  cca = new ConfidentialClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret,
    },
  });
  return cca;
}

export async function exchangeForGraphToken(
  userAccessToken: string,
  scopes: string[],
): Promise<string> {
  const client = getClient();
  const result = await client.acquireTokenOnBehalfOf({
    oboAssertion: userAccessToken,
    scopes,
  });
  if (!result?.accessToken) {
    throw new Error("OBO token exchange returned no access token");
  }
  return result.accessToken;
}

export function bearerFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
