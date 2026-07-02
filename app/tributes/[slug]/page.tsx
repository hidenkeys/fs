import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, Flame } from "lucide-react";
import { Footer } from "@/components/footer";
import { LinkButton } from "@/components/ui/button";
import { getTributeBySlug } from "@/lib/content";
import { getShareUrl } from "@/lib/utils";
import { ShareButton } from "./share-button";

type TributePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TributePageProps): Promise<Metadata> {
  const { slug } = await params;
  const tribute = await getTributeBySlug(slug);

  if (!tribute) {
    return {
      title: "Tribute Not Found"
    };
  }

  return {
    title: `A Tribute from ${tribute.name}`,
    description: tribute.message.slice(0, 150),
    openGraph: {
      title: `A Tribute from ${tribute.name}`,
      description: tribute.message.slice(0, 150),
      images: ["/images/hero-memory.png"]
    }
  };
}

export default async function TributePage({ params }: TributePageProps) {
  const { slug } = await params;
  const tribute = await getTributeBySlug(slug);

  if (!tribute) {
    notFound();
  }

  const shareUrl = getShareUrl(`/tributes/${tribute.slug}`);

  return (
    <main className="min-h-screen bg-cream">
      <section className="relative min-h-screen overflow-hidden bg-ink text-porcelain">
        <Image
          src="/images/hero-memory.png"
          alt="A peaceful memorial candle and flowers."
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-44"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/72 via-ink/65 to-ink" />
        <div className="section-shell relative z-10 flex min-h-screen flex-col justify-center py-20">
          <Link href="/" className="mb-10 inline-flex w-fit items-center gap-2 text-sm text-white/74 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to memorial
          </Link>
          <article className="max-w-4xl rounded-[8px] border border-white/12 bg-white/[0.08] p-7 shadow-soft backdrop-blur md:p-12">
            {tribute.featured ? (
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Featured Tribute
              </p>
            ) : null}
            <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">
              {tribute.name}
            </h1>
            <p className="mt-3 text-white/66">
              {tribute.relationship} · {tribute.country}
            </p>
            <p className="mt-8 text-xl leading-9 text-white/82">{tribute.message}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ShareButton url={shareUrl}>
                <Copy className="h-4 w-4" />
                Copy Tribute Link
              </ShareButton>
              <LinkButton href="/#tribute" variant="secondary">
                <Flame className="h-4 w-4" />
                Leave a Tribute
              </LinkButton>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
