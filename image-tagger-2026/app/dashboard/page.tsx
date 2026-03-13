import { desc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { UploadPanel } from "@/components/upload/upload-panel"
import { images } from "@/db/app-schema"
import { db } from "@/db"
import { getServerSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.session || !session.user) {
    redirect("/sign-in")
  }

  const rows = await db
    .select()
    .from(images)
    .where(eq(images.userId, session.user.id))
    .orderBy(desc(images.createdAt))
    .limit(10)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium">{session.user.email}</span>
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-medium">Recent tagged images</h2>
        <div className="mt-3 flex flex-col gap-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tagged images yet.
            </p>
          ) : (
            rows.map((row) => (
              <article
                key={row.id}
                className="rounded-md border border-border p-3"
              >
                <p className="font-medium">{row.title}</p>
                <p className="mt-1 text-xs break-all text-muted-foreground">
                  {row.sourceUrl}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {row.tags.join(", ") || "No tags"}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <UploadPanel />
    </main>
  )
}
