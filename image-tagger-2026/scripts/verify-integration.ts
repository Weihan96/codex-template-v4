import { config } from "dotenv"
import * as Sentry from "@sentry/nextjs"
import { eq, sql } from "drizzle-orm"

config({ path: ".env.local" })

type CountRow = {
  count: number
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function parseSessionCookie(setCookieHeader: string | null) {
  if (!setCookieHeader) {
    return null
  }

  const match = /better-auth\.session_token=([^;]+)/.exec(setCookieHeader)
  if (!match) {
    return null
  }

  return `better-auth.session_token=${match[1]}`
}

async function run() {
  const requiredEnvVars = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NEXT_PUBLIC_BETTER_AUTH_URL",
    "UPLOADTHING_TOKEN",
    "SENTRY_DSN",
  ]

  const missing = requiredEnvVars.filter((key) => {
    const value = process.env[key]
    return !value || value.trim() === "" || value.startsWith("TODO_")
  })

  if (missing.length > 0) {
    console.error(
      `BLOCKED: missing required integration env vars: ${missing.join(", ")}`
    )
    process.exit(1)
  }

  const [{ images }, { db }, { auth }] = await Promise.all([
    import("../db/app-schema"),
    import("../db"),
    import("../lib/auth-core"),
  ])

  const authEmail = `integration-${Date.now()}@example.com`
  const authPassword = "integration-password-123"

  const signUpResponse = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: authEmail,
        password: authPassword,
        name: "Integration User",
      }),
    })
  )

  assert(
    signUpResponse.ok,
    `Auth contract failed: sign-up returned status ${signUpResponse.status}`
  )

  const cookieHeader = parseSessionCookie(
    signUpResponse.headers.get("set-cookie")
  )
  assert(
    cookieHeader,
    "Auth contract failed: session cookie was not issued after sign-up"
  )

  const authedSession = await auth.api.getSession({
    headers: new Headers({
      cookie: cookieHeader,
    }),
  })

  assert(
    authedSession?.session,
    "Auth contract failed: signed-in session not found"
  )
  assert(authedSession.user, "Auth contract failed: signed-in user missing")

  const anonSession = await auth.api.getSession({
    headers: new Headers(),
  })

  assert(
    !anonSession,
    "Auth contract failed: anonymous request should not have a session"
  )

  const userId = authedSession.user.id

  const [beforeRow] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(images)
    .where(eq(images.userId, userId))

  const beforeCount = Number((beforeRow as CountRow | undefined)?.count ?? 0)

  await db.insert(images).values({
    userId,
    title: "Integration Seed Image",
    sourceUrl: "https://example.com/image.jpg",
    tags: ["integration", "scaffold"],
  })

  const [afterRow] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(images)
    .where(eq(images.userId, userId))

  const afterCount = Number((afterRow as CountRow | undefined)?.count ?? 0)

  assert(
    afterCount === beforeCount + 1,
    `Data contract failed: expected count ${beforeCount + 1}, got ${afterCount}`
  )

  let sentryObserved = false

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    beforeSend() {
      sentryObserved = true
      return null
    },
  })

  Sentry.captureException(new Error("integration-contract-check"))
  await Sentry.flush(2_000)

  assert(
    sentryObserved,
    "Monitoring contract failed: controlled event was not observed"
  )

  console.log("PASS: data contract check (read + write + refetch)")
  console.log("PASS: auth contract check (sign-in + protected session)")
  console.log(
    "PASS: monitoring contract check (controlled event delivery path)"
  )
}

run().catch((error) => {
  console.error(
    `FAIL: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
})
