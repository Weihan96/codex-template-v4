"use client"

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000"

export const authClient = createAuthClient({
  baseURL,
  plugins: [inferAdditionalFields<typeof auth>()],
})
