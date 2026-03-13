import * as Sentry from "@sentry/nextjs"

const dsn = process.env.SENTRY_DSN
const enabled = Boolean(dsn && !dsn.startsWith("TODO_"))

Sentry.init({
  dsn: enabled ? dsn : undefined,
  enabled,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
})
