import { Footer } from "@/components/footer";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { GuestBook } from "@/components/sections/guest-book";
import { Hero } from "@/components/sections/hero";
import { MemoryStories } from "@/components/sections/memory-stories";
import { MemorialMap } from "@/components/sections/memorial-map";
import { RotatingQuote } from "@/components/sections/rotating-quote";
import { TodayMemory } from "@/components/sections/today-memory";
import { TributeForm } from "@/components/sections/tribute-form";
import { TributeWall } from "@/components/sections/tribute-wall";
import {
  getAnniversaryMode,
  getApprovedMemoryStories,
  getApprovedTributes,
  getGalleryPhotos,
  getGuestBookStats,
  getMapPins,
  getTodaysMemory,
  rotatingQuotes,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [tributes, memoryStories, photoStories, guestBookStats, mapPins] = await Promise.all([
    getApprovedTributes(),
    getApprovedMemoryStories(),
    getGalleryPhotos(),
    getGuestBookStats(),
    getMapPins()
  ]);
  const todaysMemory = getTodaysMemory(photoStories, tributes);
  const specialDate = getAnniversaryMode();

  return (
    <main>
      <Hero specialDate={specialDate} />
      {todaysMemory ? <TodayMemory memory={todaysMemory} /> : null}
      <GuestBook stats={guestBookStats} />
      <MemoryStories stories={memoryStories} />
      <GalleryPreview photos={photoStories} />
      <MemorialMap pins={mapPins} />
      <RotatingQuote quotes={rotatingQuotes} />
      <TributeWall tributes={tributes} />
      <TributeForm />
      <Footer />
    </main>
  );
}
