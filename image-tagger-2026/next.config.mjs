import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withSentryConfig(nextConfig, {
  authToken:
    process.env.SENTRY_AUTH_TOKEN && !process.env.SENTRY_AUTH_TOKEN.startsWith("TODO_")
      ? process.env.SENTRY_AUTH_TOKEN
      : undefined,
  org: process.env.SENTRY_ORG && !process.env.SENTRY_ORG.startsWith("TODO_") ? process.env.SENTRY_ORG : undefined,
  project:
    process.env.SENTRY_PROJECT && !process.env.SENTRY_PROJECT.startsWith("TODO_")
      ? process.env.SENTRY_PROJECT
      : undefined,
  silent: !process.env.CI,
})
