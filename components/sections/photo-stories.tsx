"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn, getShareUrl } from "@/lib/utils";
import type { PhotoStory } from "@/lib/types";

type PhotoStoriesProps = {
  stories: PhotoStory[];
};

const imageShapes = [
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-[3/4]"
];

function formatCounter(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function PhotoStories({ stories }: PhotoStoriesProps) {
  const photos = useMemo(() => stories.filter((photo) => photo.image), [stories]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(60);
  const visiblePhotos = photos.slice(0, visibleCount);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (!activePhoto) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? null : (index + 1) % photos.length));
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + photos.length) % photos.length
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, photos.length]);

  async function shareActivePhoto() {
    if (!activePhoto) return;

    const shareUrl = getShareUrl(`/gallery?photo=${encodeURIComponent(activePhoto.id)}`);

    if (navigator.share) {
      await navigator.share({
        title: "Memorial gallery photo",
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  }

  function showPrevious() {
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + photos.length) % photos.length
    );
  }

  function showNext() {
    setActiveIndex((index) => (index === null ? null : (index + 1) % photos.length));
  }

  return (
    <section id="gallery" className="overflow-hidden bg-cream">
      <div className="border-b border-ink/10 bg-[linear-gradient(180deg,#FFFDF8_0%,#F5EFE4_100%)]">
        <div className="section-shell flex flex-col gap-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold sm:text-xs">
              Gallery
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
              Photographs
            </h1>
          </motion.div>
          <p className="text-sm font-semibold text-smoke">
            {photos.length.toLocaleString()} photos
          </p>
        </div>
      </div>

      <div className="section-shell py-5 sm:py-8">
        <motion.div
          layout
          className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, index) => (
              <motion.button
                layout
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group relative min-w-0 overflow-hidden rounded-[18px] border border-ink/10 bg-[#e7ddcd] shadow-[0_12px_30px_rgba(30,29,26,0.08)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(30,29,26,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                  imageShapes[index % imageShapes.length]
                )}
                aria-label={`Open gallery photo ${index + 1}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.985 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.34, delay: Math.min(index * 0.01, 0.12) }}
              >
                <Image
                  src={photo.image}
                  alt={photo.alt || ""}
                  fill
                  unoptimized={isRemoteImage(photo.image)}
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 50vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
                  loading={index < 12 ? "eager" : "lazy"}
                />
                <span className="absolute inset-0 bg-ink/0 transition duration-300 group-hover:bg-ink/12" />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {!visiblePhotos.length ? (
          <div className="mt-10 rounded-[18px] border border-ink/10 bg-porcelain p-8 text-center shadow-soft">
            <p className="font-serif text-3xl font-semibold text-ink">No photos yet.</p>
          </div>
        ) : null}

        {visibleCount < photos.length ? (
          <div className="mt-10 flex justify-center">
            <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 60)}>
              Load more photos
            </Button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {activePhoto && activeIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/92 p-3 text-porcelain backdrop-blur-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery photo ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#11100e]/78 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  {formatCounter(activeIndex, photos.length)}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={shareActivePhoto}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14"
                    aria-label="Share photo"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <a
                    href={activePhoto.image}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14"
                    aria-label="Download photo"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(null)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14"
                    aria-label="Close gallery viewer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                className="relative min-h-0 flex-1 bg-black/20"
                onTouchStart={(event) => {
                  event.currentTarget.dataset.touchStart = String(event.touches[0].clientX);
                }}
                onTouchEnd={(event) => {
                  const start = Number(event.currentTarget.dataset.touchStart ?? 0);
                  const end = event.changedTouches[0].clientX;
                  const distance = end - start;

                  if (Math.abs(distance) < 45) return;
                  if (distance > 0) showPrevious();
                  else showNext();
                }}
              >
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.alt || ""}
                  fill
                  unoptimized={isRemoteImage(activePhoto.image)}
                  sizes="100vw"
                  className="object-contain p-3 sm:p-5"
                  priority
                />
                {photos.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={showPrevious}
                      className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-black/48 sm:left-5"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-black/48 sm:right-5"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                ) : null}
              </div>

              <div className="border-t border-white/10 px-3 py-3 sm:px-5">
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:#C9A227_transparent]">
                  {photos.map((photo, index) => (
                    <button
                      key={`${photo.id}-thumb`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "relative h-14 w-16 shrink-0 overflow-hidden rounded-[8px] border transition sm:h-16 sm:w-20",
                        index === activeIndex
                          ? "border-gold opacity-100"
                          : "border-white/10 opacity-55 hover:opacity-100"
                      )}
                      aria-label={`Open gallery photo ${index + 1}`}
                    >
                      <Image
                        src={photo.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="5rem"
                        className="object-cover"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
