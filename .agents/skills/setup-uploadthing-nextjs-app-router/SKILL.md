---
name: setup-uploadthing-nextjs-app-router
description: Set up UploadThing in Next.js App Router projects with type-safe file routes, route handlers, typed React upload components, Tailwind integration, optional SSR hydration, and auth-aware middleware. Use when adding file uploads, fixing UploadThing setup issues, or migrating to the current App Router UploadThing pattern.
---

# Setup UploadThing in Next.js App Router

Implement this skill to add or repair UploadThing in a Next.js `app/` project end-to-end.

## Execute Workflow

1. Install dependencies with the project package manager.
Use `bun` in this repository:

```bash
bun add uploadthing @uploadthing/react
```

2. Configure environment variables.
Add this to `.env`:

```env
UPLOADTHING_TOKEN=... # Token from UploadThing dashboard
```

3. Create the UploadThing file router.
Create `app/api/uploadthing/core.ts` with auth middleware and `onUploadComplete`.
Use the template in [references/templates.md](references/templates.md).

4. Expose the Next.js route handlers.
Create `app/api/uploadthing/route.ts`.
Use the template in [references/templates.md](references/templates.md).

5. Generate typed client upload components.
Create `src/utils/uploadthing.ts` (or your existing shared client utility location).
Use the template in [references/templates.md](references/templates.md).

6. Wire UploadThing styles.
If Tailwind is used, integrate UploadThing's helper in Tailwind config.
See the Tailwind section in [references/templates.md](references/templates.md).

7. Mount a client uploader component.
Render an `UploadButton` or `UploadDropzone` in a file with `"use client";`.
Use the template in [references/templates.md](references/templates.md).

8. Add SSR hydration plugin when initial loading state should be removed.
Render `NextSSRPlugin` in `app/layout.tsx`.
If Next.js 15 `ppr` or `dynamicIO` is enabled, wrap it in `Suspense` and call `await connection()`.
Use the template in [references/templates.md](references/templates.md).

9. Verify behavior.
Run the app, upload a test file, and confirm all checkpoints:
- Upload succeeds from client UI.
- Server middleware enforces auth and returns metadata.
- `onUploadComplete` executes and receives file info.
- Returned metadata reaches `onClientUploadComplete`.

## Apply Guardrails

- Keep route slug strings stable.
Client `endpoint` values must match keys in your file router.

- Enforce auth in middleware.
Reject unauthenticated requests with `UploadThingError("Unauthorized")`.

- Avoid trusting client input for identity.
Read user identity from server-side auth only.

- Persist UploadThing file metadata immediately after upload.
Store `file.key`, `file.ufsUrl`, and relevant ownership fields.

- Return only minimal public metadata to the client callback.
Avoid leaking internal server-only fields.

## Run Troubleshooting Checks

- Check `UPLOADTHING_TOKEN` exists at runtime if uploads fail before request handling.
- Check `app/api/uploadthing/route.ts` exports both `GET` and `POST` if `/api/uploadthing` returns 404/405.
- Check `"use client";` exists in uploader pages/components if React Server Component errors occur.
- Check `endpoint` string matches a real file-router key if the client reports unknown endpoint.
- Check alias imports (`@/` or `~/`) resolve correctly for `core.ts` type imports.
- Check Tailwind integration if UploadThing UI styles are missing.

## Reference

- UploadThing docs: https://docs.uploadthing.com/getting-started/appdir
