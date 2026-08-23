import "server-only";

import path from "path";

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "videos";

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl) throw new Error("Falta SUPABASE_URL en las variables de Railway.");
  if (!apiKey) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de Railway.");

  return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), apiKey };
}

function safeExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return ext || "";
}

function safeBase(filename: string) {
  return (
    path
      .basename(filename, path.extname(filename))
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "file"
  );
}

function encodePath(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

/** Upload directly to Storage's HTTP API using the new secret key as `apikey`. */
export async function saveUpload(file: File): Promise<string> {
  const { supabaseUrl, apiKey } = getStorageConfig();
  const ext = safeExtension(file.name);
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${safeBase(file.name)}${ext}`;
  const objectPath = `portfolio/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(STORAGE_BUCKET)}/${encodePath(objectPath)}`,
    {
      method: "POST",
      headers: {
        apikey: apiKey,
        "Content-Type": file.type || "application/octet-stream",
        "Cache-Control": "31536000",
        "x-upsert": "false",
      },
      body: buffer,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase Storage upload failed (${response.status}): ${body}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(STORAGE_BUCKET)}/${encodePath(objectPath)}`;
}

export async function saveUploadIfPresent(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  return saveUpload(file);
}

export async function deleteUpload(url: string | undefined | null): Promise<void> {
  if (!url) return;

  try {
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = url.indexOf(marker);
    if (markerIndex === -1) return;

    const objectPath = decodeURIComponent(url.slice(markerIndex + marker.length));
    if (!objectPath || objectPath.includes("..")) return;

    const { supabaseUrl, apiKey } = getStorageConfig();
    await fetch(
      `${supabaseUrl}/storage/v1/object/${encodeURIComponent(STORAGE_BUCKET)}/${encodePath(objectPath)}`,
      {
        method: "DELETE",
        headers: { apikey: apiKey },
        cache: "no-store",
      }
    );
  } catch {
    // A missing/old file should not prevent saving the project.
  }
}
