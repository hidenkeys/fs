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
    <section className="bg-ink px-4 py-20 text-center text-porcelain">
      <Reveal>
        <p className="mx-auto max-w-4xl font-serif text-4xl leading-tight md:text-6xl">
          “{quotes[index]}”
        </p>
      </Reveal>
    </section>
  );
}
