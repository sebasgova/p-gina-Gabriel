"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="proyectos" className="relative py-32">
      <Container>
        <SectionLabel index="03">Trabajo Seleccionado</SectionLabel>
        <RevealText
          as="h2"
          text="Proyectos que dejan huella"
          className="text-balance mt-5 font-display text-[10vw] font-semibold leading-none tracking-tight sm:text-6xl"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <div key={project.id} className={i % 3 === 0 ? "md:col-span-2" : ""}>
              <ProjectCard
                project={project}
                tall={i % 3 !== 0}
                onOpen={() => setSelected(project)}
              />
            </div>
          ))}
        </div>
      </Container>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
