# Space Agent — Patterns Worth Lifting into PortalBridge

Findings from reading [agent0ai/space-agent](https://github.com/agent0ai/space-agent) (upstream of `ai-integrater/space-agent`) at commit `1289793`, repo version `v0.64` (note: `package.json` still reads `0.36.0` — version drift is real).

This file captures patterns the upstream uses well that map cleanly to PortalBridge. Not a fork plan, not a port. Just the architectural ideas worth borrowing.

## Verified facts

| Claim | Verified at | Result |
|---|---|---|
| 3 production deps | `package.json` `dependencies` | `archiver`, `electron-updater`, `isomorphic-git`. Transitive tree is 151 packages. |
| SCRAM-SHA-256 + PBKDF2 (310k) + AES-256-GCM | `server/lib/auth/passwords.js` | Confirmed. `timingSafeEqual` used for compares. |
| Custom router, no framework | `server/router/router.js` | Imports only `node:url` + internal modules. |
| 37 `*_test.mjs` files | `tests/` | Confirmed. Native `node:test` runner. |
| No test-on-PR CI | `.github/workflows/` | Only `release-desktop.yml` (tag-push Electron build). No CI runs the test suite on PR. |
| Server boots cleanly | `node space serve` from `/tmp/space-agent` | Reports `v0.64`, listens on `http://127.0.0.1:3000`. |
| Author concentration | `git shortlog -sn` | frdel (48) + Jan Tomášek (11) = 59/66 commits = **89%**. Bus factor ≈ 1. |
| Mobile-bridge config | `package.json` `nodejsformobile` | Present, declared entry point `space`, default command `serve`. |

## Patterns to lift

### 1. Modular tile registry where tiles ship as folders, not code

**Where it lives:** `app/L0/_all/mod/_core/<mod-name>/` — each mod is a folder with `view.html`, `<mod>.css`, and an `AGENTS.md` describing it. 21 core mods (`dashboard`, `panels`, `file_explorer`, `agent`, `web_browsing`, `spaces`, `time_travel`, etc.) all follow the same shape.

**Why it's good:** A new tile is a new folder, not a code change to a registry file. The agent itself can author one because the surface is markup, not TS imports.

**Where it'd help PortalBridge:** Today `src/components/tile-registry.ts` likely hardcodes tile types. Worth considering: refactor toward `src/tiles/<tile-name>/{component.tsx, manifest.json, README.md}` with the registry doing dynamic discovery. The payoff is bigger once you want users (or the LLM) to add tiles without touching framework code.

**Caveat:** Don't build this until you have ≥5 tile types and a real need to add a sixth without redeploying. Premature.

### 2. Layered overrides (L0 → L1 → L2)

**Where it lives:** Top-level `app/L0/`, `app/L1/`, `app/L2/`. L0 = framework defaults (mods like `dashboard`, `panels`); the same path under L1 or L2 wins for that tenant/user. Search-and-load order is cheap and explicit — no DI container, no plugin manifest.

**Why it's good:** Multi-tenancy without conditional code paths in the core. The override is a file at the right path or it isn't.

**Where it'd help PortalBridge:** Per-org or per-user layout overrides. PortalBridge already has `src/lib/layout-store.ts`; a layered file-path resolver is a more powerful model than a flat key/value override store once you start having org-wide defaults that users can selectively shadow.

### 3. State-version header for safe hot-reload

**Where it lives:** `server/runtime/state_system.js` defines `STATE_VERSION_HEADER = "Space-State-Version"`. The router (`server/router/router.js`) checks it on requests and waits up to `STATE_VERSION_WAIT_TIMEOUT_MS = 1000` for a worker to catch up before serving.

**Why it's good:** When the agent self-modifies the running app, you need a way for in-flight requests to either wait briefly for the new state or fail loudly. A monotonically-incrementing version header on every request is a much simpler primitive than full session migration.

**Where it'd help PortalBridge:** Not yet — but the moment PortalBridge starts allowing live layout edits that propagate to other open tabs of the same user, this is the pattern. Borrow `Space-State-Version` semantics for tab-to-tab layout consistency.

### 4. `nodejsformobile` mobile-bridge declaration

**Where it lives:** `package.json` lines 90–94. Declares an entry script + default command + purpose, designed to run inside [nodejs-mobile](https://github.com/nodejs-mobile/nodejs-mobile) on iOS/Android.

**Why it's good:** Mobile is a config block, not a separate runtime. The same Node code runs in the mobile app via the bridge.

**Where it'd help PortalBridge:** Direct relevance is low (PortalBridge is Next.js, not pure Node). But if the llm-startup mobile use case ever needs a local proxy on the phone (for token-secured Graph calls, offline cache, etc.), this is prior art for a thin Node shim shipping inside an app.

### 5. Tiny-server discipline

**Where it lives:** All of `/server/` — `app.js` is 80 lines of clean DI composition, `router/router.js` is hand-rolled, no Express/Fastify/Koa.

**Why it's good:** They wrote the framework they needed. No Babel, no ts-node, no webpack. `node space serve` is the entire toolchain.

**Where it'd help PortalBridge:** Not an immediate refactor target — Next.js earns its weight. But a useful **mindset** when you stand up the next service (e.g., a billing webhook handler, a Graph proxy): consider whether plain `node:http` + a 100-line router does the job before reaching for Express.

## Patterns to *not* copy

- **Custom password store.** PortalBridge uses MSAL + Entra. SCRAM/PBKDF2 here is an artifact of being self-hostable without an IdP. Don't reinvent.
- **Electron packaging.** PortalBridge ships to a browser via Next.js hosting. Skip.
- **`AGENTS.md`-only documentation.** They have 10+ `AGENTS.md` files and very little human-facing docs. Write both for your codebase.
- **Skipping test-on-PR CI.** The 37-test suite is real engineering and it isn't running on PRs. Don't replicate that gap in PortalBridge.

## Suggested follow-ups for PortalBridge (not blocking)

1. When `tile-registry.ts` reaches ~5 tile types, evaluate a folder-per-tile refactor (Pattern 1).
2. When `layout-store.ts` needs org-level defaults users can override, evaluate layered resolution (Pattern 2).
3. Set up GitHub Actions for `npm test` and `npm run build` on PR before either of the above.

## How to read the source yourself

90-minute path:

1. `/tmp/space-agent/README.md` — pitch + run instructions (lines 92–118 are the host-yourself flow).
2. `/tmp/space-agent/package.json` — dep surface, mobile-bridge config, build config.
3. `/tmp/space-agent/server/app.js` — server bootstrap, ~80 lines.
4. `/tmp/space-agent/server/router/router.js` — hand-rolled router, state-version handling.
5. `/tmp/space-agent/server/lib/auth/passwords.js` — SCRAM crypto.
6. `/tmp/space-agent/app/L0/_all/mod/_core/dashboard/` — sample mod (3 files).
7. `/tmp/space-agent/app/L0/_all/mod/_core/skillset/ext/skills/browser-control/SKILL.md` — sample skill.
8. `/tmp/space-agent/tests/login_hooks_test.mjs` — sample integration test.

## Run it locally

```bash
cd /tmp/space-agent  # or your fork checkout
npm install
node space user create admin --password "change-me-now" --full-name "Admin" --groups _admin
node space serve
# open http://127.0.0.1:3000
```

You'll need an LLM API key configured before the agent does anything useful — see `commands/params.yaml` for the runtime config surface.
