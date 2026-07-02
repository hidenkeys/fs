"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/reveal";

type RotatingQuoteProps = {
  quotes: string[];
};

export function RotatingQuote({ quotes }: RotatingQuoteProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [quotes.length]);

  return (
    <section className="bg-ink px-4 py-14 text-center text-porcelain sm:py-20">
      <Reveal>
        <p className="mx-auto max-w-4xl font-serif text-3xl leading-tight sm:text-4xl md:text-6xl">
          “{quotes[index]}”
        </p>
      </Reveal>
    </section>
  );
}
