"use client"

import { useState } from "react"

import { UploadButton } from "@/lib/uploadthing"

export function UploadPanel() {
  const [lastUpload, setLastUpload] = useState<string | null>(null)

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-base font-medium">Upload images</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        UploadThing endpoint is wired. Add `UPLOADTHING_TOKEN` to enable
        uploads.
      </p>

      <div className="mt-4">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(result) => {
            const first = result?.[0]
            setLastUpload(first?.url ?? null)
          }}
          onUploadError={(error: Error) => {
            setLastUpload(`error: ${error.message}`)
          }}
        />
      </div>

      {lastUpload ? (
        <p className="mt-3 text-xs break-all text-muted-foreground">
          {lastUpload}
        </p>
      ) : null}
    </section>
  )
}
