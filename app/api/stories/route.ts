import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const storyInputSchema = z.object({
  name: z.string().min(2).max(120),
  relationship: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  story: z.string().min(30).max(1600)
});

export async function POST(request: Request) {
  const parsed = storyInputSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete the story form correctly." },
      { status: 400 }
    );
  }

  const { name, relationship, country, story } = parsed.data;
  const result = await query<{ id: string }>(
    `
      insert into memory_stories (name, relationship, country, story, status, featured, approved_at)
      values ($1, $2, $3, $4, 'approved', false, now())
      returning id
    `,
    [name, relationship, country, story]
  );

  return NextResponse.json({ ok: true, storyId: result.rows[0]?.id });
}
