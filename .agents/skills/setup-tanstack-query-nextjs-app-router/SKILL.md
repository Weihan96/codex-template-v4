---
name: setup-tanstack-query-nextjs-app-router
description: Set up TanStack Query in Next.js App Router with request-scoped server QueryClient, stable browser QueryClient provider, prefetch plus HydrationBoundary SSR, pending-query dehydration, and optional streamed hydration. Use when adding React Query to an app/ directory, fixing hydration or prefetch issues, or implementing the official advanced SSR pattern.
---

# Setup TanStack Query in Next.js App Router

Implement this skill to add or repair TanStack Query SSR in a Next.js `app/` project using the official advanced SSR approach.

## Execute Workflow

1. Detect the current shape.
Check whether the project uses App Router and whether React Query is already installed.

```bash
ls app src/app 2>/dev/null
cat package.json | rg '"next"|"@tanstack/react-query"|"@tanstack/react-query-next-experimental"'
```

2. Install required packages.
Use Bun in this repository.

```bash
bun add @tanstack/react-query
```

3. Define shared query options.
Create one shared options object per query in a server-safe module (for example `app/lib/queries.ts`) so server prefetch and client hooks always match.
Use templates in [references/advanced-ssr-templates.md](references/advanced-ssr-templates.md).

4. Create a query-client factory.
Implement `makeQueryClient()` and `getQueryClient()` in a server-safe file.
Use a fresh `QueryClient` on server requests and a singleton in the browser.
Set `staleTime` above zero to avoid immediate client refetch after hydration.

5. Add React Query provider.
Create `app/providers.tsx` as a client component.
Use `QueryClientProvider` with `getQueryClient()`.
Avoid `useState` initialization for the client instance when no suspense boundary exists below the provider.

6. Mount providers in root layout.
Wrap `children` in `<Providers>` from `app/layout.tsx`.

7. Prefetch in server components and hydrate.
In route segments/pages (server components), call `prefetchQuery` with shared query options, then pass `dehydrate(queryClient)` into `<HydrationBoundary state={...}>`.
Use `void queryClient.prefetchQuery(...)` when you want streaming with pending dehydration; use `await` when you require completed fetch before render.

8. Consume with client hooks.
Use `useQuery` or `useSuspenseQuery` with the same shared options object used by prefetch.

9. Enable streamed hydration only when needed.
If you need automatic streaming from server components without manual HydrationBoundary placement, add `@tanstack/react-query-next-experimental` and use `ReactQueryStreamedHydration`.
Use the optional template in [references/advanced-ssr-templates.md](references/advanced-ssr-templates.md).

10. Verify end-to-end behavior.
Confirm server render works, hydration completes without mismatch, and client cache is reused without duplicate initial fetches.

## Apply Guardrails

- Keep query keys stable and serializable.
Use deterministic array keys from shared query option modules.

- Keep query ownership clear between server and client.
Avoid rendering the same query result in both server component markup and client component markup when data may revalidate independently.

- Keep server QueryClient request-scoped.
Do not share one server QueryClient across requests.

- Keep browser QueryClient singleton-scoped.
Reuse the same browser instance to preserve cache across navigations.

- Keep hydration behavior explicit.
If dehydrating pending queries, include pending query dehydration logic and keep `shouldRedactErrors` aligned with the Next.js pattern.

## Run Troubleshooting Checks

- Check `QueryClientProvider` wraps all client components using query hooks if hooks fail at runtime.
- Check shared query options are imported in both prefetch and hook usage if hydration cache misses occur.
- Check `staleTime` is not `0` if immediate post-hydration refetch causes flicker.
- Check `HydrationBoundary` exists in the route tree around prefetched data consumers if server-prefetched data is not reused.
- Check server-only code is not imported into client components if Next.js bundling errors occur.

## Reference

- TanStack Query Advanced SSR guide: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
