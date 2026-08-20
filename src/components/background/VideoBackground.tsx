"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Full brightness at the very top, settles to a dimmer (but still present)
  // level after a modest scroll so copy stays readable further down the page.
  const videoOpacity = useTransform(scrollY, [0, 480], [0.95, 0.42]);
  const scrimOpacity = useTransform(scrollY, [0, 480], [0.25, 0.55]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (reduced) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
  }, [reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      <motion.video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity: reduced ? 0.5 : videoOpacity }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/background.webm" type="video/webm" />
      </motion.video>

      {/* constant base scrim so hero/nav text stays legible even at scrollY = 0 */}
      <div className="absolute inset-0 bg-ink/20" />
      <motion.div
        style={{ opacity: reduced ? 0.45 : scrimOpacity }}
        className="absolute inset-0 bg-ink"
      />
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  );
}
