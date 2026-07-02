import { formatNumber } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-[8px] border border-ink/10 bg-porcelain/78 p-3 shadow-soft sm:p-4 md:p-5">
      <p className="whitespace-nowrap font-serif text-2xl font-semibold leading-none tracking-normal text-ink [font-variant-numeric:tabular-nums] sm:text-3xl">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs text-smoke sm:text-sm">{label}</p>
    </div>
  );
}
