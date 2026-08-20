"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { getIcon } from "@/lib/icons";
import type { Settings } from "@/lib/types";

export function Services({ services }: { services: Settings["services"] }) {
  return (
    <section id="servicios" className="relative py-32">
      <Container>
        <SectionLabel index="05">Servicios</SectionLabel>
        <RevealText
          as="h2"
          text="Cómo puedo ayudarte"
          className="text-balance mt-5 font-display text-[9vw] font-semibold leading-none tracking-tight sm:text-5xl"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-2xl border border-line bg-white/[0.02] p-6 transition-all duration-400 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong text-accent transition-colors group-hover:border-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
