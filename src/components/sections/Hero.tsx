"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroVideoCard } from "./HeroVideoCard";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import type { Settings } from "@/lib/types";

export function Hero({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="hero" className="relative flex min-h-screen items-center pb-24 pt-36">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <SectionLabel index="01">
              Video Editor · Motion Designer · VFX Artist
            </SectionLabel>

            <RevealText
              as="h1"
              text={settings.heroHeadline}
              className="text-balance mt-6 font-display text-[13vw] font-semibold leading-[0.98] tracking-tight sm:text-[8vw] lg:text-[4.4vw]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-lg text-balance text-lg leading-relaxed text-mist"
            >
              {settings.heroSubheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <a
                  href="#proyectos"
                  className="inline-flex h-13 items-center rounded-full bg-accent px-7 text-sm font-medium text-black transition-colors hover:bg-accent-soft"
                >
                  Ver Portfolio
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contacto"
                  className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
                >
                  Trabajemos Juntos
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          <HeroVideoCard onOpen={() => setOpen(true)} />
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden flex-col items-center gap-2 text-mist-dim md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>

      <VideoLightbox open={open} onClose={() => setOpen(false)} title={settings.showreelTitle} />
    </section>
  );
}
