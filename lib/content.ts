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

type TributeLocationRow = {
  location: string;
  tribute_count: number;
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

const knownLocations: Record<
  string,
  { city: string; country: string; latitude: number; longitude: number }
> = {
  abeokuta: { city: "Abeokuta", country: "Nigeria", latitude: 7.1475, longitude: 3.3619 },
  benin: {
    city: "Cotonou",
    country: "Benin Republic",
    latitude: 6.3703,
    longitude: 2.3912
  },
  cotonou: {
    city: "Cotonou",
    country: "Benin Republic",
    latitude: 6.3703,
    longitude: 2.3912
  },
  lagos: { city: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792 },
  nigeria: { city: "Nigeria", country: "Nigeria", latitude: 9.082, longitude: 8.6753 },
  nigerian: { city: "Nigeria", country: "Nigeria", latitude: 9.082, longitude: 8.6753 },
  uk: {
    city: "United Kingdom",
    country: "United Kingdom",
    latitude: 55.3781,
    longitude: -3.436
  },
  "united kingdom": {
    city: "United Kingdom",
    country: "United Kingdom",
    latitude: 55.3781,
    longitude: -3.436
  },
  "united states": {
    city: "United States",
    country: "United States",
    latitude: 39.8283,
    longitude: -98.5795
  },
  "united states of america": {
    city: "United States",
    country: "United States",
    latitude: 39.8283,
    longitude: -98.5795
  },
  usa: {
    city: "United States",
    country: "United States",
    latitude: 39.8283,
    longitude: -98.5795
  }
};

function normalizeLocationText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N},\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function coordinatesToMapPoint(longitude: number, latitude: number) {
  return {
    x: Math.max(4, Math.min(96, ((longitude + 180) / 360) * 100)),
    y: Math.max(8, Math.min(92, ((90 - latitude) / 180) * 100))
  };
}

function normalizeTributeLocation(location: string) {
  const normalized = normalizeLocationText(location);
  const matchedKey = Object.keys(knownLocations).find((key) => normalized.includes(key));

  if (matchedKey) {
    return knownLocations[matchedKey];
  }

  const [city, country] = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (country) {
    const countryMatch = knownLocations[country];
    if (countryMatch) {
      return {
        ...countryMatch,
        city: city.replace(/\b\w/g, (letter) => letter.toUpperCase())
      };
    }
  }

  return null;
}

function tributeCountMessage(count: number) {
  return count === 1
    ? "1 tribute has been shared from this location."
    : `${count} tributes have been shared from this location.`;
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
  const manualPins = await query<MapPinRow>(`
    select city, country, latitude, longitude, message
    from map_pins
    where status = 'approved'
    order by created_at desc
  `);
  const tributeLocations = await query<TributeLocationRow>(`
      select trim(country) as location, count(*)::int as tribute_count
      from tributes
      where status = 'approved' and nullif(trim(country), '') is not null
      group by trim(country)
      order by tribute_count desc, location asc
    `);

  const pins = new Map<string, MapPin>();

  for (const row of manualPins.rows) {
    const longitude = Number(row.longitude ?? 3.3792);
    const latitude = Number(row.latitude ?? 6.5244);
    const point = coordinatesToMapPoint(longitude, latitude);
    const city = row.city ?? row.country;
    const key = `${city.toLowerCase()}|${row.country.toLowerCase()}`;

    pins.set(key, {
      city,
      country: row.country,
      ...point,
      message: row.message ?? "Remembering him with gratitude."
    });
  }

  const tributePinCounts = new Map<
    string,
    {
      location: { city: string; country: string; latitude: number; longitude: number };
      count: number;
    }
  >();

  for (const row of tributeLocations.rows) {
    const location = normalizeTributeLocation(row.location);
    if (!location) continue;

    const key = `${location.city.toLowerCase()}|${location.country.toLowerCase()}`;
    const existing = tributePinCounts.get(key);

    tributePinCounts.set(key, {
      location,
      count: (existing?.count ?? 0) + row.tribute_count
    });
  }

  for (const [key, tributePin] of tributePinCounts) {
    const point = coordinatesToMapPoint(
      tributePin.location.longitude,
      tributePin.location.latitude
    );
    const existing = pins.get(key);
    const countMessage = tributeCountMessage(tributePin.count);

    pins.set(key, {
      city: tributePin.location.city,
      country: tributePin.location.country,
      ...point,
      message: existing ? `${existing.message} ${countMessage}` : countMessage
    });
  }

  return Array.from(pins.values()).sort((a, b) => {
    const countryCompare = a.country.localeCompare(b.country);
    return countryCompare || a.city.localeCompare(b.city);
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
