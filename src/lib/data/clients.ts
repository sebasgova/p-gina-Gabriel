import "server-only";
import { readJson, writeJson } from "./store";
import type { Client } from "@/lib/types";

const FILE = "clients.json";

export async function getAllClients(): Promise<Client[]> {
  const items = await readJson<Client[]>(FILE, []);
  return [...items].sort((a, b) => a.order - b.order);
}

export async function createClient(input: Omit<Client, "id" | "order">): Promise<Client> {
  const items = await getAllClients();
  const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const order = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
  const client: Client = { ...input, id, order };
  await writeJson(FILE, [...items, client]);
  return client;
}

export async function updateClient(
  id: string,
  patch: Partial<Omit<Client, "id">>
): Promise<Client | undefined> {
  const items = await getAllClients();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...patch };
  await writeJson(FILE, items);
  return items[idx];
}

export async function deleteClient(id: string): Promise<boolean> {
  const items = await getAllClients();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await writeJson(FILE, next);
  return true;
}
