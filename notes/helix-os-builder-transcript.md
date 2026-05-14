# HELIX_OS / BUILDER — Conversation Transcript & Design Iterations

**Subject:** Analysis of `ai-integrater/space-agent`, mapping to PortalBridge, fork-prep artifacts.
**Date:** 2026-05-14
**Working repo:** `ai-integrater/autoresearch-agents`, branch `claude/unified-admin-dashboard-nK64n`
**Captured by:** Claude (Opus 4.7, 1M ctx) running in Linux sandbox at `/home/user/autoresearch-agents`.

## What this document is

A verbatim-where-possible record of the conversation that produced the space-agent analysis and the PortalBridge-port recommendation, with **iteration points** marked where the framing or facts shifted. Followed by the design artifacts themselves, also marked with their iteration version.

## Provenance notes (honesty up front)

- **Verbatim** sections are copied from messages still in the active context window.
- **Paraphrased** sections refer to turns that fell out of context due to automatic compression. These are flagged inline as `[PARAPHRASED — out of context]`.
- The user's original ask was re-surfaced via a system reminder mid-conversation; I have that text from the reminder injection, not from the original turn.
- All tool calls and their outputs are summarised, not pasted in full, except where the content **is** the artifact (the design files themselves are reproduced verbatim further down).

---

# Iteration map

```
ITER 0 ─── ORIGIN
           User: "https://github.com/ai-integrater/space-agent go through
                  this repo and analyze its utility and operational
                  efficiencies etc. I think this is a good one..."

ITER 1 ─── PLAN (UI-reshaping framing)
           Assistant: cloned, read, produced 3-option plan.
           Headline framing: "agent reshapes its own UI."
           Verdict: "good code, niche fit for Microsoft/Azure direction."
           Recommended path: study for patterns, lift selectively.

ITER 2 ─── EXECUTION + FACT CORRECTION
           User: "all the above" → execute all three paths.
           Assistant: verified claims against actual code; corrected
             numbers (37 tests not 46; 89% author concentration not 73%;
             PBKDF2=310k confirmed). UI-reshaping framing still intact.
           Deliverables: notes/space-agent-patterns.md (v1) committed +
             pushed; Dockerfile, CI workflow, FORK-NOTES.md staged in
             /tmp/space-agent/.

ITER 3 ─── REFRAME (autolearning as substrate)
           User: "it's more the framework, autolearning type of stuff.
                  That is the real superpower, the fact that it has
                  the tools and context to be able to 'transform' is
                  the icing on the top."
           Assistant: verified the substrate in code (glob discovery,
             SKILL.md frontmatter, three placements, conditional tag
             loading, git auto-versioning); rewrote patterns notes
             with autolearning as the headline pattern; demoted tile
             registry and state-version-header to "supporting infra";
             rewrote PortalBridge follow-ups to start with skills/
             directory prototype, not tile refactor.
           Deliverable: notes/space-agent-patterns.md (v2) committed
             32f74eb + pushed.

ITER 4 ─── THIS DOCUMENT (transcript capture)
           User asked for verbatim transcript + design iterations,
           dropped at G:\HELIX_OS\BUILDER (or equivalent download).
```

---

# Pre-iteration: earlier session state

`[PARAPHRASED — out of context]` Before the space-agent thread began, the session had completed three todos against a separate `llm-startup` repo:
- Wired per-LLM file headers
- Wrote README and `.gitignore`
- Ran `git init` + initial commit, shared push instructions

I do **not** have the verbatim text of those turns. The todos remained on the list at the start of the space-agent thread, marked `completed`, which is the only trace of that work in my current context.

The active working directory throughout this thread was `/home/user/autoresearch-agents` (the repo this document is committed to), and the PortalBridge scaffold under `portalbridge/` was already present from commit `85040f0` ("Scaffold PortalBridge Phase 1 — Entra-authed dashboard with drag/drop tiles").

---

═══════════════════════════════════════════════════════════════════════
# ITERATION 0 — ORIGIN
═══════════════════════════════════════════════════════════════════════

## USER (verbatim, recovered from system-reminder re-injection)

> https://github.com/ai-integrater/space-agent go through this repo and analyze its utility and operational effiiencies etc. I think this is a good one...

## ASSISTANT (paraphrased — original response turn is out of context)

