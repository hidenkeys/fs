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

export function GuestBook({ stats }: GuestBookProps) {
  const [candles, setCandles] = useState(stats.candles);
  const [flowers, setFlowers] = useState(stats.flowers);

  return (
    <section id="guest-book" className="bg-porcelain py-24">
      <div className="section-shell">
        <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Digital Guest Book"
            title="Every visit becomes part of the remembrance."
            copy="The numbers gently reflect the people, countries, candles, flowers, and tributes gathered in his memory."
          />
          <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-[minmax(9.5rem,1.3fr)_repeat(4,minmax(7.5rem,1fr))]">
            <StatCard label="Visitors" value={stats.visitors} />
            <StatCard label="Tributes" value={stats.tributes} />
            <StatCard label="Candles" value={candles} />
            <StatCard label="Flowers" value={flowers} />
            <StatCard label="Countries" value={stats.countries} />
          </div>
        </Reveal>

        <Reveal className="mt-12 grid gap-6 rounded-[8px] border border-ink/10 bg-cream/70 p-6 shadow-soft md:grid-cols-[220px_1fr] md:p-8">
          <div className="flex items-center justify-center rounded-[8px] bg-ink py-8">
            <Candle />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <UsersRound className="h-4 w-4" />
              Shared remembrance
            </div>
            <p className="mt-4 max-w-2xl break-words font-serif text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
              {candles.toLocaleString()} candles have been lit in memory.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => setCandles((count) => count + 1)}>
                <Flame className="h-4 w-4" />
                Light a Candle
              </Button>
              <Button variant="secondary" onClick={() => setFlowers((count) => count + 1)}>
                <Flower2 className="h-4 w-4" />
                Place a Flower
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
