"use client";

import type React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { tributeSchema, type TributeInput } from "@/lib/schema";

export function TributeForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TributeInput>({
    resolver: zodResolver(tributeSchema)
  });

  function onSubmit() {
    setSubmitted(true);
    reset();
  }

  return (
    <section id="tribute" className="bg-ink py-24 text-porcelain">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Leave a Tribute"
            title="Share a message for the family to hold."
            copy="Tributes are designed for moderation before appearing publicly, keeping the wall respectful and personal."
            tone="dark"
          />
        </Reveal>
        <Reveal className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5 shadow-soft backdrop-blur md:p-8">
          {submitted ? (
            <div className="rounded-[8px] border border-gold/40 bg-gold/10 p-5">
              <p className="font-serif text-3xl">Thank you for sharing this memory.</p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                In production, this would be stored in Supabase and held for family moderation.
              </p>
              <Button className="mt-6" variant="secondary" onClick={() => setSubmitted(false)}>
                Write another tribute
              </Button>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register("name")} className="field" />
                </Field>
                <Field label="Relationship" error={errors.relationship?.message}>
                  <input {...register("relationship")} className="field" />
                </Field>
              </div>
              <Field label="Country" error={errors.country?.message}>
                <input {...register("country")} className="field" />
              </Field>
              <Field label="Message" error={errors.message?.message}>
                <textarea {...register("message")} rows={6} className="field min-h-40 resize-y" />
              </Field>
              <Field label="Optional photo" error={errors.photo?.message?.toString()}>
                <input
                  {...register("photo")}
                  type="file"
                  accept="image/*"
                  className="block w-full rounded-[8px] border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/76 file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
                />
              </Field>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                Submit Tribute
              </Button>
            </form>
          )}
        </Reveal>
      </div>
      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          padding: 0.875rem 1rem;
          color: #fffdf8;
          outline: none;
          transition: border-color 180ms ease, background 180ms ease;
        }

        .field:focus {
          border-color: #c9a227;
          background: rgba(255, 255, 255, 0.12);
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
      <span className="mb-2 block text-sm text-white/74">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-[#ffd7d7]">{error}</span> : null}
    </label>
  );
}
