import { Footer } from "@/components/footer";
import { GuestBook } from "@/components/sections/guest-book";
import { Hero } from "@/components/sections/hero";
import { MemorialMap } from "@/components/sections/memorial-map";
import { PhotoStories } from "@/components/sections/photo-stories";
import { RotatingQuote } from "@/components/sections/rotating-quote";
import { Timeline } from "@/components/sections/timeline";
import { TodayMemory } from "@/components/sections/today-memory";
import { TributeForm } from "@/components/sections/tribute-form";
import { TributeWall } from "@/components/sections/tribute-wall";
import {
  getAnniversaryMode,
  getTodaysMemory,
  guestBookStats,
  mapPins,
  photoStories,
  rotatingQuotes,
  timeline,
  tributes
} from "@/lib/data";

export default function Home() {
  const todaysMemory = getTodaysMemory();
  const specialDate = getAnniversaryMode();

  return (
    <main>
      <Hero specialDate={specialDate} />
      <TodayMemory memory={todaysMemory} />
      <GuestBook stats={guestBookStats} />
      <PhotoStories stories={photoStories} />
      <MemorialMap pins={mapPins} />
      <TributeWall tributes={tributes} />
      <RotatingQuote quotes={rotatingQuotes} />
      <Timeline milestones={timeline} />
      <TributeForm />
      <Footer />
    </main>
  );
}
