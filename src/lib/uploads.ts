import "server-only";

import path from "path";
import { getSupabaseAdmin, STORAGE_BUCKET } from "./supabaseAdmin";

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

export async function saveUpload(file: File): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();
  const ext = safeExtension(file.name);
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${safeBase(file.name)}${ext}`;
  const objectPath = `portfolio/${name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(objectPath);

  return data.publicUrl;
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

    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([objectPath]);
  } catch {
    // A missing/old file should not prevent saving the project.
  }
}