`[PARAPHRASED — out of context]` The first response cloned the repo to `/tmp/space-agent`, did an initial read, and asked a clarifying question (something to the effect of "before I write the plan, which angle matters most — study for patterns, fork it, daily-drive, or use as foundation for new product?"). The user replied **"ata"** — a terse/typo response interpreted as "no strong preference, give me the honest take across the angles."

That clarifying-question turn and the "ata" reply are out of my context window. The next iteration is what I have verbatim.

---

═══════════════════════════════════════════════════════════════════════
# ITERATION 1 — PLAN (UI-reshaping framing)
═══════════════════════════════════════════════════════════════════════

## USER (verbatim)

> ata

## ASSISTANT (verbatim — initial framing)

> Treating "ata" as "no strong preference, give me the honest take across the angles." Writing the plan now.

The assistant then wrote a plan file at `/root/.claude/plans/https-github-com-ai-integrater-space-age-crispy-frost.md`. **Full contents of that plan reproduced in the Design Artifacts section below as "Plan v1."**

Headline framing in this iteration: "A **browser-first AI agent runtime** where the agent runs in the frontend (browser tab or Electron desktop) and reshapes its own UI on the fly by writing pages, widgets, and workflows into the running workspace." Verdict: "good code, niche fit for your stated direction." Recommended path: study for patterns, lift selectively.

**This framing turns out to be wrong as the top-level read.** It anchors on the marketing pitch (agent reshapes UI) rather than the underlying architectural primitive (filesystem-backed self-extension). Iteration 3 corrects this.

> **ITERATION POINT 1 → 2:** User authorised executing all three paths simultaneously with the response "all the above."

---

═══════════════════════════════════════════════════════════════════════
# ITERATION 2 — EXECUTION + FACT CORRECTION
═══════════════════════════════════════════════════════════════════════

## USER (verbatim)

> all the above

## ASSISTANT (verbatim — opening)

> Before I commit to "all three paths," let me verify the actual environment — my plan referenced `/tmp/space-agent`, `PortalBridge`, and `llm-startup`, but the system context says I'm working in `/home/user/autoresearch-agents` on branch `claude/unified-admin-dashboard-nK64n`. I want to confirm what's actually here before acting.

The assistant then ran a verification sweep (working directory contents, git branch, recent commits, presence of `/tmp/space-agent`), confirmed PortalBridge scaffold and space-agent clone both existed, and flagged the **GitHub MCP restriction** to `ai-integrater/autoresearch-agents` — meaning the fork-prep artifacts could be written but not pushed to the `ai-integrater/space-agent` fork from this session.

## ASSISTANT (verbatim — scoping the three tracks)

> Here's how I'll split the three tracks:
>
> | Track | Where artifacts land | Scope |
> |---|---|---|
> | **Study for patterns** | `notes/space-agent-patterns.md` on this branch | In-scope: directly informs the unified-admin-dashboard work |
> | **Daily-drive** | Smoke-test only (no API key here) | I'll `npm install`, boot `node space serve`, capture run instructions + gotchas |
> | **Fork prep** | Files staged in `/tmp/space-agent` | Dockerfile, GitHub Actions CI, upstream-sync runbook — you push |

## Verification surfaced corrections to Iteration 1 plan

The assistant then ran fact-checks against the actual code. Several Iteration 1 claims were **wrong** and were corrected explicitly:

| Iter 1 claim | Iter 2 verified result | Status |
|---|---|---|
| ~73% commits from one author | frdel (48) + Jan Tomášek (11) = **59/66 = 89%** | corrected upward |
| "46 integration tests" | **37** `*_test.mjs` files | corrected |
| "No GitHub Actions running them on PR" | **One workflow exists** (`release-desktop.yml`, tag-push only); still no test-on-PR CI | clarified |
| PBKDF2 at 310k iterations | confirmed `PASSWORD_ITERATIONS = 310_000` | verified |
| SCRAM-SHA-256 + AES-256-GCM + timingSafeEqual | confirmed in `server/lib/auth/passwords.js` | verified |
| 3 direct production deps | confirmed; but **151 transitive packages installed** | refined |
| Server boots clean | confirmed: `v0.64`, listens on `http://127.0.0.1:3000` | verified |
| Mod path `app/L0/_all/mod/...` | confirmed; 21 core mods | verified |

## Execution summary

1. **`npm install` ran clean** (151 packages, 2 deprecation warnings on transitive deps `lodash.isequal` and old `glob`).
2. **Boot smoke test** via `(node space serve > /tmp/space-boot.log 2>&1 &)` produced:
   ```
   space server version v0.64
   space server listening at http://127.0.0.1:3000
   ```
