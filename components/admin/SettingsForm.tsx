"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSettingsAction } from "@/app/admin/actions";
import { MediaField } from "./MediaField";
import type { Settings } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-white/[0.03] px-4 text-sm outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-mist">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || uploading;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-medium text-black hover:bg-accent-soft disabled:opacity-60"
    >
      {uploading ? "Subiendo archivo…" : pending ? "Guardando…" : "Guardar ajustes"}
    </button>
  );
}

async function uploadFile(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body: data });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) throw new Error(result.error || "No se pudo subir el archivo.");
  return result.url;
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  return (
    <form
      action={async (formData) => {
        if (uploading) return;
        setUploading(true);
        try {
          const file = formData.get("showreelVideoFile");
          if (file instanceof File && file.size > 0) {
            const url = await uploadFile(file);
            formData.delete("showreelVideoFile");
            formData.set("showreelVideoUrl", url);
          }
          await updateSettingsAction(formData);
          toast.success("Ajustes actualizados");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "No se pudieron guardar los ajustes.");
        } finally {
          setUploading(false);
        }
      }}
      className="max-w-2xl space-y-8"
    >
      <Field label="Título del Hero">
        <textarea name="heroHeadline" defaultValue={settings.heroHeadline} rows={2} className={`${inputClass} h-auto resize-y py-3`} />
      </Field>
      <Field label="Subtítulo del Hero">
        <textarea name="heroSubheadline" defaultValue={settings.heroSubheadline} rows={3} className={`${inputClass} h-auto resize-y py-3`} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Título del Showreel">
          <input name="showreelTitle" defaultValue={settings.showreelTitle} className={inputClass} />
        </Field>
        <Field label="Duración">
          <input name="showreelDuration" defaultValue={settings.showreelDuration} className={inputClass} />
        </Field>
        <Field label="Tipo de proyecto">
          <input name="showreelType" defaultValue={settings.showreelType} className={inputClass} />
        </Field>
      </div>

      <Field label="Software del showreel (separado por comas)">
        <input name="showreelSoftware" defaultValue={settings.showreelSoftware.join(", ")} className={inputClass} />
      </Field>

      <MediaField
        label="Video del Showreel"
        hint="Sube el showreel que aparecerá en la sección principal. El cliente deberá pulsar Play para reproducirlo."
        name="showreelVideoFile"
        removeName="removeShowreelVideo"
        currentUrl={settings.showreelVideoUrl}
        kind="video"
        accept="video/*"
      />

      <p className="text-xs text-mist">
        Los clientes que aparecen en la franja &quot;He trabajado con&quot; se gestionan desde{" "}
        <a href="/admin/clients" className="text-accent underline underline-offset-2">Clientes</a>.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Correo de contacto">
          <input name="contactEmail" defaultValue={settings.contactEmail} className={inputClass} />
        </Field>
        <Field label="Enlace de WhatsApp">
          <input name="whatsapp" defaultValue={settings.whatsapp} className={inputClass} />
        </Field>
      </div>

      <SubmitButton uploading={uploading} />
    </form>
  );
}
