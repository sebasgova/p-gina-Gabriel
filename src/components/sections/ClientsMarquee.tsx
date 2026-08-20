import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getIcon } from "@/lib/icons";
import type { Client } from "@/lib/types";

export function ClientsMarquee({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;
  const loop = [...clients, ...clients];

  return (
    <section className="relative border-y border-line py-14">
      <Container className="mb-8">
        <SectionLabel index="06">He trabajado con</SectionLabel>
      </Container>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

        <div className="flex w-max animate-marquee gap-4 [animation-play-state:running] hover:[animation-play-state:paused]">
          {loop.map((client, i) => {
            const PlatformIcon = getIcon(client.platform);
            return (
              <div
                key={`${client.id}-${i}`}
                className="flex items-center gap-3 rounded-full border border-line-strong bg-white/[0.03] py-2.5 pl-2.5 pr-6 transition-colors duration-300 hover:border-accent/50"
              >
                <div
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                  style={{
                    backgroundImage: client.avatarUrl
                      ? undefined
                      : `linear-gradient(135deg, ${client.avatarPalette[0]}, ${client.avatarPalette[1]})`,
                  }}
                >
                  {client.avatarUrl ? (
                    <Image src={client.avatarUrl} alt={client.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="whitespace-nowrap font-display text-sm font-medium text-paper/90">
                    {client.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-mist">
                    <span>{client.followers}</span>
                    <span aria-hidden>·</span>
                    <PlatformIcon size={11} className="text-accent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
