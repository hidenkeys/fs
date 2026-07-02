import { NextResponse } from "next/server";
import { getGuestBookStats } from "@/lib/content";
import { query } from "@/lib/db";

const actions = {
  candle: "candles",
  flower: "flowers"
} as const;

type GuestBookAction = keyof typeof actions;

function isGuestBookAction(action: unknown): action is GuestBookAction {
  return typeof action === "string" && action in actions;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: unknown; country?: unknown };

    if (!isGuestBookAction(body.action)) {
      return NextResponse.json({ error: "Choose candle or flower." }, { status: 400 });
    }

    const country =
      typeof body.country === "string" && body.country.trim()
        ? body.country.trim().slice(0, 80)
        : null;

    const table = actions[body.action];
    await query(`insert into ${table} (country) values ($1)`, [country]);

    return NextResponse.json({ stats: await getGuestBookStats() });
  } catch (error) {
    console.error("Guest book action failed", error);
    return NextResponse.json(
      { error: "We could not save this remembrance right now." },
      { status: 500 }
    );
  }
}
