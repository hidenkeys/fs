import Link from "next/link";
import { Heart, Images, MessageCircleHeart } from "lucide-react";
import { FsLogo } from "@/components/ui/fs-logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-porcelain">
      <div className="section-shell flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <FsLogo showName markClassName="bg-porcelain text-ink shadow-none" />
          <p className="mt-2 max-w-md text-sm leading-6 text-white/64">
            A digital place of gratitude, love, remembrance, and family memory.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          <Link className="inline-flex items-center gap-2 hover:text-white" href="/#tribute">
            <Heart className="h-4 w-4" />
            Leave a Tribute
          </Link>
          <Link className="inline-flex items-center gap-2 hover:text-white" href="/tributes">
            <MessageCircleHeart className="h-4 w-4" />
            Read Tributes
          </Link>
          <Link className="inline-flex items-center gap-2 hover:text-white" href="/gallery">
            <Images className="h-4 w-4" />
            View Gallery
          </Link>
        </div>
      </div>
    </footer>
  );
}
