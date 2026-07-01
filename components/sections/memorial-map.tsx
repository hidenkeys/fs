import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { MapPin as MapPinType } from "@/lib/types";

type MemorialMapProps = {
  pins: MapPinType[];
};

export function MemorialMap({ pins }: MemorialMapProps) {
  return (
    <section id="map" className="overflow-hidden bg-cream py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Memorial Map"
            title="Love gathered from every place he touched."
            copy="Visitors can be represented by location, creating a living map of remembrance across countries and generations."
            align="center"
          />
        </Reveal>
        <Reveal className="mt-12 rounded-[8px] border border-ink/10 bg-ink p-4 shadow-soft md:p-8">
          <div className="relative min-h-[360px] overflow-hidden rounded-[8px] bg-[radial-gradient(circle_at_50%_45%,rgba(201,162,39,0.18),transparent_22rem),linear-gradient(140deg,#26251f,#11100e)]">
            <svg
              aria-hidden
              viewBox="0 0 900 430"
              className="absolute inset-0 h-full w-full opacity-30"
              preserveAspectRatio="xMidYMid slice"
            >
              <path d="M95 145c58-52 158-56 214-18 31 21 39 48 76 58 34 9 58-8 87 6 27 13 37 46 22 70-23 37-91 24-129 48-43 27-45 87-88 96-33 7-60-20-71-48-13-33 4-65-10-92-17-34-72-29-103-61-23-24-23-43 2-59Z" fill="#fffdf8" />
              <path d="M405 128c55-36 130-29 166 11 31 35 12 83 48 110 35 26 87 1 121 30 28 24 22 66-4 86-48 38-152-4-199 26-25 16-30 43-59 44-27 1-47-22-48-46-2-29 24-44 20-70-4-27-35-32-46-58-13-31 18-54 9-83-6-19-30-30-8-50Z" fill="#fffdf8" />
              <path d="M655 89c60-15 111 20 119 62 7 38-22 57-13 89 10 35 54 35 63 69 8 31-18 62-48 66-38 5-50-35-87-37-35-2-47 31-81 24-33-7-52-45-39-74 12-27 45-28 57-55 14-31-21-49-15-86 4-27 19-51 44-58Z" fill="#fffdf8" />
            </svg>
            {pins.map((pin) => (
              <div
                key={`${pin.city}-${pin.country}`}
                className="group absolute"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-gold/30" />
                  <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gold text-ink shadow-glow">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="pointer-events-none absolute left-1/2 top-9 w-52 -translate-x-1/2 rounded-[8px] border border-white/10 bg-porcelain p-3 text-sm text-ink opacity-0 shadow-soft transition group-hover:opacity-100">
                    <p className="font-semibold">{pin.city}, {pin.country}</p>
                    <p className="mt-1 text-smoke">{pin.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
