import { formatNumber } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-[8px] border border-ink/10 bg-porcelain/78 p-4 shadow-soft md:p-5">
      <p className="whitespace-nowrap font-serif text-[clamp(1.65rem,2.25vw,2.25rem)] font-semibold leading-none tracking-normal text-ink [font-variant-numeric:tabular-nums]">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-sm text-smoke">{label}</p>
    </div>
  );
}
