import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  const file = await readFile(envPath, "utf8");

  for (const line of file.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);
    process.env[key] ??= value;
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function uploadImage(filePath, publicId, fallbackUrl) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "fs-tribute/gallery",
      public_id: publicId,
      overwrite: true,
      resource_type: "image"
    });

    return result.secure_url;
  } catch (error) {
    if (fallbackUrl) return fallbackUrl;
    throw error;
  }
}

await loadEnv();

cloudinary.config({
  cloud_name: requiredEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requiredEnv("CLOUDINARY_API_KEY"),
  api_secret: requiredEnv("CLOUDINARY_API_SECRET"),
  secure: true
});

const { Pool } = pg;
const databaseUrl = new URL(requiredEnv("DATABASE_URL"));
databaseUrl.searchParams.delete("sslmode");

const pool = new Pool({
  connectionString: databaseUrl.toString(),
  ssl: { rejectUnauthorized: false }
});

const client = await pool.connect();

try {
  const schema = await readFile(path.join(rootDir, "db/schema.sql"), "utf8");
  await client.query(schema);

  const photos = [
    {
      key: "fs1",
      path: "/Users/oluwateniolasobande/Downloads/fs1.jpeg",
      fallbackUrl:
        "https://res.cloudinary.com/dkmv44eg9/image/upload/v1782950611/fs-tribute/gallery/fs1.jpg",
      title: "A Warm Family Moment",
      alt: "Femi Sobande smiling warmly with a family member outdoors.",
      year: "Family",
      quote: "Love was visible in the way he stood beside his people.",
      order: 20,
      story:
        "This photograph captures the ease and affection that followed him into family moments. His smile was never distant; it was present, generous, and full of quiet pride."
    },
    {
      key: "fs2",
      path: "/Users/oluwateniolasobande/Downloads/fs2.jpeg",
      fallbackUrl:
        "https://res.cloudinary.com/dkmv44eg9/image/upload/v1782950622/fs-tribute/gallery/fs2.jpg",
      title: "Standing Close",
      alt: "Femi Sobande standing beside a loved one with his arm around her.",
      year: "Family",
      quote: "He made people feel held, seen, and remembered.",
      order: 21,
      story:
        "There was a calm confidence in the way he cared for family. Even in ordinary photographs, you can see the warmth of someone who understood the value of presence."
    },
    {
      key: "fs3",
      path: "/Users/oluwateniolasobande/Downloads/fs3.jpeg",
      fallbackUrl:
        "https://res.cloudinary.com/dkmv44eg9/image/upload/v1782950627/fs-tribute/gallery/fs3.jpg",
      title: "At Work With Purpose",
      alt: "Femi Sobande seated indoors in a suit, holding a phone.",
      year: "Work and Service",
      quote: "Dignity showed in the way he carried responsibility.",
      order: 22,
      story:
        "He brought focus and steadiness into his work. Those who knew him professionally remember someone thoughtful, composed, and dependable in the moments that mattered."
    },
    {
      key: "fs4",
      path: "/Users/oluwateniolasobande/Downloads/fs4.jpeg",
      fallbackUrl:
        "https://res.cloudinary.com/dkmv44eg9/image/upload/v1782950630/fs-tribute/gallery/fs4.jpg",
      title: "Dressed With Dignity",
      alt: "Femi Sobande smiling in traditional blue attire.",
      year: "Celebration",
      quote: "Grace can be quiet and still fill a room.",
      order: 23,
      story:
        "In traditional dress, his presence carried elegance without effort. This memory feels celebratory: a portrait of confidence, culture, and the joy he shared with others."
    }
  ];

  const uploadedPhotos = [];
  for (const photo of photos) {
    const imageUrl = await uploadImage(photo.path, photo.key, photo.fallbackUrl);
    uploadedPhotos.push({ ...photo, imageUrl });
  }

  const curatedStories = [
    {
      title: "The Table Was Always Open",
      imageUrl: "/images/photo-story-dinner.png",
      alt: "A warm family dinner table with candlelight, reading glasses, and a blank memory note.",
      year: "Family Sundays",
      quote: "The best memories often arrived quietly.",
      order: 1,
      story:
        "Family gatherings carried his unmistakable warmth. The details were simple: a table, a few stories, and the feeling that everyone had been expected and welcomed."
    },
    {
      title: "Pages of a Life Well Loved",
      imageUrl: "/images/photo-story-album.png",
      alt: "An open family album in golden light beside white flowers and a brass pen.",
      year: "Legacy",
      quote: "Love becomes a record that time cannot erase.",
      order: 2,
      story:
        "Every album page represents more than a photograph. It holds a voice, a lesson, a small kindness, and the evidence of a life that shaped many others."
    },
    {
      title: "Morning Light",
      imageUrl: "/images/hero-memory.png",
      alt: "A peaceful memorial still life with a candle, flowers, and a framed silhouette in morning light.",
      year: "Remembrance",
      quote: "Memory is love choosing to stay.",
      order: 3,
      story:
        "The morning light feels fitting for him: quiet, steady, and generous. It reminds us that his love still meets the family in ordinary moments."
    }
  ];

  for (const story of curatedStories) {
    await client.query(
      `
        insert into gallery (
          title, image_url, alt, story, quote, year_label, status, featured, sort_order
        )
        values ($1, $2, $3, $4, $5, $6, 'approved', true, $7)
        on conflict (title) do update set
          image_url = excluded.image_url,
          alt = excluded.alt,
          story = excluded.story,
          quote = excluded.quote,
          year_label = excluded.year_label,
          status = 'approved',
          featured = true,
          sort_order = excluded.sort_order
      `,
      [story.title, story.imageUrl, story.alt, story.story, story.quote, story.year, story.order]
    );
  }

  for (const photo of uploadedPhotos) {
    await client.query(
      `
        insert into gallery (
          title, image_url, alt, story, quote, year_label, status, featured, sort_order
        )
        values ($1, $2, $3, $4, $5, $6, 'approved', false, $7)
        on conflict (title) do update set
          image_url = excluded.image_url,
          alt = excluded.alt,
          story = excluded.story,
          quote = excluded.quote,
          year_label = excluded.year_label,
          status = 'approved',
          featured = false,
          sort_order = excluded.sort_order
      `,
      [photo.title, photo.imageUrl, photo.alt, photo.story, photo.quote, photo.year, photo.order]
    );
  }

  const tributes = [
    {
      name: "Olusegun Adebanjo",
      relationship: "School friend from Abeokuta",
      country: "Nigeria",
      slug: "olusegun-adebanjo-school-friend-abeokuta",
      featured: true,
      pinned: true,
      message:
        "Femi and I first became friends in our school days in Abeokuta. Even then, he carried himself with unusual confidence and kindness. He had a way of making serious moments lighter and ordinary days memorable. I remember his laughter, his loyalty, and the respect he showed everyone around him. His memory remains a blessing."
    },
    {
      name: "Mrs. Yetunde Akinwale",
      relationship: "Former colleague from his nursing days",
      country: "Nigeria",
      slug: "yetunde-akinwale-nursing-colleague",
      featured: true,
      pinned: false,
      message:
        "I worked with Femi during his nursing days, and what stood out most was his compassion. He treated people with patience and dignity, whether the day was easy or difficult. He was dependable, calm under pressure, and generous with encouragement. Those of us who served beside him will always remember his professional grace."
    },
    {
      name: "Babatunde Ogunleye",
      relationship: "Childhood friend from Abeokuta",
      country: "Nigeria",
      slug: "babatunde-ogunleye-childhood-friend-abeokuta",
      featured: false,
      pinned: false,
      message:
        "Femi was part of my earliest memories in Abeokuta. We grew up sharing stories, errands, jokes, and dreams about the future. He was strong but never harsh, playful but never careless. Seeing the life he built made many of us proud. I remember him with deep respect and gratitude."
    }
  ];

  for (const tribute of tributes) {
    await client.query(
      `
        insert into tributes (
          slug, name, relationship, country, message, status, pinned, featured, approved_at
        )
        values ($1, $2, $3, $4, $5, 'approved', $6, $7, now())
        on conflict (slug) do update set
          name = excluded.name,
          relationship = excluded.relationship,
          country = excluded.country,
          message = excluded.message,
          status = 'approved',
          pinned = excluded.pinned,
          featured = excluded.featured,
          approved_at = now()
      `,
      [
        tribute.slug,
        tribute.name,
        tribute.relationship,
        tribute.country,
        tribute.message,
        tribute.pinned,
        tribute.featured
      ]
    );
  }

  const memoryStories = [
    {
      seedKey: "school-friend-abeokuta-story",
      name: "Olusegun Adebanjo",
      relationship: "School friend from Abeokuta",
      country: "Nigeria",
      featured: true,
      story:
        "In Abeokuta, Femi was the friend who could make a tense day feel lighter. We studied together, walked home together, and shared the kind of jokes that only school friends remember properly. What stayed with me most was his loyalty. If he called you his friend, he stood by you."
    },
    {
      seedKey: "nursing-colleague-story",
      name: "Mrs. Yetunde Akinwale",
      relationship: "Former nursing colleague",
      country: "Nigeria",
      featured: true,
      story:
        "During our nursing days, Femi treated people with a gentleness that never looked forced. He could be firm when work required it, but he never lost his humanity. Patients trusted him because he listened first. Colleagues respected him because he carried pressure with unusual calm."
    },
    {
      seedKey: "childhood-abeokuta-story",
      name: "Babatunde Ogunleye",
      relationship: "Childhood friend from Abeokuta",
      country: "Nigeria",
      featured: true,
      story:
        "We knew Femi before life became complicated, when friendship meant errands, football, laughter, and long conversations about the future. Even as a boy, he had a steady confidence. He did not need to be the loudest person around; people still noticed him."
    }
  ];

  for (const memory of memoryStories) {
    await client.query(
      `
        insert into memory_stories (
          seed_key, name, relationship, country, story, status, featured, approved_at
        )
        values ($1, $2, $3, $4, $5, 'approved', $6, now())
        on conflict (seed_key) do update set
          name = excluded.name,
          relationship = excluded.relationship,
          country = excluded.country,
          story = excluded.story,
          status = 'approved',
          featured = excluded.featured,
          approved_at = now()
      `,
      [
        memory.seedKey,
        memory.name,
        memory.relationship,
        memory.country,
        memory.story,
        memory.featured
      ]
    );
  }

  const timelineRows = [
    {
      year: "Abeokuta",
      title: "Roots and Friendships",
      description:
        "Friends from Abeokuta remember Femi as warm, confident, and loyal from his early years.",
      image: uploadedPhotos[0].imageUrl,
      quote: "Some friendships begin early and stay bright for a lifetime.",
      order: 1
    },
    {
      year: "Nursing Days",
      title: "A Life of Service",
      description:
        "Former colleagues remember the discipline, patience, and compassion he carried into his work.",
      image: uploadedPhotos[2].imageUrl,
      quote: "Care was not just his work; it was part of his nature.",
      order: 2
    },
    {
      year: "Legacy",
      title: "Family, Culture, and Grace",
      description:
        "His life continues through the people he loved, the culture he honored, and the example he left behind.",
      image: uploadedPhotos[3].imageUrl,
      quote: "A good life keeps speaking through the people it shaped.",
      order: 3
    }
  ];

  for (const row of timelineRows) {
    await client.query(
      `
        insert into timeline (year_label, title, description, image_url, quote, sort_order)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (title) do update set
          year_label = excluded.year_label,
          description = excluded.description,
          image_url = excluded.image_url,
          quote = excluded.quote,
          sort_order = excluded.sort_order
      `,
      [row.year, row.title, row.description, row.image, row.quote, row.order]
    );
  }

  const mapPins = [
    {
      city: "Abeokuta",
      country: "Nigeria",
      latitude: 7.1475,
      longitude: 3.3619,
      message: "Remembered by friends from his early years."
    },
    {
      city: "Lagos",
      country: "Nigeria",
      latitude: 6.5244,
      longitude: 3.3792,
      message: "Remembered by family, colleagues, and loved ones."
    }
  ];

  for (const pin of mapPins) {
    await client.query(
      `
        insert into map_pins (city, country, latitude, longitude, message, status)
        values ($1, $2, $3, $4, $5, 'approved')
        on conflict (city, country) do update set
          latitude = excluded.latitude,
          longitude = excluded.longitude,
          message = excluded.message,
          status = 'approved'
      `,
      [pin.city, pin.country, pin.latitude, pin.longitude, pin.message]
    );
  }

  await client.query(
    `
      insert into settings (key, value)
      values ('visitor_count', '{"count": 0}'::jsonb)
      on conflict (key) do nothing
    `
  );

  console.log("Seed complete.");
  console.log(
    uploadedPhotos.map((photo) => `${photo.title}: ${photo.imageUrl}`).join("\n")
  );
} finally {
  client.release();
  await pool.end();
}
