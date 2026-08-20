import "server-only";
import { readJson, writeJson } from "./store";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";

const FILE = "projects.json";

export async function getAllProjects(): Promise<Project[]> {
  const projects = await readJson<Project[]>(FILE, []);
  return [...projects].sort((a, b) => a.order - b.order);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.published);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === id);
}

export async function createProject(
  input: Omit<Project, "id" | "order" | "slug"> & { slug?: string }
): Promise<Project> {
  const projects = await getAllProjects();
  const id = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const order = projects.length ? Math.max(...projects.map((p) => p.order)) + 1 : 1;
  const project: Project = { ...input, id, slug, order };
  const next = [...projects, project];
  await writeJson(FILE, next);
  return project;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, "id">>
): Promise<Project | undefined> {
  const projects = await getAllProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: Project = {
    ...projects[idx],
    ...patch,
    slug: patch.title && !patch.slug ? slugify(patch.title) : patch.slug ?? projects[idx].slug,
  };
  projects[idx] = updated;
  await writeJson(FILE, projects);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getAllProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) return false;
  await writeJson(FILE, next);
  return true;
}

export async function reorderProjects(orderedIds: string[]): Promise<Project[]> {
  const projects = await getAllProjects();
  const byId = new Map(projects.map((p) => [p.id, p]));
  const next = orderedIds
    .map((id, index) => {
      const project = byId.get(id);
      if (!project) return undefined;
      return { ...project, order: index + 1 };
    })
    .filter((p): p is Project => Boolean(p));
  await writeJson(FILE, next);
  return next;
}
