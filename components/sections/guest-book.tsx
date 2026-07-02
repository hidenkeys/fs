"use client";

import { useState } from "react";
import { Flower2, Flame, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candle } from "@/components/ui/candle";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import type { GuestBookStats } from "@/lib/types";

type GuestBookProps = {
  stats: GuestBookStats;
};

type GuestBookAction = "candle" | "flower";

export function GuestBook({ stats }: GuestBookProps) {
  const [currentStats, setCurrentStats] = useState(stats);
  const [pendingAction, setPendingAction] = useState<GuestBookAction | null>(null);
  const [error, setError] = useState("");

  async function recordRemembrance(action: GuestBookAction) {
    setPendingAction(action);
    setError("");

    try {
      const response = await fetch("/api/guest-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const payload = (await response.json()) as {
        stats?: GuestBookStats;
        error?: string;
      };

      if (!response.ok || !payload.stats) {
        throw new Error(payload.error ?? "Unable to save this remembrance.");
      }

      setCurrentStats(payload.stats);
    } catch (remembranceError) {
      setError(
        remembranceError instanceof Error
          ? remembranceError.message
          : "Unable to save this remembrance."
      );
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section id="guest-book" className="bg-porcelain py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Digital Guest Book"
            title="Every visit becomes part of the remembrance."
            copy="The numbers gently reflect the people, countries, candles, flowers, and tributes gathered in his memory."
          />
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[minmax(9.5rem,1.3fr)_repeat(4,minmax(7.5rem,1fr))]">
            <StatCard label="Visitors" value={currentStats.visitors} />
            <StatCard label="Tributes" value={currentStats.tributes} />
            <StatCard label="Candles" value={currentStats.candles} />
            <StatCard label="Flowers" value={currentStats.flowers} />
            <StatCard label="Countries" value={currentStats.countries} />
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 rounded-[8px] border border-ink/10 bg-cream/70 p-4 shadow-soft sm:p-6 md:grid-cols-[220px_1fr] md:p-8">
          <div className="flex items-center justify-center rounded-[8px] bg-ink py-6 sm:py-8">
            <Candle />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:text-sm sm:tracking-[0.2em]">
              <UsersRound className="h-4 w-4" />
              Shared remembrance
            </div>
            <p className="mt-4 max-w-2xl break-words font-serif text-2xl leading-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
              {currentStats.candles.toLocaleString()} candles have been lit in memory.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Button
                className="w-full sm:w-auto"
                disabled={pendingAction !== null}
                onClick={() => void recordRemembrance("candle")}
              >
                <Flame className="h-4 w-4" />
                {pendingAction === "candle" ? "Lighting..." : "Light a Candle"}
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={pendingAction !== null}
                onClick={() => void recordRemembrance("flower")}
              >
                <Flower2 className="h-4 w-4" />
                {pendingAction === "flower" ? "Placing..." : "Place a Flower"}
              </Button>
            </div>
            {error ? <p className="mt-4 text-sm text-rosewood">{error}</p> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
