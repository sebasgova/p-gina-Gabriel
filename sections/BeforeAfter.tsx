import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import type { Project } from "@/lib/types";

export function BeforeAfter({ projects }: { projects: Project[] }) {
  const items = projects.filter((p) => p.showBeforeAfter && p.beforeVideoUrl && p.afterVideoUrl);
  if (!items.length) return null;

  return (
    <section id="antes-despues" className="relative py-32">
      <Container>
        <SectionLabel index="04">Antes / Después</SectionLabel>
        <RevealText
          as="h2"
          text="Arrastra y descubre la diferencia"
          className="text-balance mt-5 font-display text-[9vw] font-semibold leading-none tracking-tight sm:text-5xl"
        />
        <p className="mt-5 max-w-lg text-mist">
          Compara el footage original con el resultado final. Reproduce ambos videos sincronizados y arrastra el separador para revelar la transformación.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {items.map((project) => <BeforeAfterSlider key={project.id} project={project} />)}
        </div>
      </Container>
    </section>
  );
}
