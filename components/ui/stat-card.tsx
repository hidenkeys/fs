import { formatNumber } from "@/lib/utils";
import Link from "next/link";

type StatCardProps = {
  label: string;
  value: number;
  href?: string;
};

export function StatCard({ label, value, href }: StatCardProps) {
  const content = (
    <>
      <p className="whitespace-nowrap font-serif text-2xl font-semibold leading-none tracking-normal text-ink [font-variant-numeric:tabular-nums] sm:text-3xl">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs text-smoke sm:text-sm">{label}</p>
    </>
  );

  const className =
    "min-w-0 rounded-[8px] border border-ink/10 bg-porcelain/78 p-3 shadow-soft transition sm:p-4 md:p-5";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} block hover:-translate-y-0.5 hover:border-gold/45 hover:bg-porcelain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
