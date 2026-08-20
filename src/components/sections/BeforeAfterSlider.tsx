"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import type { Project } from "@/lib/types";

export function BeforeAfterSlider({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, raw)));
  }, []);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-line"
        onPointerDown={(e) => {
          setDragging(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        {/* DESPUÉS — capa completa */}
        <div className="absolute inset-0">
          {project.afterImageUrl ? (
            <Image
              src={project.afterImageUrl}
              alt={`${project.title} — después`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(60% 60% at 78% 15%, ${project.thumbnailPalette[0]}40, transparent 70%), linear-gradient(165deg, ${project.thumbnailPalette[1]} 0%, #050505 100%)`,
                filter: "saturate(1.1) contrast(1.05)",
              }}
            />
          )}
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
          Después
        </span>

        {/* ANTES — clipeado por el porcentaje */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          {project.beforeImageUrl ? (
            <Image
              src={project.beforeImageUrl}
              alt={`${project.title} — antes`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(155deg, #2a2a2a 0%, #050505 100%)`,
                filter: "grayscale(0.85) brightness(0.75) contrast(0.9)",
              }}
            />
          )}
          <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
            Antes
          </span>
        </div>

        {/* Handle */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 flex w-0 items-center justify-center"
          style={{ left: `${percent}%` }}
        >
          <div className="absolute inset-y-0 w-px bg-white/70" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg">
            <MoveHorizontal size={16} />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg">{project.title}</p>
          <p className="text-xs text-mist">
            {project.client} · {project.category}
          </p>
        </div>
        {project.ctr && (
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            CTR {project.ctr}
          </span>
        )}
      </div>
    </div>
  );
}
