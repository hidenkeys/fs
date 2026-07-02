import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  tone = "light"
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.22em]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl",
          tone === "dark" ? "text-porcelain" : "text-ink"
        )}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={cn(
            "mt-4 text-sm leading-7 sm:text-base sm:leading-8 md:text-lg",
            tone === "dark" ? "text-white/68" : "text-smoke"
          )}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}