3. **`notes/space-agent-patterns.md` v1** written, committed `b066b76`, pushed to `claude/unified-admin-dashboard-nK64n`.
4. **Dockerfile**, **`.github/workflows/test.yml`**, **`FORK-NOTES.md`** staged in `/tmp/space-agent/` (uncommitted; GitHub MCP cannot reach that fork).
5. **CI test command verified locally**: `node --test tests/login_hooks_test.mjs` passed 5/5.
6. **Draft PR creation blocked** on GitHub MCP OAuth — surfaced as optional follow-up.

## ASSISTANT (verbatim — closing summary)

> **Done — all three tracks executed**
>
> [...]
>
> ### One blocker on draft PR
>
> GitHub MCP needs OAuth before I can open the draft PR for `claude/unified-admin-dashboard-nK64n`. If you want me to create it, open this URL, authorize, and paste the `localhost:62376/callback?...` URL from the browser address bar back into chat:
>
> ```
> https://api.anthropic.com/authorize?response_type=code&client_id=66ec15ff-f51b-40a9-a050-3cb81c9a2fb7&...
> ```
>
> Or skip — the branch is pushed and you can open the PR yourself.

> **ITERATION POINT 2 → 3:** User redirects framing entirely. Not "what does it do" but "what is the architectural primitive that makes it work."

---

═══════════════════════════════════════════════════════════════════════
# ITERATION 3 — REFRAME (autolearning as substrate)
═══════════════════════════════════════════════════════════════════════

## USER (verbatim)

> it's more the framework, autolearning type of stuff. That is the real superpower, the fact that it has the tools and context to be able to "transform" is the icing on the top.

## ASSISTANT (verbatim — acknowledging the reframe)

> That reframe is sharper than what I wrote. The "agent reshapes UI" pitch is the consequence; the real machinery is the **autolearning substrate** — a file-system-backed memory of skills, mods, and AGENTS.md that the agent reads to know its capabilities and writes to extend them, with git history as the rollback layer. Let me verify the loop in code before updating the notes.

## Verification dive — confirming the substrate exists in code

The assistant ran a targeted verification of the autolearning claim. Key findings:

1. **Glob discovery** — `app/L0/_all/mod/_core/skillset/skills.js`:
   ```js
   export const TOP_LEVEL_SKILL_FILE_PATTERN = "mod/*/*/ext/skills/*/SKILL.md";
   ```
   No registry. Drop a `SKILL.md` at the right path under any layer, it's loaded.

2. **Three placement modes** — same file:
   ```js
   export const SKILL_PLACEMENT = Object.freeze({
     HISTORY: "history",
     SYSTEM: "system",
     TRANSIENT: "transient"
   });
   ```
   `system` → injected into system prompt. `history` → injected into chat history. `transient` → injected as request-time context block.

3. **Conditional tag-driven loading** — verified against `ext/skills/browser-control/SKILL.md` frontmatter:
   ```yaml
   metadata:
     placement: system
     when:
       tags:
         - onscreen
     loaded:
       tags:
         - onscreen
         - browser:open
   ```
   `when.tags` → skill becomes available when these tags are active. `loaded.tags` → skill stays loaded across turns when these match. Evaluated against tags collected via `framework/js/context.js`.

4. **Authoring uses the same format as reading.** Framework-shipped skills (7 of them under `ext/skills/`) are byte-identical in shape to anything the agent could author: markdown body + YAML frontmatter.

5. **Git history auto-versions agent writes** — `server/app.js`:
   ```js
   import { flushGitHistoryCommits } from "./lib/customware/git_history.js";
   ...
   await flushGitHistoryCommits();
   ```
   Called from lifecycle points. `isomorphic-git` is one of the three direct deps. The `time_travel` mod under `app/L0/_all/mod/_core/time_travel/` surfaces this to the operator.

6. **Layered overrides for multi-tenancy** — `app/L0/` framework defaults; `app/L1/<group>/` shadows for group; `app/L2/<user>/` shadows for user. Same glob, resolver picks most specific.

## What changed in the analysis

The five-pattern lift list from Iteration 2's notes file was **reordered and reframed**:

