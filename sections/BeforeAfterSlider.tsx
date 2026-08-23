"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal, Pause, Play } from "lucide-react";
import type { Project } from "@/lib/types";

export function BeforeAfterSlider({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const syncingRef = useRef(false);
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, raw)));
  }, []);

  const togglePlayback = useCallback(async () => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    if (before.paused || after.paused) {
      try {
        after.currentTime = before.currentTime;
        await Promise.all([before.play(), after.play()]);
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      before.pause();
      after.pause();
      setPlaying(false);
    }
  }, []);

  const syncPause = useCallback((source: HTMLVideoElement) => {
    if (syncingRef.current) return;
    const other = source === beforeRef.current ? afterRef.current : beforeRef.current;
    if (!other) return;
    syncingRef.current = true;
    other.pause();
    setPlaying(false);
    syncingRef.current = false;
  }, []);

  const syncTime = useCallback((source: HTMLVideoElement) => {
    if (syncingRef.current) return;
    const other = source === beforeRef.current ? afterRef.current : beforeRef.current;
    if (!other || Math.abs(other.currentTime - source.currentTime) < 0.08) return;
    syncingRef.current = true;
    other.currentTime = source.currentTime;
    syncingRef.current = false;
  }, []);

  const beforeVideo = project.beforeVideoUrl;
  const afterVideo = project.afterVideoUrl;
  if (!beforeVideo || !afterVideo) return null;

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative aspect-video w-full select-none overflow-hidden rounded-3xl border border-line bg-black"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("video,button")) return;
          setDragging(true);
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <video
          ref={afterRef}
          src={afterVideo}
          preload="metadata"
          playsInline
          muted
          controls
          onPause={(e) => syncPause(e.currentTarget)}
          onTimeUpdate={(e) => syncTime(e.currentTarget)}
          onEnded={() => { beforeRef.current?.pause(); setPlaying(false); }}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
          Después
        </span>

        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
          <video
            ref={beforeRef}
            src={beforeVideo}
            preload="metadata"
            playsInline
            muted
            controls
            onPause={(e) => syncPause(e.currentTarget)}
            onTimeUpdate={(e) => syncTime(e.currentTarget)}
            onEnded={() => { afterRef.current?.pause(); setPlaying(false); }}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
            Antes
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void togglePlayback(); }}
          aria-label={playing ? "Pausar comparación" : "Reproducir comparación"}
          className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md transition hover:bg-accent hover:text-black"
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <motion.div className="pointer-events-none absolute inset-y-0 z-30 flex w-0 items-center justify-center" style={{ left: `${percent}%` }}>
          <div className="absolute inset-y-0 w-px bg-white/70" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg">
            <MoveHorizontal size={16} />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-display text-lg">{project.title}</p>
          <p className="text-xs text-mist">{project.client} · {project.category}</p>
        </div>
        {project.ctr && <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">CTR {project.ctr}</span>}
      </div>
    </div>
  );
}
