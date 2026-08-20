import "server-only";
import { readJson, writeJson } from "./store";
import type { Testimonial } from "@/lib/types";

const FILE = "testimonials.json";

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const items = await readJson<Testimonial[]>(FILE, []);
  return [...items].sort((a, b) => a.order - b.order);
}

export async function createTestimonial(
  input: Omit<Testimonial, "id" | "order">
): Promise<Testimonial> {
  const items = await getAllTestimonials();
  const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const order = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
  const testimonial: Testimonial = { ...input, id, order };
  await writeJson(FILE, [...items, testimonial]);
  return testimonial;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Omit<Testimonial, "id">>
): Promise<Testimonial | undefined> {
  const items = await getAllTestimonials();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...patch };
  await writeJson(FILE, items);
  return items[idx];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const items = await getAllTestimonials();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeJson(FILE, next);
  return true;
}