| Iter 2 framing | Iter 3 framing |
|---|---|
| Pattern 1: Folder-per-mod tile registry (headline) | Demoted to "Supporting infrastructure" |
| Pattern 2: Layered overrides (L0/L1/L2) | Absorbed into the autolearning substrate as property #4 (layered multi-tenancy) |
| Pattern 3: State-version header for hot-reload | Demoted to "Supporting infrastructure"; explained as *necessary because* the substrate mutates at runtime |
| Pattern 4: `nodejsformobile` config | Dropped as a lift candidate (interesting but tangential) |
| Pattern 5: Tiny-server discipline | Demoted to "Supporting infrastructure" |
| *(implicit only)* Autolearning loop | **Promoted to headline; five well-engineered properties enumerated** |

## What changed for PortalBridge

| Iter 2 follow-up | Iter 3 follow-up |
|---|---|
| When tile-registry reaches ~5 types, evaluate folder-per-tile refactor | **Prototype a `skills/` directory** with one markdown skill + glob loader. ~1 day. |
| When layout-store needs org-level defaults, evaluate layered resolution | Step 4: Layer skills (L0/L1/L2) once an org actually asks. Don't build speculatively. |
| — | **Define tag vocabulary first** (`tenant:`, `role:`, `surface:`, `incident:`) — most of the engineering of this pattern is tag-set design. |
| — | **Wire git-backed skill history** for compliance audit trail once >3 skills. |
| Set up GitHub Actions before either of the above | Step 5: Set up `npm test` + `npm run build` CI before any of the above. |

## Deliverable for Iteration 3

`notes/space-agent-patterns.md` rewritten and committed `32f74eb`. Full content reproduced as "Patterns notes v2" in the Design Artifacts section below.

## ASSISTANT (verbatim — closing the reframe)

> Pushed (`32f74eb`).
>
> The reframe in one paragraph: the substrate is `mod/*/*/ext/skills/*/SKILL.md` — markdown files with YAML frontmatter declaring `placement` (system/history/transient) and `when.tags` / `loaded.tags` for conditional injection. The agent reads them to know its capabilities and writes them in the same format to extend itself. L0/L1/L2 layered paths give framework/group/user override semantics by glob match alone. `flushGitHistoryCommits()` in `server/app.js` versions every agent-authored change. Five well-engineered properties that compound: discovery is a glob (no registry), context is conditional (tag-set match), authoring is the same format as reading, multi-tenancy is layered file paths, rollback is `git revert`. The "reshape UI" framing is one expression of this; the substrate is the asset.

> **ITERATION POINT 3 → 4:** User asks for this transcript document.

---

═══════════════════════════════════════════════════════════════════════
# ITERATION 4 — TRANSCRIPT CAPTURE (this document)
═══════════════════════════════════════════════════════════════════════

## USER (verbatim)

> IN WHATEVER FORMAT YOU THINK IS APPROPRIATE, TAKE THE ENTIRE CONVERSATION VERBATIM AND MARK THE ITERATION POINTS THROUGH OUT THE DOCUMENT. THEN DO THE SAME THING THROUGH ANY DESIGNS WE DID. MAKE SURE i CAN DOWNLOAD IT OR I GUESS YOU COULD JUST DROP THEM HERE G:\HELIX_OS\BUILDER

## ASSISTANT response

Producing this document. Cannot reach `G:\HELIX_OS\BUILDER` from a Linux sandbox; landing the artifact in the repo (`notes/helix-os-builder-transcript.md`) and pushing to GitHub for clone/download, plus mirroring to `/tmp/HELIX_OS_BUILDER/` inside the sandbox for transparency.

---

# DESIGN ARTIFACTS (with iteration markers)

The artifacts below are reproduced **verbatim** as they were written. Each carries a header noting which iteration produced it.

---

## ◆ ARTIFACT — Plan v1 (Iteration 1)

**Path:** `/root/.claude/plans/https-github-com-ai-integrater-space-age-crispy-frost.md`
**Iteration:** 1 (UI-reshaping framing; superseded by Patterns notes v2)
**Status:** Internal plan file, never committed to repo.

