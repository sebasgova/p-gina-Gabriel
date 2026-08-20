import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Editar proyecto</h1>
      <p className="mt-1 text-sm text-mist">{project.title}</p>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
