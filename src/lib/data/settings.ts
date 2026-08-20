import "server-only";
import { readJson, writeJson } from "./store";
import type { Settings } from "@/lib/types";

const FILE = "settings.json";

const FALLBACK: Settings = {
  heroHeadline: "Transformo ideas en experiencias visuales que capturan atención.",
  heroSubheadline: "Video Editor y Motion Designer.",
  showreelTitle: "Showreel",
  showreelDuration: "1:00",
  showreelType: "Reel de Compilación",
  showreelSoftware: [],
  stats: [],
  services: [],
  socials: [],
  contactEmail: "hola@tudominio.com",
  whatsapp: "",
};

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>(FILE, FALLBACK);
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await writeJson(FILE, next);
  return next;
}
