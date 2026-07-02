"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PhotoStory } from "@/lib/types";

type GalleryPreviewProps = {
  photos: PhotoStory[];
};

export function GalleryPreview({ photos }: GalleryPreviewProps) {
  const previewPhotos = photos.slice(0, 10);

  return (
    <section id="gallery-preview" className="overflow-hidden bg-cream py-14 sm:py-20">
      <div className="section-shell">
        <Reveal className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading
            eyebrow="Memory Gallery"
            title="A glimpse of the photos being gathered."
            copy="The full gallery has its own page so family photos and tribute uploads can keep growing without crowding the homepage."
          />
          <Link
            href="/gallery"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-porcelain px-5 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-gold/60 sm:w-auto"
          >
            Open Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4 [scrollbar-width:thin] [scrollbar-color:#C9A227_transparent]">
          {previewPhotos.map((photo, index) => (
            <Reveal
              key={photo.id}
              delay={index * 0.03}
              className="min-w-[82%] snap-start sm:min-w-[18rem] md:min-w-[21rem]"
            >
              <Link
                href="/gallery"
                className="group relative block aspect-[4/3] overflow-hidden rounded-[8px] border border-ink/10 bg-[#eee7da] shadow-soft"
                aria-label={`Open gallery to view ${photo.title}`}
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 21rem, 72vw"
                  className="object-contain p-2 transition duration-700 group-hover:scale-[1.025]"
                />
                <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-porcelain/88 text-gold shadow-soft">
                  <Images className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
