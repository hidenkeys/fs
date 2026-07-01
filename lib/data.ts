import type {
  GuestBookStats,
  MapPin,
  PhotoStory,
  SpecialDate,
  TimelineMilestone,
  Tribute
} from "@/lib/types";
import { dayOfYear } from "@/lib/utils";

export const siteSettings = {
  name: "Femi Sobande",
  initials: "FS",
  heroLine: "A life of kindness, wisdom, strength and love.",
  homepageQuote:
    "What we once enjoyed and deeply loved we can never lose, for all that we love deeply becomes part of us.",
  musicTrack: "/audio/soft-instrumental.mp3",
  specialDates: [] as SpecialDate[]
};

export const guestBookStats: GuestBookStats = {
  visitors: 12468,
  tributes: 186,
  candles: 1246,
  flowers: 392,
  countries: 18
};

export const tributes: Tribute[] = [
  {
    id: "tribute-1",
    slug: "adeola-remembers-his-wisdom",
    name: "Adeola Sobande",
    relationship: "Daughter",
    country: "Nigeria",
    createdAt: "2026-06-18T09:00:00.000Z",
    status: "approved",
    featured: true,
    pinned: true,
    candleCount: 81,
    message:
      "Daddy had a way of making everyone feel steady. His advice was never loud, but it stayed with you for years. I remember the way he listened first, smiled softly, and then gave exactly the words you needed."
  },
  {
    id: "tribute-2",
    slug: "kunle-remembers-his-kindness",
    name: "Kunle Adeyemi",
    relationship: "Friend",
    country: "United Kingdom",
    createdAt: "2026-06-19T17:30:00.000Z",
    status: "approved",
    featured: true,
    candleCount: 44,
    message:
      "Femi was the rare kind of man whose presence made a room calmer. He carried excellence without arrogance and generosity without performance. I will always remember his humor and the quiet dignity he showed every day."
  },
  {
    id: "tribute-3",
    slug: "mariam-remembers-family-sundays",
    name: "Mariam Bello",
    relationship: "Family friend",
    country: "Canada",
    createdAt: "2026-06-21T12:40:00.000Z",
    status: "approved",
    pinned: true,
    candleCount: 37,
    message:
      "Our Sunday visits were always warmer when Uncle Femi was there. He made the children laugh, asked thoughtful questions, and made each person feel remembered."
  },
  {
    id: "tribute-4",
    slug: "tunde-remembers-his-mentorship",
    name: "Tunde Williams",
    relationship: "Colleague",
    country: "United States",
    createdAt: "2026-06-24T15:10:00.000Z",
    status: "approved",
    candleCount: 29,
    message:
      "He taught me that leadership is measured by the confidence people feel after speaking with you. I am grateful for his mentorship and the example he set."
  }
];

export const mapPins: MapPin[] = [
  {
    city: "Lagos",
    country: "Nigeria",
    x: 50,
    y: 60,
    message: "Remembering him with gratitude from home."
  },
  {
    city: "London",
    country: "United Kingdom",
    x: 46,
    y: 36,
    message: "A light that travelled far."
  },
  {
    city: "Toronto",
    country: "Canada",
    x: 24,
    y: 35,
    message: "Sending love across generations."
  },
  {
    city: "Houston",
    country: "United States",
    x: 19,
    y: 51,
    message: "His wisdom remains close."
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    x: 59,
    y: 50,
    message: "Lighting a candle in his memory."
  }
];

export const photoStories: PhotoStory[] = [
  {
    id: "photo-story-1",
    title: "The Table Was Always Open",
    image: "/images/photo-story-dinner.png",
    alt: "A warm family dinner table with candlelight, reading glasses, and a blank memory note.",
    year: "Family Sundays",
    featured: true,
    quote: "The best memories often arrived quietly.",
    story:
      "Family gatherings carried his unmistakable warmth. The details were simple: a table, a few stories, and the feeling that everyone had been expected and welcomed."
  },
  {
    id: "photo-story-2",
    title: "Pages of a Life Well Loved",
    image: "/images/photo-story-album.png",
    alt: "An open family album in golden light beside white flowers and a brass pen.",
    year: "Legacy",
    featured: true,
    quote: "Love becomes a record that time cannot erase.",
    story:
      "Every album page represents more than a photograph. It holds a voice, a lesson, a small kindness, and the evidence of a life that shaped many others."
  },
  {
    id: "photo-story-3",
    title: "Morning Light",
    image: "/images/hero-memory.png",
    alt: "A peaceful memorial still life with a candle, flowers, and a framed silhouette in morning light.",
    year: "Remembrance",
    story:
      "The morning light feels fitting for him: quiet, steady, and generous. It reminds us that his love still meets the family in ordinary moments."
  }
];

export const timeline: TimelineMilestone[] = [
  {
    year: "Early Years",
    title: "A Foundation of Character",
    description:
      "The values that shaped his life began early: discipline, faithfulness, curiosity, and care for the people around him.",
    image: "/images/photo-story-album.png"
  },
  {
    year: "Family",
    title: "A Home Filled With Counsel",
    description:
      "He built a home where conversation mattered, laughter was welcome, and love was shown through presence.",
    image: "/images/photo-story-dinner.png",
    quote: "He made ordinary days feel anchored."
  },
  {
    year: "Legacy",
    title: "A Life That Continues",
    description:
      "His example continues through every person who carries his wisdom, kindness, humor, and strength forward.",
    image: "/images/hero-memory.png"
  }
];

export const rotatingQuotes = [
  "A father’s love leaves a path of light.",
  "The measure of a life is the love it leaves behind.",
  "Memory is love choosing to stay.",
  "A gentle life can shape generations."
];

export function getTodaysMemory(date = new Date()) {
  const index = dayOfYear(date) % (photoStories.length + tributes.length);
  const combined = [
    ...photoStories.map((story) => ({ kind: "photo" as const, item: story })),
    ...tributes.map((tribute) => ({ kind: "tribute" as const, item: tribute }))
  ];

  return combined[index];
}

export function getAnniversaryMode(date = new Date()) {
  return siteSettings.specialDates.find(
    (specialDate) =>
      specialDate.enabled &&
      specialDate.month === date.getMonth() + 1 &&
      specialDate.day === date.getDate()
  );
}
