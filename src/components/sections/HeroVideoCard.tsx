"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroVideoCard({
  onOpen,
  label = "Showreel 2026",
}: {
  onOpen: () => void;
  label?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass-panel group relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] transition-shadow duration-500 md:max-w-none"
      style={{
        boxShadow: hovered
          ? "0 40px 100px -30px rgba(255,106,0,0.55), 0 0 0 1px rgba(255,106,0,0.35)"
          : "0 30px 80px -30px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="absolute inset-0 opacity-90 transition-transform duration-[1200ms] ease-out"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          backgroundImage:
            "radial-gradient(120% 100% at 15% 0%, rgba(255,106,0,0.35), transparent 55%), linear-gradient(160deg, #17100a 0%, #050505 65%)",
        }}
      />
      <div className="noise-overlay absolute inset-0" />

      <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
        {label}
      </div>

      <button
        onClick={onOpen}
        data-cursor="hover"
        aria-label="Reproducir showreel"
        className="absolute inset-0 flex items-center justify-center"
      >
        <MagneticButton strength={0.25}>
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-black transition-transform duration-500 group-hover:scale-110"
            style={{
              boxShadow: hovered ? "0 0 50px rgba(255,106,0,0.55)" : "0 0 0 rgba(0,0,0,0)",
            }}
          >
            <Play size={22} className="ml-1" fill="currentColor" />
          </span>
        </MagneticButton>
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-5">
        <span className="text-xs text-white/60">Reel de compilación</span>
        <span className="text-xs text-white/60">1:48</span>
      </div>
    </motion.div>
  );
}
