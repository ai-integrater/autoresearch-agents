# PortalBridge

Phase 1 scaffold for a personal Entra-authenticated dashboard with drag-and-drop, resizable tiles powered by Microsoft Graph.

Working title from the concept doc; rename freely.

## What's in here

- **Next.js 15 (App Router) + TypeScript + Tailwind** — single repo, BFF lives in `/src/app/api`.
- **MSAL** — `@azure/msal-browser` + `@azure/msal-react` on the client, `@azure/msal-node` on the server for the on-behalf-of (OBO) flow.
- **Tile registry** — each tile self-registers with its component, default size, and required scopes. Adding a tile is one entry in `tile-registry.ts`.
- **Layout persistence abstraction** — `LayoutStore` interface with a `LocalStorageStore` Phase 1 impl. Swap to a server-backed impl in Phase 2 without touching tile code.
- **Two starter tiles** — `me` (User.Read, no admin consent) and `users-count` (User.Read.All, requires admin consent — useful for proving the consent path).
- **One BFF route** — `GET /api/graph/me` demos OBO end-to-end. Use this shape for any future server-side Graph call (audit logging, write actions).

## Layout

```
src/
  app/
    layout.tsx            // wraps everything in <AuthProvider>
    page.tsx              // sign-in / authenticated dashboard
    api/graph/me/route.ts // BFF route demonstrating OBO flow
  auth/
    msal-config.ts        // public client config + scope catalog
    msal-provider.tsx     // initializes PCA, sets active account
    server-graph.ts       // confidential client + OBO helper
  components/
    dashboard-grid.tsx    // react-grid-layout + add/remove/reset
    sign-in-button.tsx
    tile-registry.ts      // single source of truth for tile types
    tiles/
      me-tile.tsx
      users-count-tile.tsx
  lib/
    graph.ts              // SPA-side Graph fetch w/ token acquisition
    layout-store.ts       // LayoutStore interface + localStorage impl
  types/
    index.ts              // TileInstance, DashboardLayout, defaults
```

## Local setup

```bash
cd portalbridge
npm install
cp .env.example .env.development
# fill in CLIENT_ID and TENANT_ID from your dev app reg
npm run dev
```

Open http://localhost:3000 and sign in with a user in your dev tenant.

## Entra app registration (per environment)

Register **three separate apps** — one each for dev, test, prod. Sharing app regs across environments mixes consent grants and complicates secret rotation.

For each:

1. **Microsoft Entra admin center** → Applications → App registrations → **New registration**
2. **Name**: `PortalBridge-dev` / `-test` / `-prod`
3. **Supported account types**: Single tenant (or multi-tenant if you need it)
4. **Redirect URI**: Single-page application (SPA) → `http://localhost:3000` for dev, your real URL for test/prod
5. After creating:
   - Copy **Application (client) ID** → `NEXT_PUBLIC_AZURE_CLIENT_ID`
   - Copy **Directory (tenant) ID** → `NEXT_PUBLIC_AZURE_TENANT_ID`
6. **Certificates & secrets** → New client secret → store in Key Vault for that environment, copy to `AZURE_CLIENT_SECRET` locally
7. **API permissions**:
   - Microsoft Graph → Delegated → `User.Read` (default)
   - Add `User.Read.All` for the users-count tile (requires admin consent — click **Grant admin consent**)
8. **Expose an API** (only needed if you start using the BFF/OBO route):
   - Add Application ID URI: `api://<CLIENT_ID>`
   - Add a scope (e.g. `access_as_user`)
   - In **API permissions**, add a permission to your own API for `access_as_user`

## Three-environment env files

```
.env.development   # dev tenant + dev app reg
.env.test          # test tenant + test app reg, points at staging hostname
.env.production    # prod tenant + prod app reg, points at prod hostname
```

`.gitignore` excludes all of them. In CI/CD, hydrate the right file from Key Vault per pipeline stage.

## Adding a new tile

1. Create `src/components/tiles/<name>-tile.tsx`
2. Add the scope it needs to `scopes` in `src/auth/msal-config.ts`
3. Add a `TileType` literal in `src/types/index.ts`
4. Register it in `TILE_REGISTRY` in `src/components/tile-registry.ts`

That's it — the grid picks it up, the add-tile button list updates automatically.

## Phase 2 candidates

- Replace `LocalStorageStore` with a server-backed `ApiStore` hitting `/api/layout` (Postgres via Drizzle, or Cosmos).
- Audit log table — write a row on every action-module invocation through the BFF.
- Action modules (write operations: add user, reset password, assign license). Route everything through the BFF for audit + scope minimization.
- Edge/Chrome extension companion that uses `window.open` with screen coords to tile the actual portal windows side-by-side, since Microsoft admin portals block iframe embedding.
- App roles in the manifest → role-aware tile visibility (Phase 1 only filters on Graph permission errors).

## Known limits / honest notes

- **localStorage layout is per-browser, not per-user.** Two browsers = two layouts. The abstraction is set up so the Phase 2 swap is trivial; just don't ship like this.
- **Most Microsoft admin portals block iframe embedding** (`X-Frame-Options: DENY`). This scaffold doesn't try — tiles are API-driven widgets, not embedded portals. If you want side-by-side portal windows, that's a browser extension story, not a web app.
- **`User.Read.All` requires admin consent.** The users-count tile will show "Needs admin consent" until a Global Admin grants it. That's the correct behavior for a test tenant.
- **No tests yet.** Add Vitest/Playwright in Phase 2 once the surface stabilizes.
