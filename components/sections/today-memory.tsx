import Image from "next/image";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { PhotoStory, Tribute } from "@/lib/types";

type TodayMemoryProps = {
  memory: { kind: "photo"; item: PhotoStory } | { kind: "tribute"; item: Tribute };
};

export function TodayMemory({ memory }: TodayMemoryProps) {
  const isPhoto = memory.kind === "photo";
  const title = isPhoto ? memory.item.title : `A tribute from ${memory.item.name}`;
  const copy = isPhoto ? memory.item.story : memory.item.message;
  const href = isPhoto ? "#stories" : `/tributes/${memory.item.slug}`;

  return (
    <section id="today" className="bg-cream py-20">
      <div className="section-shell">
        <Reveal className="grid overflow-hidden rounded-[8px] border border-ink/10 bg-porcelain shadow-soft lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[320px]">
            <Image
              src={isPhoto ? memory.item.image : "/images/hero-memory.png"}
              alt={isPhoto ? memory.item.alt : "A peaceful memorial candle and flowers."}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <CalendarHeart className="h-4 w-4" />
              Today&apos;s Memory
            </div>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink md:text-6xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-8 text-smoke">{copy}</p>
            <Link className="mt-8 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8" href={href}>
              Open memory
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
