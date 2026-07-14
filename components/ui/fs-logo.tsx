import { cn } from "@/lib/utils";

type FsLogoProps = {
  className?: string;
  markClassName?: string;
  showName?: boolean;
};

export function FsLogo({ className, markClassName, showName = false }: FsLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative grid h-12 w-12 place-items-center rounded-full border border-gold/70 bg-ink/76 text-porcelain shadow-glow backdrop-blur",
          markClassName
        )}
        aria-hidden="true"
      >
        <span className="absolute inset-1 rounded-full border border-white/14" />
        <span className="font-serif text-[1.45rem] font-semibold leading-none tracking-normal">
          FS
        </span>
      </span>
      {showName ? (
        <span className="leading-tight">
          <span className="block font-serif text-xl font-semibold">Olufemi Sobande</span>
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold">
            In Loving Memory
          </span>
        </span>
      ) : (
        <span className="sr-only">Olufemi Sobande</span>
      )}
    </span>
  );
}
