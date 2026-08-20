import Link from "next/link";
import { getAllProjects } from "@/lib/data/projects";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Proyectos</h1>
          <p className="mt-1 text-sm text-mist">{projects.length} proyecto(s) en total.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-black hover:bg-accent-soft"
        >
          + Nuevo proyecto
        </Link>
      </div>

      <div className="mt-8">
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
