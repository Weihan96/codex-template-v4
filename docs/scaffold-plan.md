## Target Stack Install Anatomy (Official-first Path)

### Summary
Your repo already has `Bun + Next.js + shadcn/ui` initialized, so the next step is **integration layering**: data, auth, caching/fetching, file/media, and monitoring.  
Given `docs/stack.md`, the most reliable path is to prefer stacks with official installable skills where available, and use docs-first installs where not.

### Install Tree (Anatomy)
```text
Project Bootstrap
├─ Runtime + App Shell (already done)
│  ├─ Bun
│  └─ Next.js + TypeScript + shadcn/ui
│
├─ AI/Skill Layer (optional but recommended early)
│  ├─ shadcn skill         -> bunx skills add shadcn/ui
│  ├─ prisma skill         -> bunx skills add prisma/skills
│  ├─ neon skill           -> bunx skills add neondatabase/agent-skills
│  ├─ auth skill (pick one)-> bunx skills add clerk/skills
│  │                         or bunx skills add better-auth/skills
│  └─ sentry AI skill      -> bunx @sentry/dotagents add getsentry/sentry-agent-skills --name sentry-setup-ai-monitoring
│
├─ Data Layer (pick one ORM branch)
│  ├─ Prisma branch (recommended for official skill support)
│  │  ├─ bun add prisma @prisma/client
│  │  ├─ bunx prisma init
│  │  ├─ configure DATABASE_URL (Neon/Supabase)
│  │  ├─ bunx prisma migrate dev
│  │  └─ bunx prisma generate
│  └─ Drizzle branch (docs-first)
│     ├─ bun add drizzle-orm pg
│     ├─ bun add -D drizzle-kit @types/pg
│     └─ create drizzle config + migrations
│
├─ Database Host (pick one)
│  ├─ Neon (recommended in this stack doc)
│  │  └─ create DB + set DATABASE_URL
│  └─ Supabase
│     └─ create project + set DATABASE_URL / keys
│
├─ Server State + Mutations
│  ├─ bun add @tanstack/react-query
│  └─ pair with Next.js Server Actions for writes
│
├─ Auth (pick one, do not run both)
│  ├─ Clerk       -> bun add @clerk/nextjs
│  └─ Better Auth -> bun add better-auth && bunx @better-auth/cli generate
│
├─ File/Media (optional feature branch)
│  ├─ UploadThing     -> bun add uploadthing @uploadthing/react
│  └─ Next Cloudinary -> bun add next-cloudinary
│
└─ Observability
   └─ bunx @sentry/wizard@latest -i nextjs
```

### Key Interface/Additions
- Add environment contracts:
  - `DATABASE_URL`
  - Auth keys (`CLERK_*` or Better Auth secrets)
  - Storage keys (UploadThing/Cloudinary)
  - `SENTRY_AUTH_TOKEN` (if uploading source maps)
- Add app infrastructure surfaces:
  - DB client singleton (`lib/db`)
  - Query client provider (React Query)
  - Auth middleware/provider (one provider only)
  - Error/trace monitoring bootstrap (Sentry)

### Test Plan
1. Install validation:
   - `bun install`
   - `bun run typecheck`
   - `bun run lint`
2. Runtime validation:
   - `bun run dev`
   - Confirm `/dashboard` loads without 500s.
3. Data path validation:
   - Run one read + one write through Server Action + Query invalidation.
4. Auth validation:
   - Sign-in flow works for selected provider.
5. Monitoring validation:
   - Trigger a controlled error and verify it arrives in Sentry.

### Assumptions (Defaults Chosen)
- Use **Prisma + Neon + Better Auth + TanStack Query + Sentry** as the default “official-skill-first” track.
- Treat **Clerk** as an alternative auth branch (not combined with Better Auth).
- Keep **Drizzle**, **UploadThing**, and **Cloudinary** as optional branches unless product requirements demand them immediately.
- Because Next+shadcn is already present, do not re-run scaffold/init; continue from integration stage.
