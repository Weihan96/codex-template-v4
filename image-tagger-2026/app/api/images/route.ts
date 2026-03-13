import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { images } from "@/db/app-schema"
import { db } from "@/db"
import { getServerSession } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession()

  if (!session?.session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db
    .select()
    .from(images)
    .where(eq(images.userId, session.user.id))
    .orderBy(desc(images.createdAt))
    .limit(20)

  return NextResponse.json({ data: rows })
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as {
    sourceUrl?: string
    tags?: string[]
    title?: string
  }

  if (!body.sourceUrl || !body.title) {
    return NextResponse.json(
      { error: "sourceUrl and title are required" },
      { status: 400 }
    )
  }

  const [inserted] = await db
    .insert(images)
    .values({
      userId: session.user.id,
      title: body.title,
      sourceUrl: body.sourceUrl,
      tags: Array.isArray(body.tags) ? body.tags : [],
    })
    .returning()

  return NextResponse.json({ data: inserted }, { status: 201 })
}
