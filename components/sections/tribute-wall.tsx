"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Tribute } from "@/lib/types";
import { getShareUrl } from "@/lib/utils";

type TributeWallProps = {
  tributes: Tribute[];
};

export function TributeWall({ tributes }: TributeWallProps) {
  const [query, setQuery] = useState("");
  const approved = tributes.filter((tribute) => tribute.status === "approved");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return approved;

    return approved.filter((tribute) =>
      [tribute.name, tribute.relationship, tribute.country, tribute.message]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [approved, query]);

  const ordered = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(getShareUrl(`/tributes/${slug}`));
  }

  return (
    <section id="tributes" className="overflow-hidden bg-cream py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Tribute Wall"
            title="Featured memories, gently held at the top."
            copy="Search by name, relationship, country, or words remembered. Every approved tribute receives a shareable page."
          />
          <label className="relative block">
            <span className="sr-only">Search tributes</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-smoke" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, relationships, countries, memories"
            className="h-12 w-full rounded-full border border-ink/10 bg-porcelain pl-12 pr-5 text-sm shadow-soft outline-none transition focus:border-gold sm:h-14"
            />
          </label>
        </Reveal>

        <div className="relative mt-10 md:mt-14 md:min-h-[620px]">
          <div className="absolute inset-x-0 top-12 h-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ordered.map((tribute, index) => (
              <motion.article
                key={tribute.id}
                className={[
                  "rounded-[8px] border p-5 shadow-soft backdrop-blur sm:p-6",
                  tribute.featured
                    ? "border-gold/50 bg-porcelain"
                    : "border-ink/10 bg-porcelain/78",
                  tribute.pinned ? "md:col-span-1 lg:col-span-1" : ""
                ].join(" ")}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                animate={{ y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0] }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl font-semibold text-ink sm:text-2xl">{tribute.name}</p>
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
                <p className="mt-5 line-clamp-6 text-sm leading-7 text-smoke">{tribute.message}</p>
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
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
