"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PhotoStory } from "@/lib/types";

type PhotoStoriesProps = {
  stories: PhotoStory[];
};

export function PhotoStories({ stories }: PhotoStoriesProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoStory | null>(null);
  const galleryPhotos = useMemo(() => stories, [stories]);

  return (
    <section id="gallery" className="bg-cream py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading
            eyebrow="Memory Gallery"
            title="Photos gathered in one place."
            copy="Approved photos added by family and photos attached to tributes appear here as the gallery grows."
          />
          <p className="text-sm font-semibold text-smoke">
            {galleryPhotos.length.toLocaleString()} photos
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPhotos.map((photo, index) => (
            <Reveal key={photo.id} delay={index * 0.04}>
              <button
                type="button"
                onClick={() => setActivePhoto(photo)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-ink/10 bg-[#eee7da] shadow-soft transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-2 transition duration-700 group-hover:scale-[1.025]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="flex items-center gap-2 text-sm font-semibold text-porcelain">
                    <ImageIcon className="h-4 w-4" />
                    View photo
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/78 p-4 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
            className="relative h-[82svh] w-full max-w-6xl overflow-hidden rounded-[8px] bg-[#eee7da] shadow-soft sm:h-[88svh]"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={activePhoto.image}
              alt={activePhoto.alt}
              fill
              sizes="96vw"
              className="object-contain p-2 sm:p-4"
            />
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between gap-4 bg-gradient-to-b from-ink/70 to-transparent p-3 text-porcelain sm:p-4">
              <p className="min-w-0 truncate font-serif text-xl font-semibold sm:text-2xl">
                {activePhoto.title}
              </p>
              <Button
                variant="secondary"
                className="h-10 min-h-10 w-10 shrink-0 rounded-full p-0"
                onClick={() => setActivePhoto(null)}
                aria-label="Close gallery photo"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