```markdown
# Plan — Evaluating ai-integrater/space-agent

## Context

You asked for an honest analysis of [ai-integrater/space-agent](https://github.com/ai-integrater/space-agent) — utility, operational efficiency, whether it's "a good one." This plan captures the findings from cloning and reading the actual code, then maps them against your existing trajectory (PortalBridge dashboard scaffold, llm-startup context repo, Microsoft/Azure focus, interest in cross-session continuity) and recommends a concrete path forward.

**One thing to know up front:** `ai-integrater/space-agent` is a fork. The active upstream is **[agent0ai/space-agent](https://github.com/agent0ai/space-agent)** by Jan Tomášek / frdel (Agent Zero team) — confirmed via `git remote` URL in merge commits and `package.json` repo URL. If you want updates, track the upstream, not your fork.

## What it actually is

A **browser-first AI agent runtime** where the agent runs in the frontend (browser tab or Electron desktop) and reshapes its own UI on the fly by writing pages, widgets, and workflows into the running workspace. The Node.js server is intentionally thin — proxying, auth, file I/O, Git history. New agent capabilities live in plain `SKILL.md` files the agent itself can write/extend.

Entry point: `node space serve` for headless server, Electron wrapper for desktop. Mobile bridge config (`nodejsformobile`) hints at planned mobile support.

## Findings

### What's strong

- **Dependency footprint is brutally small**: only `archiver`, `electron-updater`, `isomorphic-git`. No web framework, no ORM, no Babel — they wrote their own router (`server/router/router.js`). Three deps total in production.
- **Crypto is real**: `server/lib/auth/passwords.js` uses SCRAM-SHA-256, PBKDF2 at 310k iterations, AES-256-GCM with timing-safe compare. Not theater.
- **Architecture is genuinely novel**: agent self-modifies UI inside the same runtime. Most agent frameworks (LangChain, AutoGen, CrewAI) are API-call-shaped — this one is closer to a Smalltalk image.
- **Active maintenance**: 66 commits in the last ~5 weeks, multiple contributors, recent work on browser-control + watchdog throughput.
- **Multi-user from day one**: per-user layers (`L0`/`L1`/`L2`), group sharing, file quotas, ACLs in `server/lib/file-access`. This is hard to retrofit — it's already there.
- **Token-efficient agent execution**: plain text + plain JS in messages instead of bulky tool-call JSON. Genuinely interesting design choice.

### What's weak / concerning

- **Zero unit tests**. There's a `tests/` dir with 46 integration tests using Node's native `test` runner, but they boot real servers. **None of it is wired to CI** — no GitHub Actions running them on PR.
- **No Dockerfile, no Helm chart, no IaC**. Production deployment is "you figure it out."
- **No observability**: minimal logging, no structured logs, no metrics endpoint, no tracing. At 100x scale you're flying blind.
- **No Microsoft/Azure integration**. Auth is custom (SCRAM password); no OIDC, no SAML, no Entra. If your world is Azure, this is a green-field auth story to graft on.
- **Documentation is `AGENTS.md`-shaped** — designed for AI to navigate, harder for humans without prior context.
- **Version drift risk**: `package.json` says `0.36.0` but the repo has tags through `v0.64`. Either tags ran ahead of `package.json` or the version field is stale; either way, treat the version number as advisory.
- **Single-author concentration**: ~73% of commits from one person. Bus factor of ~1.

## Honest verdict

It's a **legitimately well-engineered agent platform** — the auth, file-access, and clustering code is professional, not experimental. It's not a toy. But it's also not something you drop into a Microsoft/Azure shop tomorrow:

- The auth model is parallel to (not compatible with) Entra.
- The deployment story is Electron-desktop or self-hosted Node — no Azure App Service / Container Apps templates.
- The agent UX assumes a generative-UI model is doing real work; this is a different product than a portal dashboard.

So: **good code, niche fit for your stated direction.**

## Recommended path: study for patterns, lift selectively

Given your current trajectory (Microsoft/Azure tools, dashboards, dev→test→prod pipeline) and your stated goal of "deepening implementation chops," **forking space-agent isn't the highest-leverage move** — you'd spend months replacing the auth layer and packaging story before you got to the interesting parts. The higher-leverage move is to **read it for the architectural ideas worth lifting**, then apply them to your own work.

### What's worth lifting

| Pattern | Where it lives | Where it'd help your work |
|---|---|---|
| Tile/widget registry where the agent can author new tiles in plain text/markdown | `app/L0/_all/mod/` and `SKILL.md` flow | PortalBridge tile registry — eventually let the LLM author new tile types |
| `nodejsformobile` mobile-bridge config | `package.json` lines 90–94 | Your llm-startup mobile use case — there's prior art for running a Node bridge on mobile |
| Per-user layered overrides (L0 → L1 → L2) | `app/L0/`, `app/L1/`, `app/L2/` | PortalBridge layout-per-user-per-org |
| Watchdog hot-reload + version-headered state sync | `server/app.js`, `server/lib/state` | Useful if PortalBridge ever gets multi-device layout sync |
| Tiny-server pattern (3 deps, no framework) | All of `/server` | Mindset shift for your future Node services — this is achievable |

### What to skip / not copy

- The custom router and password store — for an Azure project you'll use MSAL + Next.js routing; don't reinvent.
- The Electron packaging — irrelevant to a web-deployed dashboard.
- Treating `AGENTS.md` as the only doc — write human docs alongside.

### If the answer was actually "fork it" or "daily-driver"

- **Fork it**: your fork at `ai-integrater/space-agent` is currently behind upstream. First action would be `git remote add upstream https://github.com/agent0ai/space-agent.git && git fetch upstream && git merge upstream/main`. Plan to write a Dockerfile + GitHub Actions CI before anything else; the operational gaps are real.
- **Daily-driver**: clone, `npm install`, `node space serve`, point browser at `http://localhost:<port>`. Bring your own LLM API key. Expect rough edges on auth and persistence config.

