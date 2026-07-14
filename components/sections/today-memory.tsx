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
  const href = isPhoto ? "/gallery" : `/tributes/${memory.item.slug}`;
  const imageSrc = isPhoto ? memory.item.image : "/images/hero-memory.png";
  const isRemoteImage = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <section id="today" className="bg-cream py-14 sm:py-20">
      <div className="section-shell">
        <Reveal className="grid overflow-hidden rounded-[8px] border border-ink/10 bg-porcelain shadow-soft lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[240px] sm:min-h-[320px]">
            <Image
              src={imageSrc}
              alt={isPhoto ? memory.item.alt : "A peaceful memorial candle and flowers."}
              fill
              unoptimized={isRemoteImage}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-8 md:p-12">
            <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.22em]">
              <CalendarHeart className="h-4 w-4" />
              Today&apos;s Memory
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-6xl">
              {title}
            </h2>
            <p className="mt-4 line-clamp-6 text-sm leading-7 text-smoke sm:text-base sm:leading-8">{copy}</p>
            <Link className="mt-6 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8 sm:mt-8" href={href}>
              Open memory
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
