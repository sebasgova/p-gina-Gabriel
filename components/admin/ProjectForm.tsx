"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveProjectAction } from "@/app/admin/actions";
import { MediaField } from "./MediaField";
import type { Project, ProjectCategory } from "@/lib/types";

const CATEGORIES: ProjectCategory[] = ["Motion Graphics", "VFX", "Color Grading", "Short Form", "Long Form", "Ads", "YouTube"];
const inputClass = "h-11 w-full rounded-xl border border-line-strong bg-white/[0.03] px-4 text-sm outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-mist">{label}</span><div className="mt-2">{children}</div></label>;
}

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || uploading;
  return <button type="submit" disabled={disabled} className="inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-medium text-black hover:bg-accent-soft disabled:opacity-60">{uploading ? "Subiendo archivos…" : pending ? "Guardando…" : "Guardar proyecto"}</button>;
}

async function uploadFile(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body: data });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) throw new Error(result.error || "No se pudo subir el archivo.");
  return result.url;
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const boundAction = saveProjectAction.bind(null, project?.id ?? null);

  return (
    <form
      action={async (formData) => {
        if (uploading) return;
        setUploading(true);
        try {
          const fileKeys = ["thumbnailFile", "videoFile", "beforeVideoFile", "afterVideoFile"];
          const urlKeys = ["thumbnailUrl", "videoUrl", "beforeVideoUrl", "afterVideoUrl"];
          const uploads = await Promise.all(fileKeys.map((key) => {
            const value = formData.get(key);
            return value instanceof File && value.size > 0 ? uploadFile(value) : Promise.resolve("");
          }));
          fileKeys.forEach((key) => formData.delete(key));
          uploads.forEach((url, index) => { if (url) formData.set(urlKeys[index], url); });
          await boundAction(formData);
          toast.success(project ? "Proyecto actualizado" : "Proyecto creado");
          router.push("/admin/projects");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "No se pudo guardar el proyecto.");
        } finally {
          setUploading(false);
        }
      }}
      className="max-w-3xl space-y-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Título"><input name="title" defaultValue={project?.title} required className={inputClass} /></Field>
        <Field label="Cliente"><input name="client" defaultValue={project?.client} required className={inputClass} /></Field>
        <Field label="Categoría">
          <select name="category" defaultValue={project?.category ?? CATEGORIES[0]} className={inputClass}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </Field>
        <Field label="Duración (ej. 1:20)"><input name="duration" defaultValue={project?.duration} required className={inputClass} /></Field>
        <Field label="Año"><input type="number" name="year" defaultValue={project?.year ?? new Date().getFullYear()} className={inputClass} /></Field>
        <Field label="CTR / métrica destacada (opcional)"><input name="ctr" defaultValue={project?.ctr} className={inputClass} /></Field>
      </div>

      <Field label="Software utilizado (separado por comas)"><input name="software" defaultValue={project?.software.join(", ")} placeholder="After Effects, DaVinci Resolve" className={inputClass} /></Field>
      <Field label="Herramientas / disciplinas aplicadas (separado por comas)"><input name="tools" defaultValue={project?.tools.join(", ")} placeholder="Edición, Motion Graphics, Color Grading" className={inputClass} /></Field>
      <Field label="Descripción"><textarea name="description" defaultValue={project?.description} rows={4} required className={`${inputClass} h-auto resize-y py-3`} /></Field>
      <Field label="Resultado / impacto"><textarea name="result" defaultValue={project?.result} rows={2} className={`${inputClass} h-auto resize-y py-3`} /></Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Color de acento (miniatura)"><input type="color" name="paletteFrom" defaultValue={project?.thumbnailPalette?.[0] ?? "#ff6a00"} className="h-11 w-full rounded-xl border border-line-strong bg-white/[0.03] px-2" /></Field>
        <Field label="Color base (miniatura)"><input type="color" name="paletteTo" defaultValue={project?.thumbnailPalette?.[1] ?? "#0b0b0d"} className="h-11 w-full rounded-xl border border-line-strong bg-white/[0.03] px-2" /></Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MediaField label="Miniatura" hint="Imagen fija que representa el proyecto." name="thumbnailFile" removeName="removeThumbnail" currentUrl={project?.thumbnailUrl} kind="image" accept="image/*" />
        <MediaField label="Video del proyecto" hint="Se abrirá al seleccionar el proyecto. El cliente pulsa Play/Pause." name="videoFile" removeName="removeVideo" currentUrl={project?.videoUrl} kind="video" accept="video/*" />
      </div>

      <div className="rounded-3xl border border-line p-6">
        <div>
          <p className="font-display text-xl">Antes / Después — Video</p>
          <p className="mt-1 text-sm text-mist">Sube dos videos independientes. En la web se mostrarán sincronizados mediante un slider horizontal.</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <MediaField label="Video Antes" hint="Footage original / sin editar." name="beforeVideoFile" removeName="removeBeforeVideo" currentUrl={project?.beforeVideoUrl} kind="video" accept="video/*" />
          <MediaField label="Video Después" hint="Resultado final editado." name="afterVideoFile" removeName="removeAfterVideo" currentUrl={project?.afterVideoUrl} kind="video" accept="video/*" />
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4 accent-[#ff6a00]" />Publicado (visible en el sitio)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="showBeforeAfter" defaultChecked={project?.showBeforeAfter ?? false} className="h-4 w-4 accent-[#ff6a00]" />Mostrar en sección Antes/Después</label>
      </div>

      <SubmitButton uploading={uploading} />
    </form>
  );
}
