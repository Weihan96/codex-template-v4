export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center gap-8 px-6 py-10">
      <section className="max-w-2xl space-y-4">
        <p className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Scaffold ready
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          Image Tagger 2026
        </h1>
        <p className="text-base text-muted-foreground">
          Next.js + shadcn + Neon/Drizzle + Better Auth + UploadThing + Sentry
          baseline scaffold.
        </p>
      </section>

      <section className="flex flex-wrap gap-3">
        <a
          className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2 text-xs/relaxed font-medium text-primary-foreground transition-all hover:bg-primary/80"
          href="/sign-in"
        >
          Sign in
        </a>
        <a
          className="inline-flex h-7 items-center justify-center rounded-md border border-border px-2 text-xs/relaxed font-medium transition-all hover:bg-input/50"
          href="/dashboard"
        >
          Open dashboard
        </a>
      </section>
    </main>
  )
}