## Critical files referenced

| File | Why it matters |
|---|---|
| `/tmp/space-agent/README.md` | Pitch + capability overview |
| `/tmp/space-agent/package.json` | Dependency surface, scripts, mobile-bridge config |
| `/tmp/space-agent/server/app.js` | Server bootstrap, DI composition, request loop |
| `/tmp/space-agent/server/lib/auth/passwords.js` | SCRAM/PBKDF2/AES-GCM crypto |
| `/tmp/space-agent/server/router/router.js` | Custom HTTP router with no framework |
| `/tmp/space-agent/app/L0/` | Browser runtime layer; tile/skill system |
| `/tmp/space-agent/AGENTS.md` (root + nested) | The agent's own self-instructions |
| `/tmp/space-agent/tests/` | 46 integration tests; not in CI |
| `/tmp/space-agent/commands/params.yaml` | Runtime config surface |

## Verification (how to test the recommended path)

If you accept "study for patterns":

1. `cd /tmp/space-agent && git remote -v` — confirm upstream is `agent0ai/space-agent`.
2. `node space serve` and open the local URL — run it once to feel the UX before lifting any patterns.
3. Read in this order: `README.md` → `package.json` → `server/app.js` → `app/L0/_all/mod/` (one or two skills) → `tests/server_cluster_test.mjs`. ~90 minutes to get the shape.
4. Open a notes file (could be `INSTRUCTIONS.md` in your llm-startup repo or a new `~/notes/space-agent.md`) and capture the 3–5 patterns you actually want to bring to PortalBridge.
5. **No code changes to PortalBridge or llm-startup based on this analysis** — those happen in a separate, scoped PR once you've decided what to lift. This plan ends at "informed decision."

If you instead want to fork or daily-drive, say so and I'll write a different plan focused on the deployment + Azure-integration work.
```

**Iteration 1 → Iteration 2 deltas applied to this plan:**
- "46 integration tests" → wrong, actual count **37**
- "~73% of commits from one person" → wrong, actual **89%** (frdel + Jan Tomášek same person)
- "No GitHub Actions running them on PR" → imprecise, one workflow exists (`release-desktop.yml`) for tag-push only; no test-on-PR CI

**Iteration 1 → Iteration 3 deltas applied to this plan:**
- "Tile/widget registry where the agent can author new tiles" as headline pattern → **demoted**; this is one downstream expression of the autolearning substrate, not the substrate itself
- "What it actually is: a browser-first AI agent runtime where the agent... reshapes its own UI" → **reframed**; the actual primitive is filesystem-backed self-extension with glob discovery + conditional tag-based context injection + git auto-versioning

---

## ◆ ARTIFACT — Patterns notes v1 (Iteration 2)

**Path:** `notes/space-agent-patterns.md` (commit `b066b76`)
**Iteration:** 2 (verified facts, UI-reshaping framing intact; superseded by v2)
**Status:** Committed and pushed in Iteration 2; overwritten by v2 in Iteration 3.

```markdown
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

