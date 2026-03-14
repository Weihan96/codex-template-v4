## Target Stack Scaffold Workflow (Skill-first Path)

### Summary
This plan runs a strict, skill-first scaffold workflow with one required user checkpoint in shadcn Create UI.

### Workflow (Execution Order)
0. Check trust and tooling readiness first:
   - Check project trust state in `~/.codex/config.toml` for `[projects."<absolute-project-path>"]` with `trust_level = "trusted"`.
   - If trust is missing, stop the scaffold plan.
   - Provide this command for the user to run, then tell them to restart Codex:
     - `bash scripts/codex-trust.sh --project-path "<absolute-project-path>"`
   - Run Playwright sanity check:
     - `bunx playwright --version`
   - Run Chrome MCP sanity check:
     - Call `mcp__chrome-devtools__list_pages` and confirm it returns without error.
1. Install all available skills:
   - `bunx skills experimental_install -y`
2. Open browser to shadcn Create:
   - `https://ui.shadcn.com/create`
   - Complete style check.
   - Instruct user to click `Create Project` and paste the generated init command (example: `bunx --bun shadcn@latest init --preset a1EVC2i3 --base base --template next`).
3. Validate the pasted init command from step 2 before execution.
4. Ask the user for the project name, then create the project from the pasted command:
   - Add `--name <name>` to set the new project name.
   - Add `--yes` to skip interactive confirmation.
   - Execute via skill `shadcn`.
5. Provision Postgres and set `DATABASE_URL` (choose one):
   - Use skill `claimable-postgres` (fastest unblock path), or
   - run `bunx neon-new -y` directly (Neon path).
6. Set up ORM based on user choice:
   - skill `prisma-database-setup`, or
   - skill `neon-drizzle`.
7. Set up auth based on user choice:
   - skill `create-auth-skill`, or
   - follow `docs/clerk-setup-llm.txt` for Clerk Next.js App Router setup.
8. Set up media based on user choice:
   - skill `setup-uploadthing-nextjs-app-router`, or
   - docs path `https://next.cloudinary.dev/installation`.
9. Use skill `sentry-nextjs-sdk` to set up Sentry monitoring.

### Secret Contract (By Branch)
- Required baseline:
  - `DATABASE_URL` (from step 5).
- Auth branch:
  - Better Auth path:
    - `BETTER_AUTH_SECRET`
    - `BETTER_AUTH_URL`
    - `NEXT_PUBLIC_BETTER_AUTH_URL`
  - Clerk path:
    - `CLERK_SECRET_KEY`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Media branch:
  - UploadThing path:
    - `UPLOADTHING_TOKEN` (or provider-issued UploadThing server token contract used by the selected skill version).
  - Cloudinary path:
    - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
- Sentry branch:
  - Required ingestion:
    - `SENTRY_DSN`
  - Optional release/source-map workflow:
    - `SENTRY_AUTH_TOKEN`
    - `SENTRY_ORG`
    - `SENTRY_PROJECT`
- Storage recommendation:
  - Keep committed examples in `.env.example`.
  - Keep real values in local `.env.local` (never commit secrets).

### Scaffold Anatomy Graph
```text
Scaffold Start
├─ 0) Trust + Tooling Readiness
│  ├─ Check trust state in ~/.codex/config.toml
│  ├─ If untrusted: stop and provide
│  │  └─ bash scripts/codex-trust.sh --project-path "<absolute-project-path>"
│  │     └─ Restart Codex (required checkpoint)
│  ├─ Playwright sanity: bunx playwright --version
│  └─ Chrome MCP sanity: mcp__chrome-devtools__list_pages
│
├─ 1) Skill Bootstrap
│  └─ bunx skills experimental_install -y
│
├─ 2) UI Preset Selection (human-in-the-loop)
│  └─ Open https://ui.shadcn.com/create
│     └─ User clicks "Create Project" and pastes init command
│
├─ 3) Command Validation
│  └─ Validate pasted init command
│
├─ 4) Project Creation
│  └─ Ask project name, append --name <name> --yes
│     └─ Use skill: shadcn (execute command)
│
├─ 5) Database Provisioning
│  └─ Set DATABASE_URL (choose one)
│     ├─ claimable-postgres
│     └─ bunx neon-new -y
│
├─ 6) ORM Setup (choose one)
│  ├─ prisma-database-setup
│  └─ neon-drizzle
│
├─ 7) Auth Setup (choose one)
│  ├─ create-auth-skill
│  └─ docs/clerk-setup-llm.txt
│
├─ 8) Media Setup (choose one)
│  ├─ uploadthing-nextjs
│  └─ next.cloudinary.dev/installation
│
└─ 9) Monitoring Setup
   └─ sentry-nextjs-sdk
```
