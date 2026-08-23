"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import type { Settings } from "@/lib/types";

export function Showreel({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <section id="showreel" className="relative py-32">
      <Container>
        <SectionLabel index="02">Showreel Exclusivo</SectionLabel>
        <RevealText as="h2" text={settings.showreelTitle} className="text-balance mt-5 font-display text-[10vw] font-semibold leading-none tracking-tight sm:text-6xl" />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative mt-14 aspect-video w-full overflow-hidden rounded-[2rem] border border-line bg-black"
        >
          {settings.showreelVideoUrl ? (
            <video
              src={settings.showreelVideoUrl}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(90% 120% at 80% 20%, rgba(255,106,0,0.28), transparent 60%), linear-gradient(140deg, #0c0c0d 0%, #050505 70%)" }} />
          )}
          <div className="noise-overlay absolute inset-0 opacity-60" />

          <button onClick={() => setOpen(true)} data-cursor="hover" aria-label="Reproducir showreel completo" className="absolute inset-0 flex items-center justify-center">
            <MagneticButton strength={0.2}>
              <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:bg-accent group-hover:text-black">
                <Play size={26} className="ml-1" fill="currentColor" />
              </span>
            </MagneticButton>
          </button>

          <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-x-0 bottom-0 flex flex-col gap-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-8 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs uppercase tracking-[0.25em] text-mist">Duración</p><p className="mt-1 font-display text-lg">{settings.showreelDuration}</p></div>
            <div><p className="text-xs uppercase tracking-[0.25em] text-mist">Tipo de proyecto</p><p className="mt-1 font-display text-lg">{settings.showreelType}</p></div>
            <div><p className="text-xs uppercase tracking-[0.25em] text-mist">Software</p><p className="mt-1 font-display text-lg">{settings.showreelSoftware.join(" · ")}</p></div>
          </motion.div>
        </motion.div>
      </Container>

      <VideoLightbox open={open} onClose={() => setOpen(false)} title={settings.showreelTitle} videoUrl={settings.showreelVideoUrl} />
    </section>
  );
}
