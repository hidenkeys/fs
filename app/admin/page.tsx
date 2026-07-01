"use client";

import type React from "react";
import { useState } from "react";
import { Check, Download, ImagePlus, LockKeyhole, Pin, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { guestBookStats, photoStories, siteSettings, tributes } from "@/lib/data";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  if (!unlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream px-4">
        <form
          className="w-full max-w-md rounded-[8px] border border-ink/10 bg-porcelain p-8 shadow-soft"
          onSubmit={(event) => {
            event.preventDefault();
            setUnlocked(password.trim().toLowerCase() === "demo");
          }}
        >
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-ink text-porcelain">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-ink">Admin</h1>
          <p className="mt-3 text-sm leading-6 text-smoke">
            This local prototype uses the passcode <strong>demo</strong>. Replace it with Supabase Auth before launch.
          </p>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-6 h-12 w-full rounded-[8px] border border-ink/10 bg-white px-4 outline-none focus:border-gold"
            aria-label="Admin passcode"
          />
          <Button className="mt-4 w-full" type="submit">Enter Dashboard</Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-10">
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Family Admin"
            title="Moderate memories and manage the archive."
            copy="The dashboard mirrors the production controls needed for approvals, pinning, featured memories, exports, gallery uploads, and homepage settings."
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <AdminStat label="Visitors" value={guestBookStats.visitors} />
          <AdminStat label="Tributes" value={guestBookStats.tributes} />
          <AdminStat label="Candles" value={guestBookStats.candles} />
          <AdminStat label="Countries" value={guestBookStats.countries} />
        </div>

        <section className="mt-10 rounded-[8px] border border-ink/10 bg-porcelain p-5 shadow-soft md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-3xl font-semibold text-ink">Tribute Moderation</h2>
            <Button>
              <ImagePlus className="h-4 w-4" />
              Upload Photos
            </Button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-smoke">
                <tr>
                  <th className="px-4">Name</th>
                  <th className="px-4">Relationship</th>
                  <th className="px-4">Country</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tributes.map((tribute) => (
                  <tr key={tribute.id} className="bg-cream">
                    <td className="rounded-l-[8px] px-4 py-4 font-medium text-ink">{tribute.name}</td>
                    <td className="px-4 py-4 text-smoke">{tribute.relationship}</td>
                    <td className="px-4 py-4 text-smoke">{tribute.country}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-ink">
                        {tribute.status}
                      </span>
                    </td>
                    <td className="rounded-r-[8px] px-4 py-4">
                      <div className="flex gap-2">
                        <IconButton label="Approve"><Check className="h-4 w-4" /></IconButton>
                        <IconButton label="Reject"><X className="h-4 w-4" /></IconButton>
                        <IconButton label="Pin"><Pin className="h-4 w-4" /></IconButton>
                        <IconButton label="Feature"><Star className="h-4 w-4" /></IconButton>
                        <IconButton label="Delete"><Trash2 className="h-4 w-4" /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[8px] border border-ink/10 bg-porcelain p-6 shadow-soft">
            <h2 className="font-serif text-3xl font-semibold text-ink">Homepage Quote</h2>
            <textarea
              className="mt-5 min-h-32 w-full rounded-[8px] border border-ink/10 bg-white p-4 text-sm leading-7 outline-none focus:border-gold"
              defaultValue={siteSettings.homepageQuote}
            />
            <Button className="mt-4">Save Quote</Button>
          </div>
          <div className="rounded-[8px] border border-ink/10 bg-porcelain p-6 shadow-soft">
            <h2 className="font-serif text-3xl font-semibold text-ink">Gallery Queue</h2>
            <div className="mt-5 grid gap-3">
              {photoStories.map((story) => (
                <div key={story.id} className="rounded-[8px] bg-cream p-4">
                  <p className="font-medium text-ink">{story.title}</p>
                  <p className="mt-1 text-sm text-smoke">{story.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] border border-ink/10 bg-porcelain p-5 shadow-soft">
      <p className="font-serif text-4xl font-semibold text-ink">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-smoke">{label}</p>
    </div>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition hover:bg-gold/18"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
