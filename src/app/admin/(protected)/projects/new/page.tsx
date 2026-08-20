import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Nuevo proyecto</h1>
      <p className="mt-1 text-sm text-mist">Completa los datos y guarda para publicarlo en el sitio.</p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
