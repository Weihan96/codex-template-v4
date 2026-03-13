import { createUploadthing, type FileRouter } from "uploadthing/next"

import { auth } from "@/lib/auth"

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 4,
      maxFileSize: "8MB",
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      })

      if (!session?.session || !session.user) {
        throw new Error("Unauthorized")
      }

      return {
        userId: session.user.id,
      }
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        fileKey: file.key,
        fileUrl: file.url,
        uploadedBy: metadata.userId,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
