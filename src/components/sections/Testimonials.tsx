"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonios" className="relative py-32">
      <Container>
        <SectionLabel index="07">Testimonios</SectionLabel>
        <RevealText
          as="h2"
          text="Lo que dicen los clientes"
          className="text-balance mt-5 font-display text-[9vw] font-semibold leading-none tracking-tight sm:text-5xl"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="glass-panel rounded-3xl p-8"
            >
              <Quote className="text-accent" size={22} />
              <p className="mt-5 text-balance text-lg leading-relaxed text-paper/90">
                “{t.quote}”
              </p>
              <div className="mt-7 flex items-center gap-3">
                {t.avatarUrl ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.avatarUrl} alt={t.name} fill sizes="44px" className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${t.avatarPalette[0]}, ${t.avatarPalette[1]})`,
                    }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-paper">{t.name}</p>
                  <p className="text-xs text-mist">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
