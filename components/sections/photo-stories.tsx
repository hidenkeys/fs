"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PhotoStory } from "@/lib/types";

type PhotoStoriesProps = {
  stories: PhotoStory[];
};

export function PhotoStories({ stories }: PhotoStoriesProps) {
  const [activeStory, setActiveStory] = useState<PhotoStory | null>(null);

  return (
    <section id="stories" className="bg-porcelain py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Photo Stories"
            title="Images that open into memory."
            copy="Each photograph can carry the context, quote, or family story that gives it meaning."
          />
        </Reveal>
        <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-4">
          {stories.map((story, index) => (
            <Reveal
              key={story.id}
              delay={index * 0.06}
              className={index === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-2"}
            >
              <button
                type="button"
                onClick={() => setActiveStory(story)}
                className="group relative h-full w-full overflow-hidden rounded-[8px] text-left shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/18 to-transparent" />
                <span className="absolute bottom-5 left-5 right-5 text-porcelain">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {story.year}
                  </span>
                  <span className="mt-2 block font-serif text-3xl font-semibold">
                    {story.title}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeStory ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/72 p-4 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeStory.title}
            className="grid max-h-[90svh] w-full max-w-5xl overflow-hidden rounded-[8px] bg-porcelain shadow-soft lg:grid-cols-[0.95fr_1.05fr]"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative min-h-[280px]">
              <Image src={activeStory.image} alt={activeStory.alt} fill className="object-cover" />
            </div>
            <div className="overflow-y-auto p-7 md:p-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    {activeStory.year}
                  </p>
                  <h3 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">
                    {activeStory.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  className="h-10 min-h-10 w-10 rounded-full p-0"
                  onClick={() => setActiveStory(null)}
                  aria-label="Close photo story"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {activeStory.quote ? (
                <blockquote className="mt-8 border-l-2 border-gold pl-5 font-serif text-2xl leading-snug text-ink">
                  {activeStory.quote}
                </blockquote>
              ) : null}
              <p className="mt-7 text-base leading-8 text-smoke">{activeStory.story}</p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
