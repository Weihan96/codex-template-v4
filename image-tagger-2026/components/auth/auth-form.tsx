"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type AuthMode = "sign-in" | "sign-up"

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const title = mode === "sign-in" ? "Sign in" : "Create account"

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const result =
        mode === "sign-in"
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({
              email,
              password,
              name: name.trim().length > 0 ? name.trim() : "Image Tagger User",
            })

      if (result.error) {
        setError(result.error.message ?? "Authentication failed")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Authentication failed")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in"
            ? "Use your email and password to continue."
            : "Create an account to manage your image tags."}
        </p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        {mode === "sign-up" ? (
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              className="rounded-md border border-input bg-background px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            className="rounded-md border border-input bg-background px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            className="rounded-md border border-input bg-background px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            minLength={8}
            required
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Working..." : title}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        className="justify-start px-0"
        onClick={() => {
          setMode(mode === "sign-in" ? "sign-up" : "sign-in")
          setError(null)
        }}
      >
        {mode === "sign-in"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </div>
  )
}
