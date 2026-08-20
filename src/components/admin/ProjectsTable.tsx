"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  deleteProjectAction,
  moveProjectAction,
  toggleProjectPublishedAction,
} from "@/app/admin/actions";
import type { Project } from "@/lib/types";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(project: Project) {
    if (!confirm(`¿Eliminar "${project.title}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteProjectAction(project.id);
      toast.success("Proyecto eliminado");
    });
  }

  function handleToggle(project: Project) {
    startTransition(async () => {
      await toggleProjectPublishedAction(project.id, !project.published);
      toast.success(project.published ? "Proyecto oculto" : "Proyecto publicado");
    });
  }

  function handleMove(project: Project, direction: "up" | "down") {
    startTransition(async () => {
      await moveProjectAction(project.id, direction);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-mist">
          <tr>
            <th className="px-4 py-3">Orden</th>
            <th className="px-4 py-3">Proyecto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, i) => (
            <tr key={project.id} className="border-t border-line">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    disabled={isPending || i === 0}
                    onClick={() => handleMove(project, "up")}
                    className="rounded-md p-1 text-mist hover:text-accent disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={isPending || i === projects.length - 1}
                    onClick={() => handleMove(project, "down")}
                    className="rounded-md p-1 text-mist hover:text-accent disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{project.title}</td>
              <td className="px-4 py-3 text-mist">{project.category}</td>
              <td className="px-4 py-3 text-mist">{project.client}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggle(project)}
                  disabled={isPending}
                  className={
                    project.published
                      ? "inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                      : "inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-mist"
                  }
                >
                  {project.published ? <Eye size={12} /> : <EyeOff size={12} />}
                  {project.published ? "Publicado" : "Oculto"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-md p-2 text-mist hover:bg-white/[0.05] hover:text-paper"
                    aria-label="Editar"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={isPending}
                    className="rounded-md p-2 text-mist hover:bg-white/[0.05] hover:text-red-400"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-mist">
                No hay proyectos todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
