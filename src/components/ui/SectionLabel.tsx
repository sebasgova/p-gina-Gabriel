import { cn } from "@/lib/utils";

export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-mist", className)}>
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  );
}
