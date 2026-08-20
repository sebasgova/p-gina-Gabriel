import Link from "next/link";
import { getAllProjects } from "@/lib/data/projects";
import { getAllTestimonials } from "@/lib/data/testimonials";
import { getAllClients } from "@/lib/data/clients";

export default async function AdminDashboard() {
  const [projects, testimonials, clients] = await Promise.all([
    getAllProjects(),
    getAllTestimonials(),
    getAllClients(),
  ]);
  const published = projects.filter((p) => p.published).length;

  const cards = [
    { label: "Proyectos totales", value: projects.length },
    { label: "Publicados", value: published },
    { label: "Clientes", value: clients.length },
    { label: "Testimonios", value: testimonials.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-mist">
        Gestiona tu portfolio sin tocar código. Los cambios se reflejan al instante en el sitio.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-white/[0.02] p-5">
            <p className="text-3xl font-semibold">{card.value}</p>
            <p className="mt-1 text-sm text-mist">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-black hover:bg-accent-soft"
        >
          + Nuevo proyecto
        </Link>
        <Link
          href="/admin/projects"
          className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-sm font-medium hover:border-accent hover:text-accent"
        >
          Gestionar proyectos
        </Link>
      </div>
    </div>
  );
}
