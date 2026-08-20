"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { ProjectPoster } from "@/components/ui/ProjectPoster";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Project } from "@/lib/types";

function ProjectModalBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="glass-panel mx-auto w-[92%] max-w-5xl overflow-hidden rounded-[2rem]"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        data-cursor="hover"
        className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-accent hover:text-black"
      >
        <X size={18} />
      </button>

      <div className="relative aspect-video w-full">
        {playing && project.videoUrl ? (
          <video
            src={project.videoUrl}
            controls
            autoPlay
            className="h-full w-full bg-black object-cover"
          />
        ) : (
          <>
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 80vw, 100vw"
                className="object-cover"
              />
            ) : (
              <ProjectPoster
                palette={project.thumbnailPalette}
                category={project.category}
                className="absolute inset-0 h-full w-full"
              />
            )}
            <button
              onClick={() => setPlaying(true)}
              data-cursor="hover"
              aria-label="Reproducir video del proyecto"
              className="absolute inset-0 flex items-center justify-center"
            >
              <MagneticButton strength={0.2}>
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-black transition-transform hover:scale-110">
                  <Play size={22} className="ml-1" fill="currentColor" />
                </span>
              </MagneticButton>
            </button>
          </>
        )}
      </div>

      <div className="grid gap-10 p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            {project.category} · {project.client}
          </span>
          <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-5 max-w-xl text-balance leading-relaxed text-mist">
            {project.description}
          </p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Resultado</p>
            <p className="mt-2 font-display text-xl text-accent">{project.result}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton>
              <a
                href="#contacto"
                onClick={onClose}
                className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-medium text-black transition-colors hover:bg-accent-soft"
              >
                Trabajemos Juntos
              </a>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={onClose}
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-medium hover:border-accent hover:text-accent"
              >
                Cerrar
              </button>
            </MagneticButton>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Duración</p>
            <p className="mt-1 font-display text-lg">{project.duration}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Año</p>
            <p className="mt-1 font-display text-lg">{project.year}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Software</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.software.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-line-strong px-3 py-1 text-xs text-mist"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Herramientas aplicadas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-mist"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[95] overflow-y-auto bg-ink/95 backdrop-blur-lg"
          onClick={onClose}
        >
          <div className="min-h-full py-10">
            <ProjectModalBody key={project.id} project={project} onClose={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
