"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Tribute } from "@/lib/types";
import { getShareUrl } from "@/lib/utils";

type TributePreviewProps = {
  tributes: Tribute[];
};

function orderedTributes(tributes: Tribute[]) {
  return tributes
    .filter((tribute) => tribute.status === "approved")
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

function visibleWindow<T>(items: T[], startIndex: number, count: number) {
  if (!items.length) return [];

  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => {
    return items[(startIndex + offset) % items.length];
  });
}

export function TributePreview({ tributes }: TributePreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ordered = useMemo(() => orderedTributes(tributes), [tributes]);
  const visibleTributes = visibleWindow(ordered, activeIndex, 3);

  useEffect(() => {
    if (ordered.length <= 3) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 3) % ordered.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [ordered.length]);

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(getShareUrl(`/tributes/${slug}`));
  }

  return (
    <section id="tributes" className="overflow-hidden bg-cream py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Tribute Wall"
            title="A few memories at a time."
            copy="The homepage now shows a gentle rotating selection. The full tribute wall remains available on its own page."
          />
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <LinkButton href="/tributes" variant="secondary" className="w-full sm:w-auto">
              View All Tributes
            </LinkButton>
            <LinkButton href="#tribute" className="w-full sm:w-auto">
              Leave a Tribute
            </LinkButton>
          </div>
        </Reveal>

        <div className="relative mt-10 md:mt-14">
          <div className="absolute inset-x-0 top-12 h-72 rounded-full bg-gold/10 blur-3xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
            >
              {visibleTributes.map((tribute, index) => (
                <article
                  key={tribute.id}
                  className={[
                    "rounded-[8px] border p-5 shadow-soft backdrop-blur sm:p-6",
                    tribute.featured
                      ? "border-gold/50 bg-porcelain"
                      : "border-ink/10 bg-porcelain/78",
                    index > 0 ? "max-md:hidden" : "",
                    index > 1 ? "max-lg:hidden" : ""
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl">
                        {tribute.name}
                      </p>
                      <p className="mt-1 text-sm text-smoke">
                        {tribute.relationship} · {tribute.country}
                      </p>
                    </div>
                    {tribute.featured ? (
                      <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-ink">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 line-clamp-6 text-sm leading-7 text-smoke">
                    {tribute.message}
                  </p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button
                      variant="secondary"
                      className="min-h-10 w-full px-4 sm:w-auto"
                      onClick={() => copyLink(tribute.slug)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Link
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-ink hover:bg-ink/5 sm:w-auto"
                      href={`/tributes/${tribute.slug}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Link>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>

          {ordered.length > 3 ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: Math.ceil(ordered.length / 3) }, (_, index) => {
                const isActive = Math.floor(activeIndex / 3) === index;

                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show tribute group ${index + 1}`}
                    onClick={() => setActiveIndex(index * 3)}
                    className={[
                      "h-2.5 rounded-full transition",
                      isActive ? "w-8 bg-gold" : "w-2.5 bg-ink/18"
                    ].join(" ")}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
