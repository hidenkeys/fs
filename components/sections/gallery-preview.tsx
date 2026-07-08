"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Images, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PhotoStory } from "@/lib/types";

type GalleryPreviewProps = {
  photos: PhotoStory[];
};

export function GalleryPreview({ photos }: GalleryPreviewProps) {
  const previewPhotos = useMemo(() => photos.slice(0, 10), [photos]);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRailRef = useRef<HTMLDivElement>(null);
  const activePhoto = previewPhotos[activeIndex];
  const hasMultiplePhotos = previewPhotos.length > 1;

  useEffect(() => {
    if (activeIndex < previewPhotos.length) return;
    setActiveIndex(0);
  }, [activeIndex, previewPhotos.length]);

  useEffect(() => {
    if (!hasMultiplePhotos) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % previewPhotos.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [hasMultiplePhotos, previewPhotos.length]);

  useEffect(() => {
    const activeThumbnail = thumbnailRailRef.current?.querySelector(
      `[data-gallery-thumbnail="${activeIndex}"]`
    );

    activeThumbnail?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [activeIndex]);

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + previewPhotos.length) % previewPhotos.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % previewPhotos.length);
  }

  if (!activePhoto) return null;

  return (
    <section id="gallery-preview" className="overflow-hidden bg-cream py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading
            eyebrow="Memory Gallery"
            title="A living reel of moments."
            copy="A curated scroll from the growing gallery, including family photos and approved tribute uploads."
          />
          <Link
            href="/gallery"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-porcelain px-5 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-gold/60 sm:w-auto"
          >
            Open Full Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal className="mt-9 overflow-hidden rounded-[8px] border border-ink/10 bg-porcelain shadow-soft sm:mt-12">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="relative min-h-[380px] overflow-hidden bg-[#e8dfd0] sm:min-h-[540px] lg:min-h-[620px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhoto.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <Image
                    src={activePhoto.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="scale-110 object-cover opacity-25 blur-2xl"
                    aria-hidden="true"
                  />
                  <Image
                    src={activePhoto.image}
                    alt={activePhoto.alt}
                    fill
                    priority={activeIndex === 0}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-contain p-3 sm:p-5"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-porcelain/88 px-3 py-2 text-xs font-semibold text-ink shadow-soft backdrop-blur sm:left-5 sm:top-5">
                <Images className="h-4 w-4 text-gold" />
                {activeIndex + 1} / {previewPhotos.length}
              </div>

              {hasMultiplePhotos ? (
                <div className="absolute bottom-4 right-4 flex gap-2 sm:bottom-5 sm:right-5">
                  <button
                    type="button"
                    aria-label="Show previous gallery photo"
                    onClick={showPrevious}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-ink/68 text-porcelain shadow-soft backdrop-blur transition hover:bg-ink"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Show next gallery photo"
                    onClick={showNext}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-ink/68 text-porcelain shadow-soft backdrop-blur transition hover:bg-ink"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col justify-between gap-8 overflow-hidden border-t border-ink/10 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activePhoto.id}-copy`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold sm:text-xs">
                    {activePhoto.year}
                  </p>
                  <h3 className="mt-3 break-words font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
                    {activePhoto.title}
                  </h3>
                  {activePhoto.quote ? (
                    <p className="mt-5 border-l-2 border-gold pl-4 font-serif text-xl leading-snug text-ink sm:text-2xl">
                      {activePhoto.quote}
                    </p>
                  ) : null}
                  {activePhoto.story ? (
                    <p className="mt-5 line-clamp-4 text-sm leading-7 text-smoke sm:text-base">
                      {activePhoto.story}
                    </p>
                  ) : null}
                  <Link
                    href="/gallery"
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-porcelain shadow-soft transition hover:-translate-y-0.5 hover:bg-[#2a2925]"
                  >
                    View Gallery
                    <Maximize2 className="h-4 w-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              <div>
                <div
                  ref={thumbnailRailRef}
                  className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#C9A227_transparent]"
                  aria-label="Gallery photo selector"
                >
                  {previewPhotos.map((photo, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={photo.id}
                        type="button"
                        data-gallery-thumbnail={index}
                        aria-label={`Show ${photo.title}`}
                        aria-pressed={isActive}
                        onClick={() => setActiveIndex(index)}
                        className={[
                          "relative h-20 min-w-24 snap-start overflow-hidden rounded-[8px] border bg-[#e8dfd0] transition sm:h-24 sm:min-w-32",
                          isActive
                            ? "border-gold shadow-glow"
                            : "border-ink/10 opacity-72 hover:opacity-100"
                        ].join(" ")}
                      >
                        <Image
                          src={photo.image}
                          alt=""
                          fill
                          unoptimized
                          sizes="8rem"
                          className="object-cover"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
                {hasMultiplePhotos ? (
                  <div className="mt-4 flex gap-1.5">
                    {previewPhotos.map((photo, index) => (
                      <button
                        key={`${photo.id}-indicator`}
                        type="button"
                        aria-label={`Show gallery photo ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                        className={[
                          "h-1.5 rounded-full transition",
                          index === activeIndex ? "w-9 bg-gold" : "w-3 bg-ink/16"
                        ].join(" ")}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
