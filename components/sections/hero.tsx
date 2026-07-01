"use client";

import Image from "next/image";
import { ArrowDown, Images, PenLine } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { Candle } from "@/components/ui/candle";
import { FsLogo } from "@/components/ui/fs-logo";
import type { SpecialDate } from "@/lib/types";

type HeroProps = {
  specialDate?: SpecialDate;
};

export function Hero({ specialDate }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-ink text-porcelain">
      <Image
        src="/images/femi-sobande-hero.png"
        alt="A restored portrait of Femi Sobande smiling warmly in a striped shirt."
        fill
        priority
        sizes="100vw"
        className="object-cover object-[28%_center] opacity-84"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-ink/82" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/5 via-ink/18 to-ink/78" />
      <motion.div
        aria-hidden
        className="absolute inset-0 scale-105 bg-[radial-gradient(circle_at_50%_30%,rgba(201,162,39,0.22),transparent_28rem)]"
        animate={reduceMotion ? undefined : { scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="absolute left-0 right-0 top-0 z-10">
        <nav className="section-shell flex items-center justify-between py-5">
          <a href="#home" aria-label="Femi Sobande memorial home">
            <FsLogo />
          </a>
          <div className="hidden items-center gap-6 text-sm text-white/78 md:flex">
            <a href="#stories" className="hover:text-white">Stories</a>
            <a href="#tributes" className="hover:text-white">Tributes</a>
            <a href="#map" className="hover:text-white">Map</a>
            <a href="#guest-book" className="hover:text-white">Guest Book</a>
          </div>
        </nav>
      </header>

      <div id="home" className="section-shell relative z-10 flex min-h-[92svh] items-center justify-end pb-20 pl-[48%] pt-28 max-md:pl-0">
        <div className="ml-auto max-w-lg">
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
            className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            In Loving Memory
          </motion.p>
          <motion.h1
            className="font-serif text-5xl font-semibold leading-[0.96] md:text-7xl lg:text-8xl"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Femi Sobande
          </motion.h1>
          <motion.p
            className="mt-7 max-w-2xl text-lg leading-8 text-white/82 md:text-2xl"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            A life of kindness, wisdom, strength and love.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={false}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <LinkButton href="#tribute">
              <PenLine className="h-4 w-4" />
              Leave a Tribute
            </LinkButton>
            <LinkButton href="#stories" variant="secondary">
              <Images className="h-4 w-4" />
              View Gallery
            </LinkButton>
          </motion.div>
        </div>
      </div>

      <a
        href="#today"
        aria-label="Scroll to today's memory"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/30 p-3 text-white/80 transition hover:text-white"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
