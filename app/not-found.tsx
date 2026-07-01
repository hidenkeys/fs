import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 text-center">
      <div className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">404</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink">Memory not found</h1>
        <p className="mt-4 text-sm leading-7 text-smoke">
          This tribute may still be awaiting moderation or the link may have changed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-porcelain"
        >
          <ArrowLeft className="h-4 w-4" />
          Return Home
        </Link>
      </div>
    </main>
  );
}
