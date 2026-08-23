"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ProjectPoster } from "@/components/ui/ProjectPoster";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, onOpen, tall = false }: { project: Project; onOpen: () => void; tall?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMove}
      data-cursor="hover"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full overflow-hidden rounded-3xl border border-line bg-black text-left transition-shadow duration-500 hover:border-accent/50 ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
      style={{ boxShadow: hovered ? "0 30px 80px -30px rgba(255,106,0,0.4), 0 0 0 1px rgba(255,106,0,0.25)" : "0 20px 50px -30px rgba(0,0,0,0.5)" }}
    >
      {project.videoUrl ? (
        <video src={project.videoUrl} muted playsInline preload="metadata" aria-label={project.title} className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
      ) : project.thumbnailUrl ? (
        <Image src={project.thumbnailUrl} alt={project.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
      ) : (
        <ProjectPoster palette={project.thumbnailPalette} category={project.category} className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute left-6 top-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">{project.category}</span>
        {project.videoUrl && <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">Video · Click to play</span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-2xl font-semibold text-white">{project.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60"><span>{project.client}</span><span aria-hidden>·</span><span>{project.duration}</span><span aria-hidden>·</span><span>{project.software.slice(0, 2).join(", ")}</span></div>
      </div>
      <motion.div aria-hidden style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }} transition={{ duration: 0.25 }} className="pointer-events-none absolute left-0 top-0 hidden items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-black md:flex">Ver proyecto</motion.div>
    </motion.button>
  );
}