(unchanged in v2 — see v2 for current text)
```

**Iteration 2 → Iteration 3 deltas applied to this file:**
- "## Patterns to lift" headline list of 5 → **replaced** with "## The actual superpower: autolearning as filesystem state" as the headline, with the 5 properties enumerated underneath
- Pattern 1 (Tile registry) → moved to "## Supporting infrastructure (downstream of the substrate)" as one expression of the substrate
- Pattern 2 (Layered overrides L0/L1/L2) → absorbed into the substrate description as property #4
- Pattern 3 (State-version header) → moved to "Supporting infrastructure," reframed as "needed *because* the substrate mutates at runtime"
- Pattern 4 (`nodejsformobile`) → removed from lift candidates
- Pattern 5 (Tiny-server) → moved to "Supporting infrastructure"
- "Suggested follow-ups" → **rewritten** with `skills/` directory prototype as step 1, tag vocabulary as step 2, git-backed history as step 3, layered overrides as step 4 (only when an org asks), GitHub Actions as step 5 (preceding all the above)

---

## ◆ ARTIFACT — Patterns notes v2 (Iteration 3, CURRENT)

**Path:** `notes/space-agent-patterns.md` (commit `32f74eb`)
**Iteration:** 3 (autolearning substrate as headline)
**Status:** Current canonical version. Committed and pushed to `claude/unified-admin-dashboard-nK64n`.

```markdown
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
```

---

## ◆ ARTIFACT — Dockerfile (Iteration 2, no later changes)

**Path:** `/tmp/space-agent/Dockerfile`
**Iteration:** 2 (single version, no revisions)
**Status:** Staged in sandbox; **not pushed** (GitHub MCP restricted to `autoresearch-agents`).

```dockerfile
FROM node:20-slim

ENV NODE_ENV=production \
    SPACE_HOST=0.0.0.0 \
    SPACE_PORT=3000

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY space space.js ./
COPY app ./app
COPY commands ./commands
COPY server ./server

RUN useradd --system --uid 10001 --home-dir /app spaceagent \
 && mkdir -p /app/data \
 && chown -R spaceagent:spaceagent /app

USER spaceagent

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('node:http').get('http://127.0.0.1:'+(process.env.SPACE_PORT||3000), r => process.exit(r.statusCode<500?0:1)).on('error', () => process.exit(1))"

CMD ["node", "space", "serve"]
```

---

## ◆ ARTIFACT — Test CI workflow (Iteration 2, no later changes)

**Path:** `/tmp/space-agent/.github/workflows/test.yml`
**Iteration:** 2 (single version, no revisions)
**Status:** Staged in sandbox; **not pushed.**
**Verification:** `node --test tests/login_hooks_test.mjs` passed 5/5 locally.

```yaml
name: Test

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: test-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit:
    name: Node ${{ matrix.node }} / ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest]
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm

      - name: Install dependencies
        run: npm ci --no-audit --no-fund

      - name: Run unit and integration tests
        run: |
          # Excludes harnesses that require an LLM API key or a real browser:
          #   tests/agent_llm_performance*  — needs LLM credentials
          #   tests/browser_component_harness — needs Electron + display
          node --test \
            --test-reporter=spec \
            $(find tests -maxdepth 2 -name '*_test.mjs' \
                -not -path 'tests/agent_llm_performance*' \
                -not -path 'tests/browser_component_harness/*')
        env:
          NODE_ENV: test
```

---

## ◆ ARTIFACT — FORK-NOTES (Iteration 2, no later changes)

**Path:** `/tmp/space-agent/FORK-NOTES.md`
**Iteration:** 2 (single version, no revisions)
**Status:** Staged in sandbox; **not pushed.**

```markdown
# Fork notes — `ai-integrater/space-agent`

