"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RevealText } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Settings } from "@/lib/types";

export function FinalCta({ settings }: { settings: Settings }) {
  return (
    <section
      id="contacto"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-32 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 50%, rgba(255,106,0,0.16), transparent 70%)",
        }}
      />

      <Container className="relative">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          Disponible para nuevos proyectos
        </span>

        <RevealText
          as="h2"
          text="¿Listo para crear algo increíble?"
          className="text-balance mx-auto mt-6 flex justify-center font-display text-[11vw] font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-8 max-w-md text-balance text-mist"
        >
          Cuéntame sobre tu proyecto y construyamos juntos algo que se sienta memorable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-black transition-colors hover:bg-accent-soft"
            >
              <Mail size={16} />
              Trabajemos Juntos
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-line-strong px-8 text-sm font-medium hover:border-accent hover:text-accent"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </MagneticButton>
        </motion.div>
      </Container>
    </section>
  );
}
