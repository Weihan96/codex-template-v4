import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { getServerSession } from "@/lib/auth"

export default async function SignInPage() {
  const session = await getServerSession()

  if (session?.session) {
    redirect("/dashboard")
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl items-center px-6 py-10">
      <AuthForm />
    </main>
  )
}
