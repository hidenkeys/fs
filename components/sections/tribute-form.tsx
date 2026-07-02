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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TributeInput>({
    resolver: zodResolver(tributeSchema)
  });

  async function onSubmit(data: TributeInput) {
    setSubmitError(null);
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("relationship", data.relationship);
    formData.set("country", data.country);
    formData.set("message", data.message);

    if (data.photo?.[0]) {
      formData.set("photo", data.photo[0]);
    }

    const response = await fetch("/api/tributes", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmitError(payload?.error ?? "Unable to submit this tribute right now.");
      return;
    }

    setSubmitted(true);
    reset();
  }

  return (
    <section id="tribute" className="bg-ink py-16 text-porcelain sm:py-24">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Leave a Tribute"
            title="Share a message for the family to hold."
            copy="Tributes are designed for moderation before appearing publicly, keeping the wall respectful and personal."
            tone="dark"
          />
        </Reveal>
        <Reveal className="rounded-[8px] border border-white/10 bg-white/[0.06] p-4 shadow-soft backdrop-blur sm:p-5 md:p-8">
          {submitted ? (
            <div className="rounded-[8px] border border-gold/40 bg-gold/10 p-5">
              <p className="font-serif text-2xl sm:text-3xl">Thank you for sharing this memory.</p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Your tribute has been received and will appear publicly after family moderation.
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
                  className="block w-full rounded-[8px] border border-white/12 bg-white/10 px-3 py-3 text-sm text-white/76 file:mb-2 file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink sm:px-4 sm:file:mb-0"
                />
              </Field>
              <Button className="w-full sm:w-auto" type="submit" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Tribute"}
              </Button>
              {submitError ? (
                <p className="rounded-[8px] border border-[#ffd7d7]/30 bg-[#ffd7d7]/10 p-3 text-sm text-[#ffd7d7]">
                  {submitError}
                </p>
              ) : null}
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
