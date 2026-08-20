import { getPublishedProjects } from "@/lib/data/projects";
import { getAllTestimonials } from "@/lib/data/testimonials";
import { getAllClients } from "@/lib/data/clients";
import { getSettings } from "@/lib/data/settings";
import { Hero } from "@/components/sections/Hero";
import { Showreel } from "@/components/sections/Showreel";
import { Projects } from "@/components/sections/Projects";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Services } from "@/components/sections/Services";
import { ClientsMarquee } from "@/components/sections/ClientsMarquee";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function Home() {
  const [projects, testimonials, clients, settings] = await Promise.all([
    getPublishedProjects(),
    getAllTestimonials(),
    getAllClients(),
    getSettings(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Gabriel Mendoza — Video Editor & Motion Designer",
    description: settings.heroSubheadline,
    email: settings.contactEmail,
    sameAs: settings.socials.map((s) => s.href),
    makesOffer: settings.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.description },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero settings={settings} />
      <Showreel settings={settings} />
      <Projects projects={projects} />
      <BeforeAfter projects={projects} />
      <Services services={settings.services} />
      <ClientsMarquee clients={clients} />
      <Stats stats={settings.stats} />
      <Testimonials testimonials={testimonials} />
      <FinalCta settings={settings} />
    </>
  );
}
