import { cn } from "@/lib/utils";

export function ProjectPoster({
  palette,
  category,
  className,
  children,
}: {
  palette: [string, string];
  category?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden noise-overlay", className)}
      style={{
        backgroundImage: `radial-gradient(55% 55% at 82% 12%, ${palette[0]}33, transparent 70%), linear-gradient(165deg, ${palette[1]} 0%, #050505 85%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 8px)",
        }}
      />
      {category && (
        <span className="pointer-events-none absolute bottom-4 left-5 select-none font-display text-[13vw] leading-none font-semibold text-white/10 md:text-6xl">
          {category}
        </span>
      )}
      {children}
    </div>
  );
}
