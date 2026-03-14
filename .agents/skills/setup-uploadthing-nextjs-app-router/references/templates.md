# UploadThing App Router Templates

Use these templates as a baseline and adapt imports to the target codebase.

## 1) File Router: `app/api/uploadthing/core.ts`

```ts
import { createUploadthing, type FileRouter, UploadThingError } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Replace with project auth lookup.
      const user = { id: "replace-me" };
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Persist file.key and file.ufsUrl in DB here.
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
```

## 2) Route Handler: `app/api/uploadthing/route.ts`

```ts
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
```

## 3) Typed Client Helpers: `src/utils/uploadthing.ts`

```ts
"use client";

import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
```

## 4) Client Component Usage Example

```tsx
"use client";

import { UploadButton } from "@/utils/uploadthing";

export function AvatarUploader() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("upload complete", res);
      }}
      onUploadError={(err: Error) => {
        console.error("upload failed", err);
      }}
    />
  );
}
```

## 5) Tailwind Integration (v3-style config)

```ts
import { withUt } from "uploadthing/tw";

const config = {
  // keep your existing Tailwind config
};

export default withUt(config);
```

## 6) Optional SSR Hydration in `app/layout.tsx`

```tsx
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadRouter } from "@/app/api/uploadthing/core";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        {children}
      </body>
    </html>
  );
}
```

## 7) Next.js 15 `ppr` / `dynamicIO` Note

Use `await connection()` and `Suspense` for the SSR plugin wrapper:

```tsx
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { connection } from "next/server";
import { Suspense } from "react";

import { uploadRouter } from "@/app/api/uploadthing/core";

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <UTSSR />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
```
