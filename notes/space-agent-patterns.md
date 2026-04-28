# Space Agent — Patterns Worth Lifting into PortalBridge

Findings from reading [agent0ai/space-agent](https://github.com/agent0ai/space-agent) (upstream of `ai-integrater/space-agent`) at commit `1289793`, repo version `v0.64` (note: `package.json` still reads `0.36.0` — version drift is real).

## The actual superpower: autolearning as filesystem state

Most agent frameworks treat capabilities as static — defined in code at boot, frozen for the life of the process. Space Agent treats capabilities as **mutable filesystem state**: the agent reads markdown files at the right paths to know what it can do, and writes new markdown files to extend itself. The "agent reshapes the UI" framing in the README is one downstream expression of this; the architectural primitive underneath is a self-modifying knowledge substrate with five well-engineered properties.

### How the loop works

1. **Discovery is a glob, not a registry.** `app/L0/_all/mod/_core/skillset/skills.js` defines:
   ```js
   export const TOP_LEVEL_SKILL_FILE_PATTERN = "mod/*/*/ext/skills/*/SKILL.md";
   ```
   Drop a `SKILL.md` at the right path under any layer/mod/skill name and it's loaded. There is no `register("my-skill", ...)` call to add. The agent only needs to know the path convention.

2. **Skills are conditional context, not always-on tools.** Each `SKILL.md` carries YAML frontmatter:
   ```yaml
   ---
   name: Browser Control
   metadata:
     placement: system   # system | history | transient
     when:
       tags: [onscreen]            # skill becomes available when these tags are active
     loaded:
       tags: [onscreen, browser:open]  # skill stays loaded across turns when these tags are active
   ---
   ```
   `placement` decides where the skill body gets injected — into the system prompt, the running chat history, or as a transient block at request time. `when` and `loaded` make injection **conditional on tag-set match**, evaluated against tags collected by `framework/js/context.js`. This is much cleaner than "system prompt + 50 tools and hope the model picks the right one."

3. **Authoring uses the same format as reading.** A skill the framework ships and a skill the agent writes are byte-identical in shape — markdown with YAML frontmatter, a `transient` section listing what's contextually available, a `workflow` section describing how to use it. The agent doesn't need a separate authoring API; it writes the same file format it consumes.

4. **Layered overrides give clean multi-tenancy.** `app/L0/` is the framework default. `app/L1/<group>/` shadows it for a group. `app/L2/<user>/` shadows for a single user. Same glob picks up skills at any layer; the resolver picks the most specific. So the agent can learn a user-specific skill without contaminating the framework, and a group can promote a user skill to the group layer by moving one file.

5. **Git history is the rollback layer.** `isomorphic-git` is one of three production deps. `server/app.js` calls `flushGitHistoryCommits()` at lifecycle points; `server/lib/customware/git_history.js` records changes the agent makes to user/group layers as commits. The `time_travel` mod surfaces this. So when the agent learns something wrong, you don't reason about state migrations — you `git revert` a commit.

### Why this is the superpower

- **Capabilities compound over time.** Every skill the agent authors is durable, structured, and reviewable. Sessions don't reset.
- **Auditability is free.** Every change is a git commit with the file the agent wrote. For a Microsoft-tenant deployment that's a compliance win without extra plumbing.
- **The substrate is portable.** The format isn't tied to space-agent's UI runtime. The same conditional-injection-by-tag-set, layered-override, glob-discovered idea works inside any agent that reads markdown files.

### What this implies for PortalBridge

PortalBridge already has a tile registry (`src/components/tile-registry.ts`) and a layout store (`src/lib/layout-store.ts`). The high-leverage idea isn't "rewrite tiles as folders" — it's **borrow the SKILL.md substrate for portal-specific knowledge packs**:

- A `skills/` directory of markdown files describing domain operations: Graph query templates, Entra troubleshooting runbooks, role-specific dashboards.
- YAML frontmatter with `when.tags` like `tenant:contoso`, `role:helpdesk`, `incident:active` — the LLM gets exactly the context relevant to the current operator and situation.
- L0/L1/L2 maps to framework / org / user skill layers — the org admin authors org-wide skills; users can override locally; the framework ships defaults.
- Git-backed history of skill edits as a compliance trail.
- The LLM authors new skills (under review) when it figures out a useful pattern; review is reading a markdown PR.

That's the real port. The tile registry is downstream — once you have a skill that knows how to query Graph, the tile that visualizes the result is straightforward.

## Verified facts

| Claim | Verified at | Result |
|---|---|---|
| 3 production deps | `package.json` `dependencies` | `archiver`, `electron-updater`, `isomorphic-git`. Transitive tree is 151 packages. |
| SCRAM-SHA-256 + PBKDF2 (310k) + AES-256-GCM | `server/lib/auth/passwords.js` | Confirmed. `timingSafeEqual` used for compares. |
| Custom router, no framework | `server/router/router.js` | Imports only `node:url` + internal modules. |
| Glob skill discovery | `app/L0/_all/mod/_core/skillset/skills.js` | `TOP_LEVEL_SKILL_FILE_PATTERN = "mod/*/*/ext/skills/*/SKILL.md"`. |
| Three skill placements | same file | `SYSTEM`, `HISTORY`, `TRANSIENT` exported from `SKILL_PLACEMENT`. |
| Conditional skill loading | sample `SKILL.md` files | `metadata.when.tags` and `metadata.loaded.tags` evaluated against current tag-set. |
| Git history is auto-flushed | `server/app.js` | Calls `flushGitHistoryCommits()` from `server/lib/customware/git_history.js`. |
| 37 `*_test.mjs` files | `tests/` | Confirmed. Native `node:test` runner. |
| No test-on-PR CI | `.github/workflows/` | Only `release-desktop.yml` (tag-push Electron build). No CI runs the test suite on PR. |
| Server boots cleanly | `node space serve` from `/tmp/space-agent` | Reports `v0.64`, listens on `http://127.0.0.1:3000`. |
| Author concentration | `git shortlog -sn` | frdel (48) + Jan Tomášek (11) = 59/66 commits = **89%**. Bus factor ≈ 1. |
| Mobile-bridge config | `package.json` `nodejsformobile` | Present, declared entry point `space`, default command `serve`. |

## Supporting infrastructure (downstream of the substrate)

These patterns are real and worth understanding, but they exist *because* the substrate exists. Don't optimize for them in isolation.

### Folder-per-mod tile structure

`app/L0/_all/mod/_core/<mod>/` — each mod is a folder with `view.html`, `<mod>.css`, `AGENTS.md`. 21 core mods including `dashboard`, `panels`, `file_explorer`, `web_browsing`, `time_travel`. The folder structure is what makes the substrate **navigable** by the agent — a flat module file would have been faster to ship but would not be discoverable the same way.

For PortalBridge: only relevant once you have ≥5 tile types and a real need to add a sixth without redeploying. Premature otherwise.

### State-version header for hot-reload

`server/runtime/state_system.js` defines `STATE_VERSION_HEADER = "Space-State-Version"`. The router waits up to 1s for in-flight requests to catch up to a new state version. Needed because the substrate changes at runtime — without it, the agent rewriting a skill mid-request would corrupt the response.

For PortalBridge: not needed yet. Becomes relevant when live skill/layout edits propagate across open tabs.

### Tiny-server discipline

`server/app.js` is 80 lines. The router (`server/router/router.js`) imports only `node:url` plus internal modules. No Express, no Fastify, no Babel. Three direct production deps (151 transitive). The discipline keeps the runtime lean enough to ship as one Electron bundle or a thin Node container.

For PortalBridge: not a refactor target — Next.js earns its weight. Useful **mindset** for future Node services (Graph proxy, billing webhook, etc.): consider whether plain `node:http` does the job before reaching for a framework.

## Patterns to *not* copy

- **Custom password store.** PortalBridge uses MSAL + Entra. SCRAM/PBKDF2 in space-agent is an artifact of being self-hostable without an IdP. Don't reinvent.
- **Electron packaging.** PortalBridge ships to a browser via Next.js hosting. Skip.
- **`AGENTS.md`-only documentation.** They have 10+ `AGENTS.md` files and very little human-facing docs. Write both for your codebase.
- **Skipping test-on-PR CI.** The 37-test suite is real engineering and it isn't running on PRs. Don't replicate that gap in PortalBridge.

## Concrete follow-ups for PortalBridge (in order)

1. **Prototype a `skills/` directory** with one markdown skill — e.g., `skills/graph-list-users/SKILL.md` describing how to call Graph `/users` with paging — and a glob loader that reads all `skills/**/SKILL.md` and injects matching frontmatter into the system prompt. This is the smallest meaningful slice of the substrate. ~1 day of work to validate the shape.
2. **Define PortalBridge's tag vocabulary** before adding more skills: `tenant:<id>`, `role:<helpdesk|admin|finance>`, `surface:<dashboard|incident-view>`, etc. Tag-set design is most of the engineering of this pattern; without it, conditional loading degenerates to "always on."
3. **Wire git-backed skill history** once there are >3 skills. `simple-git` or `isomorphic-git` in a Next.js API route is fine; commit on every skill write with the user identity from MSAL. This is the audit trail.
4. **Layer skills (L0/L1/L2)** when an org actually asks for it. Don't build the override resolver speculatively.
5. **Set up `npm test` + `npm run build` GitHub Actions** before any of the above. Don't replicate space-agent's CI gap.

## How to read the source yourself

90-minute path:

1. `/tmp/space-agent/README.md` — pitch + run instructions (lines 92–118).
2. `/tmp/space-agent/app/L0/_all/mod/_core/skillset/skills.js` — **the substrate**. Read this first.
3. `/tmp/space-agent/app/L0/_all/mod/_core/skillset/AGENTS.md` — what the substrate owns.
4. `/tmp/space-agent/app/L0/_all/mod/_core/skillset/ext/skills/browser-control/SKILL.md` — sample skill format.
5. `/tmp/space-agent/server/lib/customware/git_history.js` — auto-versioning of agent writes.
6. `/tmp/space-agent/server/app.js` — server bootstrap, lifecycle hooks for git history flush.
7. `/tmp/space-agent/server/router/router.js` — state-version handling.
8. `/tmp/space-agent/tests/login_hooks_test.mjs` — sample integration test.

`package.json`, `server/lib/auth/passwords.js`, and the Electron packaging are interesting but not on the critical path for understanding the substrate.

## Run it locally

```bash
cd /tmp/space-agent  # or your fork checkout
npm install
node space user create admin --password "change-me-now" --full-name "Admin" --groups _admin
node space serve
# open http://127.0.0.1:3000
```

You'll need an LLM API key configured before the agent does anything useful — see `commands/params.yaml` for the runtime config surface.
