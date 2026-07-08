"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircleHeart, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { storySchema, type StoryInput } from "@/lib/schema";
import type { MemoryStory } from "@/lib/types";

type MemoryStoriesProps = {
  stories: MemoryStory[];
};

export function MemoryStories({ stories }: MemoryStoriesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStory, setActiveStory] = useState<MemoryStory | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const visibleStories = useMemo(() => stories.slice(0, 12), [stories]);
  const previewStory = visibleStories[activeIndex];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<StoryInput>({
    resolver: zodResolver(storySchema)
  });

  useEffect(() => {
    if (visibleStories.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % visibleStories.length);
    }, 15000);

    return () => window.clearInterval(timer);
  }, [visibleStories.length]);

  async function onSubmit(data: StoryInput) {
    setSubmitError(null);
    const response = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmitError(payload?.error ?? "Unable to submit this story right now.");
      return;
    }

    setSubmitted(true);
    reset();
  }

  return (
    <section id="stories" className="overflow-hidden bg-porcelain py-16 sm:py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Stories From People"
            title="Small memories, still moving."
            copy="A rotating preview of stories from friends, family, colleagues, and classmates. Longer stories can be opened without stretching the homepage."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal className="relative overflow-hidden rounded-[8px] border border-ink/10 bg-cream p-4 shadow-soft sm:p-6 md:p-9">
            <div className="absolute inset-x-8 top-10 h-44 rounded-full bg-gold/10 blur-3xl" />
            {previewStory ? (
              <motion.article
                key={previewStory.id}
                className="relative rounded-[8px] border border-gold/40 bg-porcelain p-5 shadow-soft sm:min-h-[360px] sm:p-6 md:p-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold sm:h-12 sm:w-12">
                    <MessageCircleHeart className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <div>
                    <p className="font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                      {previewStory.name}
                    </p>
                    <p className="mt-2 text-[0.68rem] uppercase tracking-[0.13em] text-smoke sm:text-xs sm:tracking-[0.16em]">
                      {previewStory.relationship} · {previewStory.country}
                    </p>
                  </div>
                </div>
                <p className="mt-5 line-clamp-6 text-sm leading-7 text-smoke sm:mt-7 sm:line-clamp-7 sm:text-base sm:leading-8">
                  {previewStory.story}
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <Button className="w-full sm:w-auto" onClick={() => setActiveStory(previewStory)}>Read full story</Button>
                  <div className="flex flex-wrap gap-2">
                    {visibleStories.map((story, index) => (
                      <button
                        key={story.id}
                        type="button"
                        aria-label={`Show story ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                        className={[
                          "h-2.5 rounded-full transition",
                          index === activeIndex ? "w-8 bg-gold" : "w-2.5 bg-ink/18"
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
              </motion.article>
            ) : null}
          </Reveal>

          <Reveal className="rounded-[8px] border border-ink/10 bg-porcelain p-4 shadow-soft sm:p-5 md:p-8">
            {submitted ? (
              <div className="rounded-[8px] border border-gold/30 bg-gold/10 p-5">
                <p className="font-serif text-2xl text-ink sm:text-3xl">Thank you for sharing this story.</p>
                <p className="mt-3 text-sm leading-6 text-smoke">
                  It has been received and added to the rotating stories.
                </p>
                <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>
                  Write another story
                </Button>
              </div>
            ) : (
              <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    Share a Story
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                    Add a personal memory.
                  </h3>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Name" error={errors.name?.message}>
                    <input {...register("name")} className="story-field" />
                  </Field>
                  <Field label="Relationship" error={errors.relationship?.message}>
                    <input {...register("relationship")} className="story-field" />
                  </Field>
                </div>
                <Field label="Country" error={errors.country?.message}>
                  <input {...register("country")} className="story-field" />
                </Field>
                <Field label="Story" error={errors.story?.message}>
                  <textarea
                    {...register("story")}
                    rows={7}
                    className="story-field min-h-44 resize-y"
                  />
                </Field>
                <Button className="w-full sm:w-auto" type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Story"}
                </Button>
                {submitError ? (
                  <p className="rounded-[8px] border border-rosewood/20 bg-rosewood/10 p-3 text-sm text-rosewood">
                    {submitError}
                  </p>
                ) : null}
              </form>
            )}
          </Reveal>
        </div>
      </div>

      {activeStory ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/72 p-4 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Story from ${activeStory.name}`}
            className="max-h-[88svh] w-full max-w-3xl overflow-y-auto rounded-[8px] bg-porcelain p-5 shadow-soft md:p-9"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  Full Story
                </p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">
                  {activeStory.name}
                </h3>
                <p className="mt-2 text-sm text-smoke">
                  {activeStory.relationship} · {activeStory.country}
                </p>
              </div>
              <Button
                variant="ghost"
                className="h-10 min-h-10 w-10 rounded-full p-0"
                onClick={() => setActiveStory(null)}
                aria-label="Close story"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-8 whitespace-pre-line text-base leading-8 text-smoke">
              {activeStory.story}
            </p>
          </motion.div>
        </div>
      ) : null}

      <style jsx>{`
        .story-field {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(30, 30, 27, 0.12);
          background: rgba(255, 253, 248, 0.84);
          padding: 0.875rem 1rem;
          color: #1e1e1b;
          outline: none;
          transition: border-color 180ms ease, background 180ms ease;
        }

        .story-field:focus {
          border-color: #c9a227;
          background: #fffdf8;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-smoke">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rosewood">{error}</span> : null}
    </label>
  );
}
