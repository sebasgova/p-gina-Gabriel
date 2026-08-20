"use client";

import { Container } from "@/components/ui/Container";
import { useCountUp } from "@/hooks/useCountUp";
import type { Settings } from "@/lib/types";

function StatItem({ label, value, suffix }: Settings["stats"][number]) {
  const { ref, value: current } = useCountUp(value);
  return (
    <div className="border-l border-line pl-6">
      <p className="font-display text-5xl font-semibold tracking-tight text-paper sm:text-6xl">
        <span ref={ref}>{current}</span>
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-3 text-sm text-mist">{label}</p>
    </div>
  );
}

export function Stats({ stats }: { stats: Settings["stats"] }) {
  return (
    <section id="experiencia" className="relative py-32">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
