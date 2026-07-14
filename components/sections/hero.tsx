"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Images, PenLine } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { Candle } from "@/components/ui/candle";
import { FsLogo } from "@/components/ui/fs-logo";
import type { SpecialDate } from "@/lib/types";

type HeroProps = {
  specialDate?: SpecialDate;
};

const navLinks = [
  { label: "Stories", href: "/#stories", sectionId: "stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "Tributes", href: "/tributes" },
  { label: "Map", href: "/#map", sectionId: "map" },
  { label: "Guest Book", href: "/#guest-book", sectionId: "guest-book" }
];

export function Hero({ specialDate }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "today", "guest-book", "stories", "gallery-preview", "map", "tributes", "tribute"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.18, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-porcelain md:min-h-[92svh]">
      <Image
        src="/images/femi-sobande-hero.png"
        alt="A restored portrait of Olufemi Sobande smiling warmly in a striped shirt."
        fill
        priority
        sizes="100vw"
        className="object-cover object-[34%_center] opacity-84 md:object-[28%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/68 via-ink/38 to-ink/88" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/30 to-ink/78" />
      <motion.div
        aria-hidden
        className="absolute inset-0 scale-105 bg-[radial-gradient(circle_at_50%_30%,rgba(201,162,39,0.22),transparent_28rem)]"
        animate={reduceMotion ? undefined : { scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="absolute left-0 right-0 top-0 z-10">
        <nav className="section-shell flex items-center justify-between py-5">
          <Link href="/" aria-label="Olufemi Sobande memorial home">
            <FsLogo />
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/78 md:flex">
            {navLinks.map((link) => {
              const isActive = link.sectionId ? activeSection === link.sectionId : false;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "rounded-full px-1 py-2 transition hover:text-white",
                    isActive ? "text-white underline decoration-gold decoration-2 underline-offset-8" : ""
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <div id="home" className="section-shell relative z-10 flex min-h-[100svh] items-end justify-end pb-24 pt-36 md:min-h-[92svh] md:items-center md:pb-20 md:pl-[48%] md:pt-28">
        <div className="w-full max-w-lg md:ml-auto">
          {specialDate ? (
            <motion.div
              className="mb-8 inline-flex items-center gap-4 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Candle className="h-10 w-6 scale-75" />
              <span className="text-sm text-white/86">{specialDate.message}</span>
            </motion.div>
          ) : null}
          <motion.p
            className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.28em]"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            In Loving Memory
          </motion.p>
          <motion.h1
            className="max-w-[10ch] font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl md:max-w-none md:text-7xl lg:text-8xl"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Olufemi Sobande
          </motion.h1>
          <motion.p
            className="mt-5 max-w-md text-base leading-7 text-white/82 sm:text-lg sm:leading-8 md:max-w-2xl md:text-2xl"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            A life of kindness, wisdom, strength and love.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <LinkButton href="#tribute" className="w-full sm:w-auto">
              <PenLine className="h-4 w-4" />
              Leave a Tribute
            </LinkButton>
            <LinkButton href="/gallery" variant="secondary" className="w-full sm:w-auto">
              <Images className="h-4 w-4" />
              View Gallery
            </LinkButton>
          </motion.div>
        </div>
      </div>

      <a
        href="#today"
        aria-label="Scroll to today's memory"
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/30 p-3 text-white/80 transition hover:text-white md:bottom-7"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
