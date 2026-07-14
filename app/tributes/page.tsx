import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { TributeWall } from "@/components/sections/tribute-wall";
import { FsLogo } from "@/components/ui/fs-logo";
import { getApprovedTributes } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function TributesPage() {
  const tributes = await getApprovedTributes();

  return (
    <main>
      <header className="border-b border-ink/10 bg-porcelain">
        <nav className="section-shell flex items-center justify-between gap-4 py-4 sm:py-5">
          <Link href="/" aria-label="Return to Olufemi Sobande memorial home">
            <FsLogo showName markClassName="bg-ink text-porcelain shadow-none" />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/10 px-3 text-sm font-semibold text-ink transition hover:border-gold/60 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>
      </header>
      <TributeWall tributes={tributes} />
      <Footer />
    </main>
  );
}
