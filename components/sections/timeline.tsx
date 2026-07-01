import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TimelineMilestone } from "@/lib/types";

type TimelineProps = {
  milestones: TimelineMilestone[];
};

export function Timeline({ milestones }: TimelineProps) {
  return (
    <section className="bg-porcelain py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Milestones"
            title="A legacy told through seasons."
            copy="The timeline is ready for family-curated years, photos, quotes, and major life moments."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6">
          {milestones.map((milestone, index) => (
            <Reveal key={`${milestone.year}-${milestone.title}`} delay={index * 0.08}>
              <article className="grid overflow-hidden rounded-[8px] border border-ink/10 bg-cream shadow-soft md:grid-cols-[260px_1fr]">
                {milestone.image ? (
                  <div className="relative min-h-[220px]">
                    <Image
                      src={milestone.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 260px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-7 md:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {milestone.year}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold text-ink">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-smoke">{milestone.description}</p>
                  {milestone.quote ? (
                    <p className="mt-5 border-l-2 border-gold pl-4 font-serif text-2xl text-ink">
                      {milestone.quote}
                    </p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
