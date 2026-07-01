import { cn } from "@/lib/utils";

type CandleProps = {
  className?: string;
};

export function Candle({ className }: CandleProps) {
  return (
    <div className={cn("relative mx-auto h-20 w-10", className)} aria-hidden>
      <div className="absolute left-1/2 top-0 h-10 w-6 -translate-x-1/2 rounded-full bg-gold/70 blur-xl" />
      <div className="absolute left-1/2 top-1 h-8 w-5 -translate-x-1/2 animate-flame rounded-[50%_50%_45%_45%] bg-gradient-to-b from-white via-gold to-rosewood shadow-glow" />
      <div className="absolute bottom-0 left-1/2 h-12 w-8 -translate-x-1/2 rounded-b-lg rounded-t-sm bg-gradient-to-b from-white to-[#eadfcb] shadow-soft" />
      <div className="absolute bottom-3 left-1/2 h-9 w-px -translate-x-1/2 bg-ink/20" />
    </div>
  );
}
