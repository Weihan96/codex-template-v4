# Advanced SSR Templates (Next.js App Router)

Use these templates when implementing TanStack Query with advanced SSR patterns.

## Shared Query Options

```ts
// app/lib/queries.ts
import { queryOptions } from "@tanstack/react-query"

export type Post = { id: number; title: string }

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }
  return res.json()
}

export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: getPosts,
})
```

## Query Client Factory (Server + Browser)

```ts
// app/lib/get-query-client.ts
import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        // Next.js depends on thrown errors for dynamic route detection.
        shouldRedactErrors: () => false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
```

## Providers

```tsx
// app/providers.tsx
"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { getQueryClient } from "./lib/get-query-client"

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

```tsx
// app/layout.tsx
import { ReactNode } from "react"
import Providers from "./providers"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Server Prefetch + HydrationBoundary

```tsx
// app/posts.tsx (client)
"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { postsQueryOptions } from "./lib/queries"

export default function Posts() {
  const { data } = useSuspenseQuery(postsQueryOptions)
  return (
    <ul>
      {data.slice(0, 10).map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```tsx
// app/page.tsx (server)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "./lib/get-query-client"
import Posts from "./posts"
import { postsQueryOptions } from "./lib/queries"

export default function Page() {
  const queryClient = getQueryClient()

  // Use void for streaming behavior with pending dehydration.
  void queryClient.prefetchQuery(postsQueryOptions)
  // Use await queryClient.prefetchQuery(postsQueryOptions) for blocking SSR.

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

## Optional: Streamed Hydration Provider

```bash
bun add @tanstack/react-query-next-experimental
```

```tsx
// app/providers.tsx
"use client"

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { ReactNode } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
```

## Data Ownership Note

If both server components and client components render the same query data, the server-rendered value can drift from client-rendered value after client-side revalidation. Keep ownership in one side, or configure `staleTime`/rendering strategy accordingly.
