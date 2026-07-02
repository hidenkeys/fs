import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { MapPin as MapPinType } from "@/lib/types";

type MemorialMapProps = {
  pins: MapPinType[];
};

export function MemorialMap({ pins }: MemorialMapProps) {
  return (
    <section id="map" className="overflow-hidden bg-porcelain py-16 sm:py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Memorial Map"
            title="Love gathered from every place he touched."
            copy="A simple atlas of the places where people are remembering him."
            align="center"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_320px] lg:gap-6">
          <Reveal className="rounded-[8px] border border-ink/10 bg-cream p-3 shadow-soft sm:p-4 md:p-6">
            <div className="relative min-h-[260px] overflow-hidden rounded-[8px] border border-ink/10 bg-[#fbf7ed] sm:min-h-[390px]">
              <svg
                aria-hidden
                viewBox="0 0 900 450"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="atlas-water" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fffdf8" />
                    <stop offset="100%" stopColor="#f1e8d7" />
                  </linearGradient>
                  <pattern id="atlas-grid" width="75" height="75" patternUnits="userSpaceOnUse">
                    <path d="M75 0H0V75" fill="none" stroke="#1e1e1b" strokeOpacity="0.045" />
                  </pattern>
                </defs>
                <rect width="900" height="450" fill="url(#atlas-water)" />
                <rect width="900" height="450" fill="url(#atlas-grid)" />
                <g fill="none" stroke="#1e1e1b" strokeOpacity="0.08" strokeWidth="1">
                  <path d="M0 225H900" />
                  <path d="M450 0V450" />
                  <path d="M150 0V450M300 0V450M600 0V450M750 0V450" />
                </g>
                <g fill="#d5cbb8" stroke="#9f927d" strokeWidth="1.4">
                  <path d="M110 125c34-31 80-44 132-38 45 6 85 29 99 62 10 23 4 43-16 57-21 15-48 8-65 24-18 16-12 43-31 55-20 13-58 0-79-25-19-23-12-47-31-64-15-13-43-12-54-29-10-17 8-31 45-42Z" />
                  <path d="M250 279c31 22 49 56 48 91-1 30-18 58-40 63-22 5-44-17-51-45-7-29 6-55 19-76 7-12 15-23 24-33Z" />
                  <path d="M411 93c48-24 108-25 161-4 50 20 84 55 78 91-6 34-49 36-57 70-7 31 22 55 9 83-15 34-67 45-109 28-37-15-42-51-75-62-27-9-58 6-74-15-15-20 8-43 8-73 1-38-36-64-23-88 9-16 40-15 82-30Z" />
                  <path d="M458 253c41 5 76 35 89 75 14 43-3 89-34 103-30 13-64-9-78-45-9-23-2-42-14-62-12-19-37-27-36-45 1-17 29-30 73-26Z" />
                  <path d="M611 115c58-37 145-39 201-4 36 23 55 60 40 89-15 28-59 23-74 51-13 24 12 48-3 75-17 30-67 35-105 14-33-18-30-50-61-66-25-13-57-2-71-23-12-18 10-37 14-62 5-32-18-47-6-62 10-12 35 0 65-12Z" />
                  <path d="M728 321c33 3 66 24 83 52 14 24 13 50-4 63-18 14-52 7-78-17-24-22-38-57-27-78 5-11 14-18 26-20Z" />
                </g>
                <g fill="#8f5d4d" fillOpacity="0.18">
                  <circle cx="492" cy="242" r="92" />
                  <circle cx="492" cy="242" r="54" />
                </g>
              </svg>

              {pins.map((pin) => (
                <div
                  key={`${pin.city}-${pin.country}`}
                  className="group absolute"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <span className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-gold/25" />
                    <span className="relative grid h-8 w-8 place-items-center rounded-full border border-porcelain bg-gold text-ink shadow-glow">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="pointer-events-none absolute left-1/2 top-9 z-10 hidden w-56 -translate-x-1/2 rounded-[8px] border border-ink/10 bg-porcelain p-3 text-sm text-ink opacity-0 shadow-soft transition group-hover:opacity-100 sm:block">
                      <p className="font-semibold">
                        {pin.city}, {pin.country}
                      </p>
                      <p className="mt-1 text-smoke">{pin.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="rounded-[8px] border border-ink/10 bg-cream p-4 shadow-soft sm:p-6">
            <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.22em]">
              <MapPin className="h-4 w-4" />
              Places Remembering Him
            </div>
            <div className="mt-5 grid gap-3 sm:mt-6">
              {pins.map((pin) => (
                <article
                  key={`${pin.city}-${pin.country}-card`}
                  className="rounded-[8px] border border-ink/10 bg-porcelain p-4"
                >
                  <p className="font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl">
                    {pin.city}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {pin.country}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-smoke">{pin.message}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
