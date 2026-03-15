## Target Stack Scaffold SOP (Skill-first, Gate-aware)

### Objective
Scaffold the target stack with strict prerequisites, explicit human checkpoints, and fail-fast verification that avoids wasted runs under `approval=never`.

### Non-Negotiables
- Do not continue past unresolved blockers.
- Do not skip database provisioning unless `DATABASE_URL` is already valid.
- For missing Clerk keys/secrets, do not add auth passthrough fallback logic (for example, no custom `passthroughProxy` branch).
- Do not replace Clerk auth controls with custom placeholders.
- Use bounded retries only; never loop indefinitely.

## Phase 0: Readiness and Tooling
1. Verify trust:
   - Check `~/.codex/config.toml` for `[projects."<absolute-project-path>"]` and `trust_level = "trusted"`.
   - If missing, stop and provide:
     - `bash scripts/codex-trust.sh --project-path "<absolute-project-path>"`
   - Require Codex restart after trust is set.
2. Verify browser/tooling sanity:
   - Run `bunx playwright --version`.
   - Call `mcp__chrome-devtools__list_pages`.
3. Handle Chrome MCP profile lock:
   - Treat lock as runtime contention, not scaffold failure.
   - Re-run Chrome MCP in isolated mode (`--isolated`) or with a unique `userDataDir`.
   - Retry `mcp__chrome-devtools__list_pages` with a fixed cap (max 3, short backoff).
   - If still failing, mark `BLOCKED` with the exact lock error and stop.
4. Install skills:
   - `bunx skills experimental_install -y`

## Phase 1: Scaffold Generation (Human Checkpoint A)
1. Open `https://ui.shadcn.com/create`.
2. Complete style check.
3. Instruct user to click `Create Project` and paste the generated init command.
4. Validate the pasted command before execution.
5. Ask for project name, append `--name <name> --yes`, then execute via the `shadcn` skill.

## Phase 2: Data Foundation (Required)
1. Ensure `DATABASE_URL` before ORM/auth:
   - If valid `DATABASE_URL` exists, continue.
   - Otherwise provision and claim immediately:
     - Preferred: `claimable-postgres` skill.
     - Fallback: `bunx neon-new -y`.
2. Do not continue to ORM/auth until `DATABASE_URL` is present.

## Phase 3: Integrations
1. ORM (choose one):
   - `prisma-database-setup`, or
   - `neon-drizzle`.
2. Auth (choose one):
   - `create-auth-skill`, or
   - `docs/clerk-setup-llm.txt` for Clerk.
3. Clerk SOP (required when Clerk path is selected):
   - Wire Clerk normally: `clerkMiddleware()` + `ClerkProvider`.
   - Render Clerk controls from Clerk components: `SignInButton`, `SignUpButton`, `UserButton`.
   - Keep Clerk active in keyless mode; first auth interaction should drive Clerk setup.
   - Run bootstrap auth check: click `SignUpButton`; confirm redirect to Clerk-hosted/setup flow.
   - Add Human Checkpoint B: user claims Clerk project and sets real keys in `.env.local`.
4. Media (choose one):
   - `setup-uploadthing-nextjs-app-router`, or
   - `https://next.cloudinary.dev/installation`.
5. Monitoring:
   - `sentry-nextjs-sdk`.

## Verification Flow (Fail-fast, approval=`never`)
1. Keep command contract scripts in app package:
   - `verify:preflight`
   - `verify:static`
   - `verify:e2e`
   - `verify:integration`
   - `verify:all`
2. Run `bun run verify:preflight` before `verify:e2e`, `verify:integration`, and `verify:all`.
3. If required integration env vars are missing:
   - Mark `BLOCKED (HUMAN_CHECKPOINT_REQUIRED)` with exact missing variable names.
   - Persist blocker state to `.tmp/verification-state.json`.
   - Stop immediately; do not run downstream gates.
4. Keyless Clerk behavior:
   - In scope: bootstrap redirect behavior only (`SignInButton`/`SignUpButton` -> Clerk-hosted/setup flow).
   - Out of scope until Human Checkpoint B: full Gate 3 auth contract (real sign-in + protected-route access).
5. After Human Checkpoint B (keys present), rerun preflight, then run `bun run verify:all`.

## Secret Contract (By Branch)
- Baseline:
  - `DATABASE_URL`
- Auth branch:
  - Better Auth:
    - `BETTER_AUTH_SECRET`
    - `BETTER_AUTH_URL`
    - `NEXT_PUBLIC_BETTER_AUTH_URL`
  - Clerk:
    - `CLERK_SECRET_KEY`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - Bootstrap acceptance: `SignInButton`/`SignUpButton` redirect to Clerk-hosted/setup flow.
    - Without real keys, protected pages are validated for redirect behavior only.
    - Full Gate 3 auth checks require real keys; if missing, mark `BLOCKED` with exact missing vars.
- Media branch:
  - UploadThing:
    - `UPLOADTHING_TOKEN` (or token contract required by selected skill version)
  - Cloudinary:
    - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
- Sentry branch:
  - Required:
    - `SENTRY_DSN`
  - Optional release/source-map:
    - `SENTRY_AUTH_TOKEN`
    - `SENTRY_ORG`
    - `SENTRY_PROJECT`
- Storage:
  - Commit examples only in `.env.example`.
  - Keep real secrets in local `.env.local` only.

## Chrome MCP Note
- Isolated mode = separate browser profile (separate user-data directory).
- Use isolated mode when default profile is already in use.
- Retry `mcp__chrome-devtools__list_pages` with a fixed cap only (for example, 3 attempts).
- If lock persists, mark `BLOCKED` and stop.

## Scaffold Anatomy
```text
Scaffold Start
├─ Phase 0: Readiness
│  ├─ Trust check (or stop + run codex-trust + restart)
│  ├─ Playwright sanity
│  └─ Chrome MCP sanity (isolated + capped retry, else BLOCKED)
│
├─ Phase 1: Scaffold Generation (Human Checkpoint A)
│  ├─ Open shadcn Create
│  ├─ User pastes init command
│  └─ Validate + execute with --name and --yes
│
├─ Phase 2: Data Foundation (Required)
│  ├─ Ensure DATABASE_URL
│  └─ If missing: claimable-postgres (preferred) or bunx neon-new -y
│
├─ Verification Checkpoint 1 (baseline only)
│  └─ Confirm DATABASE_URL exists before ORM/auth
│
├─ Phase 3: Integrations
│  ├─ ORM
│  ├─ Auth (Clerk keyless bootstrap check)
│  ├─ Human Checkpoint B (claim Clerk + set real keys)
│  ├─ Media
│  └─ Monitoring
│
├─ Verification Checkpoint 2 (full)
│  ├─ bun run verify:preflight
│  ├─ If missing env: BLOCKED (HUMAN_CHECKPOINT_REQUIRED), persist .tmp state, stop
│  └─ If pass: bun run verify:all
│
└─ Done
```
