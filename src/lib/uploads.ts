import "server-only";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return ext || "";
}

export async function saveUpload(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = safeExtension(file.name);
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
  return `/api/uploads/${name}`;
}

export async function saveUploadIfPresent(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  return saveUpload(file);
}

/** Deletes a previously uploaded file given its public `/api/uploads/...` or `/uploads/...` URL. Safe no-op for anything else. */
export async function deleteUpload(url: string | undefined | null): Promise<void> {
  if (!url) return;
  if (!url.startsWith("/api/uploads/") && !url.startsWith("/uploads/")) return;
  const filename = path.basename(url);
  if (!filename || filename.includes("..")) return;
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // already gone — fine.
  }
}