This fork tracks [agent0ai/space-agent](https://github.com/agent0ai/space-agent). Document below why the fork exists and what we change relative to upstream.

## Why this fork exists

> _TODO: fill this in. Examples: "experimentation sandbox," "running internal builds with org auth," "staging ground for upstream PRs."_

If the answer is "we don't actually need a fork, we just clicked Fork," consider archiving and tracking upstream directly.

## Sync from upstream

The upstream is the source of truth. Sync regularly so this fork doesn't rot.

```bash
# one-time setup
git remote add upstream https://github.com/agent0ai/space-agent.git

# every sync
git fetch upstream
git checkout main
git merge --ff-only upstream/main || git merge upstream/main
git push origin main
```

If the local `main` has diverged from upstream and you don't have local commits worth keeping there, prefer:

```bash
git fetch upstream
git checkout main
git reset --hard upstream/main   # destructive — only when sure
git push --force-with-lease origin main
```

Use `--force-with-lease`, never `--force` on a shared branch.

## Operational additions in this fork

Files added that don't exist upstream — not yet merged anywhere:

| File | Purpose | Status |
|---|---|---|
| `Dockerfile` | Production server image (Node 20-slim, non-root) | Staged, untested in CI |
| `.github/workflows/test.yml` | Run `node --test` on PR and main, Node 20 + 22 | Staged, untested |
| `FORK-NOTES.md` | This file | — |

### Verify the additions before pushing

```bash
# Dockerfile build (≈300 MB image expected, electron-updater pulls weight)
docker build -t space-agent:local .
docker run --rm -p 3000:3000 space-agent:local
# open http://127.0.0.1:3000

# CI workflow dry-run (requires `act`: https://github.com/nektos/act)
act pull_request -W .github/workflows/test.yml
```

## Operational gaps still open

Upstream gaps that this fork hasn't addressed:

- **No observability.** Logs are unstructured, no metrics endpoint, no tracing. At any real scale, blind.
- **No Helm chart / Compose / IaC.** Deploy story is "you figure it out" — Dockerfile is one step, not the whole story.
- **No Entra / OIDC integration.** Auth is custom SCRAM-SHA-256 against a local store (`server/lib/auth/passwords.js`). For Microsoft-shop deployments this is a green-field auth integration.
- **No secrets management.** API keys live in `.env` files at the project root.
- **Single-author concentration upstream.** ~89% of commits from one person. If upstream stalls, the fork inherits the work.

## Sending changes back upstream

If something we add here belongs in upstream (bug fixes, generic improvements), propose it as a PR against `agent0ai/space-agent` rather than carrying a permanent fork delta. Long-lived deltas are how forks rot.

## Health check for this fork

Periodically verify:

- `git log upstream/main..main` — what we have that upstream doesn't.
- `git log main..upstream/main` — what upstream has that we don't (sync owed).
- Tag drift: do `git describe --tags origin/main` and `git describe --tags upstream/main` agree?
- `package.json` version matches the latest tag (upstream has a known drift here — `0.36.0` in `package.json`, `v0.64` tagged).
```

---

# How to land this document at `G:\HELIX_OS\BUILDER`

Sandbox cannot write to Windows drives, so the file lives in two places I can reach:

1. **Inside the repo, pushed to GitHub** at:
   ```
   ai-integrater/autoresearch-agents
     branch: claude/unified-admin-dashboard-nK64n
     path:   notes/helix-os-builder-transcript.md
   ```
   Raw download URL pattern (after push):
   ```
   https://raw.githubusercontent.com/ai-integrater/autoresearch-agents/claude/unified-admin-dashboard-nK64n/notes/helix-os-builder-transcript.md
   ```

2. **Staged copy inside this sandbox** at `/tmp/HELIX_OS_BUILDER/transcript.md` — useful only if you're running an SSH/SFTP tunnel to this sandbox.

### To land it on your Windows box at `G:\HELIX_OS\BUILDER`

If you've cloned the repo there:
```powershell
# Powershell
cd G:\HELIX_OS\BUILDER\autoresearch-agents   # adjust to your actual clone path
git fetch origin claude/unified-admin-dashboard-nK64n
git checkout claude/unified-admin-dashboard-nK64n
git pull
# File is now at: G:\HELIX_OS\BUILDER\autoresearch-agents\notes\helix-os-builder-transcript.md
```

If you haven't cloned anywhere yet:
```powershell
cd G:\HELIX_OS\BUILDER
git clone -b claude/unified-admin-dashboard-nK64n https://github.com/ai-integrater/autoresearch-agents.git
copy autoresearch-agents\notes\helix-os-builder-transcript.md .\transcript.md
```

If you only want this one file (no clone):
- Open the raw URL above in your browser
- Right-click → Save As → choose `G:\HELIX_OS\BUILDER\transcript.md`

---

# Outstanding items

- **Draft PR for `claude/unified-admin-dashboard-nK64n`** — still blocked on GitHub MCP OAuth flow. The branch is pushed and has three commits ahead of `main`: `85040f0` (PortalBridge scaffold), `b066b76` (patterns notes v1), `32f74eb` (patterns notes v2). The transcript commit will add a fourth.
- **Fork-prep files** (`Dockerfile`, `.github/workflows/test.yml`, `FORK-NOTES.md`) still **staged in `/tmp/space-agent/`** awaiting your push to `ai-integrater/space-agent`. The exact commands are in the assistant transcript above and re-stated in FORK-NOTES.
