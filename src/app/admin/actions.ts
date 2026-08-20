"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  reorderProjects,
  updateProject,
} from "@/lib/data/projects";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  updateTestimonial,
} from "@/lib/data/testimonials";
import {
  createClient,
  deleteClient,
  getAllClients,
  updateClient,
} from "@/lib/data/clients";
import { updateSettings } from "@/lib/data/settings";
import { checkPassword, clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { deleteUpload, saveUploadIfPresent } from "@/lib/uploads";
import type { ClientPlatform, Project, ProjectCategory } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/settings");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string) {
  return str(formData, key)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Resolves a file field against an optional "remove" checkbox:
 * - a new file was uploaded  -> saves it (and deletes the old one), returns the new URL
 * - "remove" was requested   -> deletes the old file, returns "" (explicit clear)
 * - otherwise                -> returns the existing URL untouched
 */
async function resolveMedia(
  formData: FormData,
  fileKey: string,
  removeKey: string,
  currentUrl?: string
): Promise<string | undefined> {
  const file = formData.get(fileKey) as File | null;
  const newUrl = await saveUploadIfPresent(file);
  if (newUrl) {
    if (currentUrl) await deleteUpload(currentUrl);
    return newUrl;
  }
  if (formData.get(removeKey) === "true") {
    if (currentUrl) await deleteUpload(currentUrl);
    return "";
  }
  return currentUrl;
}

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = str(formData, "password");
  let valid = false;
  try {
    valid = checkPassword(password);
  } catch {
    return { error: "El panel admin no está configurado (falta ADMIN_PASSWORD)." };
  }
  if (!valid) {
    return { error: "Contraseña incorrecta." };
  }
  await setSessionCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function saveProjectAction(id: string | null, formData: FormData) {
  const existing = id ? await getProjectById(id) : undefined;

  const [thumbnailUrl, videoUrl, beforeImageUrl, afterImageUrl] = await Promise.all([
    resolveMedia(formData, "thumbnailFile", "removeThumbnail", existing?.thumbnailUrl),
    resolveMedia(formData, "videoFile", "removeVideo", existing?.videoUrl),
    resolveMedia(formData, "beforeImageFile", "removeBeforeImage", existing?.beforeImageUrl),
    resolveMedia(formData, "afterImageFile", "removeAfterImage", existing?.afterImageUrl),
  ]);

  const base: Omit<Project, "id" | "order" | "slug"> = {
    published: formData.get("published") === "on",
    title: str(formData, "title"),
    client: str(formData, "client"),
    category: str(formData, "category") as ProjectCategory,
    software: list(formData, "software"),
    duration: str(formData, "duration"),
    year: Number(str(formData, "year")) || new Date().getFullYear(),
    thumbnailPalette: [
      str(formData, "paletteFrom") || "#ff6a00",
      str(formData, "paletteTo") || "#0b0b0d",
    ],
    thumbnailUrl,
    videoUrl,
    beforeImageUrl,
    afterImageUrl,
    description: str(formData, "description"),
    result: str(formData, "result"),
    tools: list(formData, "tools"),
    ctr: str(formData, "ctr") || undefined,
    showBeforeAfter: formData.get("showBeforeAfter") === "on",
  };

  if (id) {
    await updateProject(id, base);
  } else {
    await createProject(base);
  }

  revalidateAll();
}

export async function deleteProjectAction(id: string) {
  const project = await getProjectById(id);
  await Promise.all([
    deleteUpload(project?.thumbnailUrl),
    deleteUpload(project?.videoUrl),
    deleteUpload(project?.beforeImageUrl),
    deleteUpload(project?.afterImageUrl),
  ]);
  await deleteProject(id);
  revalidateAll();
}

export async function toggleProjectPublishedAction(id: string, published: boolean) {
  await updateProject(id, { published });
  revalidateAll();
}

export async function moveProjectAction(id: string, direction: "up" | "down") {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= projects.length) return;
  const ids = projects.map((p) => p.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorderProjects(ids);
  revalidateAll();
}

export async function saveTestimonialAction(id: string | null, formData: FormData) {
  const testimonials = await getAllTestimonials();
  const existing = testimonials.find((t) => t.id === id);
  const avatarUrl = await resolveMedia(formData, "avatarFile", "removeAvatar", existing?.avatarUrl);

  const payload = {
    name: str(formData, "name"),
    role: str(formData, "role"),
    company: str(formData, "company"),
    quote: str(formData, "quote"),
    avatarPalette: [
      str(formData, "paletteFrom") || "#ff6a00",
      str(formData, "paletteTo") || "#1a1a1d",
    ] as [string, string],
    avatarUrl,
  };

  if (id) {
    await updateTestimonial(id, payload);
  } else {
    await createTestimonial(payload);
  }
  revalidateAll();
}

export async function deleteTestimonialAction(id: string) {
  const testimonials = await getAllTestimonials();
  const testimonial = testimonials.find((t) => t.id === id);
  await deleteUpload(testimonial?.avatarUrl);
  await deleteTestimonial(id);
  revalidateAll();
}

export async function saveClientAction(id: string | null, formData: FormData) {
  const clients = await getAllClients();
  const existing = clients.find((c) => c.id === id);

  const avatarUrl = await resolveMedia(formData, "avatarFile", "removeAvatar", existing?.avatarUrl);

  const payload = {
    name: str(formData, "name"),
    platform: str(formData, "platform") as ClientPlatform,
    followers: str(formData, "followers"),
    avatarPalette: [
      str(formData, "paletteFrom") || "#ff6a00",
      str(formData, "paletteTo") || "#1a1a1d",
    ] as [string, string],
    avatarUrl,
  };

  if (id) {
    await updateClient(id, payload);
  } else {
    await createClient(payload);
  }
  revalidateAll();
}

export async function deleteClientAction(id: string) {
  const clients = await getAllClients();
  const client = clients.find((c) => c.id === id);
  await deleteUpload(client?.avatarUrl);
  await deleteClient(id);
  revalidateAll();
}

export async function updateSettingsAction(formData: FormData) {
  await updateSettings({
    heroHeadline: str(formData, "heroHeadline"),
    heroSubheadline: str(formData, "heroSubheadline"),
    showreelTitle: str(formData, "showreelTitle"),
    showreelDuration: str(formData, "showreelDuration"),
    showreelType: str(formData, "showreelType"),
    showreelSoftware: list(formData, "showreelSoftware"),
    contactEmail: str(formData, "contactEmail"),
    whatsapp: str(formData, "whatsapp"),
  });
  revalidateAll();
}
