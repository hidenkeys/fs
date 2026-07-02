import type {
  GuestBookStats,
  MapPin,
  MemoryStory,
  PhotoStory,
  SpecialDate,
  TimelineMilestone,
  Tribute
} from "@/lib/types";
import { query } from "@/lib/db";
import { dayOfYear } from "@/lib/utils";

export const siteSettings = {
  name: "Femi Sobande",
  initials: "FS",
  heroLine: "A life of kindness, wisdom, strength and love.",
  homepageQuote:
    "What we once enjoyed and deeply loved we can never lose, for all that we love deeply becomes part of us.",
  specialDates: [] as SpecialDate[]
};

export const rotatingQuotes = [
  "A gentle life can shape generations.",
  "A father's love leaves a path of light.",
  "The measure of a life is the love it leaves behind.",
  "Memory is love choosing to stay."
];

type TributeRow = {
  id: string;
  slug: string;
  name: string;
  relationship: string;
  country: string;
  message: string;
  photo_url: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  pinned: boolean;
  candle_count: number;
  created_at: Date;
};

type GalleryRow = {
  id: string;
  title: string;
  image_url: string;
  alt: string;
  story: string | null;
  quote: string | null;
  year_label: string | null;
  featured: boolean;
  created_at: Date;
};

type TimelineRow = {
  year_label: string;
  title: string;
  description: string;
  image_url: string | null;
  quote: string | null;
};

type MapPinRow = {
  city: string | null;
  country: string;
  latitude: string | null;
  longitude: string | null;
  message: string | null;
};

type MemoryStoryRow = {
  id: string;
  name: string;
  relationship: string;
  country: string;
  story: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: Date;
};

function toTribute(row: TributeRow): Tribute {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    relationship: row.relationship,
    country: row.country,
    message: row.message,
    photoUrl: row.photo_url ?? undefined,
    createdAt: row.created_at.toISOString(),
    status: row.status,
    featured: row.featured,
    pinned: row.pinned,
    candleCount: row.candle_count
  };
}

function toPhotoStory(row: GalleryRow): PhotoStory {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    alt: row.alt,
    year: row.year_label ?? "Memory",
    story: row.story ?? "",
    quote: row.quote ?? undefined,
    featured: row.featured
  };
}

function toMemoryStory(row: MemoryStoryRow): MemoryStory {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    country: row.country,
    story: row.story,
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at.toISOString()
  };
}

export async function getApprovedTributes() {
  const result = await query<TributeRow>(`
    select id, slug, name, relationship, country, message, photo_url, status,
           featured, pinned, candle_count, created_at
    from tributes
    where status = 'approved'
    order by pinned desc, featured desc, created_at desc
  `);

  return result.rows.map(toTribute);
}

export async function getAllTributes() {
  const result = await query<TributeRow>(`
    select id, slug, name, relationship, country, message, photo_url, status,
           featured, pinned, candle_count, created_at
    from tributes
    order by created_at desc
  `);

  return result.rows.map(toTribute);
}

export async function getTributeBySlug(slug: string) {
  const result = await query<TributeRow>(
    `
      select id, slug, name, relationship, country, message, photo_url, status,
             featured, pinned, candle_count, created_at
      from tributes
      where slug = $1 and status = 'approved'
      limit 1
    `,
    [slug]
  );

  return result.rows[0] ? toTribute(result.rows[0]) : null;
}

export async function getPhotoStories() {
  const result = await query<GalleryRow>(`
    select id, title, image_url, alt, story, quote, year_label, featured, created_at
    from gallery
    where status = 'approved'
    order by featured desc, sort_order asc, created_at desc
  `);

  return result.rows.map(toPhotoStory);
}

export async function getGalleryPhotos() {
  const result = await query<GalleryRow>(`
    select id, title, image_url, alt, story, quote, year_label, featured, created_at
    from gallery
    where status = 'approved' and image_url not like '/images/%'
    order by sort_order asc, created_at desc
  `);

  return result.rows.map(toPhotoStory);
}

export async function getAllPhotoStories() {
  const result = await query<GalleryRow>(`
    select id, title, image_url, alt, story, quote, year_label, featured, created_at
    from gallery
    order by status asc, featured desc, sort_order asc, created_at desc
  `);

  return result.rows.map(toPhotoStory);
}

export async function getApprovedMemoryStories() {
  const result = await query<MemoryStoryRow>(`
    select id, name, relationship, country, story, status, featured, created_at
    from memory_stories
    where status = 'approved'
    order by featured desc, created_at desc
  `);

  return result.rows.map(toMemoryStory);
}

export async function getTimeline() {
  const result = await query<TimelineRow>(`
    select year_label, title, description, image_url, quote
    from timeline
    order by sort_order asc, created_at asc
  `);

  return result.rows.map<TimelineMilestone>((row) => ({
    year: row.year_label,
    title: row.title,
    description: row.description,
    image: row.image_url ?? undefined,
    quote: row.quote ?? undefined
  }));
}

export async function getMapPins() {
  const result = await query<MapPinRow>(`
    select city, country, latitude, longitude, message
    from map_pins
    where status = 'approved'
    order by created_at desc
  `);

  return result.rows.map<MapPin>((row) => {
    const longitude = Number(row.longitude ?? 3.3792);
    const latitude = Number(row.latitude ?? 6.5244);

    return {
      city: row.city ?? "A visitor",
      country: row.country,
      x: Math.max(4, Math.min(96, ((longitude + 180) / 360) * 100)),
      y: Math.max(8, Math.min(92, ((90 - latitude) / 180) * 100)),
      message: row.message ?? "Remembering him with gratitude."
    };
  });
}

export async function getGuestBookStats(): Promise<GuestBookStats> {
  const result = await query<{
    tributes: string;
    candles: string;
    flowers: string;
    countries: string;
    visitors: string | null;
  }>(`
    select
      (select count(*) from tributes where status = 'approved')::text as tributes,
      (select count(*) from candles)::text as candles,
      (select count(*) from flowers)::text as flowers,
      (
        select count(distinct country)::text
        from (
          select country from tributes where status = 'approved'
          union all
          select country from map_pins where status = 'approved'
          union all
          select country from photo_memories where status = 'approved'
        ) countries
      ) as countries,
      (select value->>'count' from settings where key = 'visitor_count') as visitors
  `);

  const row = result.rows[0];

  return {
    visitors: Number(row?.visitors ?? 0),
    tributes: Number(row?.tributes ?? 0),
    candles: Number(row?.candles ?? 0),
    flowers: Number(row?.flowers ?? 0),
    countries: Number(row?.countries ?? 0)
  };
}

export function getAnniversaryMode(date = new Date()) {
  return siteSettings.specialDates.find(
    (specialDate) =>
      specialDate.enabled &&
      specialDate.month === date.getMonth() + 1 &&
      specialDate.day === date.getDate()
  );
}

export function getTodaysMemory(
  photoStories: PhotoStory[],
  tributes: Tribute[],
  date = new Date()
) {
  const featuredStories = photoStories.filter((story) => story.featured);
  const combined = [
    ...featuredStories.map((story) => ({ kind: "photo" as const, item: story })),
    ...tributes.map((tribute) => ({ kind: "tribute" as const, item: tribute }))
  ];

  if (combined.length === 0) return null;

  return combined[dayOfYear(date) % combined.length];
}
