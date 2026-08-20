"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateSettingsAction } from "@/app/admin/actions";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm font-medium text-black hover:bg-accent-soft disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar ajustes"}
    </button>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  return (
    <form
      action={async (formData) => {
        await updateSettingsAction(formData);
        toast.success("Ajustes actualizados");
        router.refresh();
      }}
      className="max-w-2xl space-y-8"
    >
      <Field label="Título del Hero">
        <textarea
          name="heroHeadline"
          defaultValue={settings.heroHeadline}
          rows={2}
          className={`${inputClass} h-auto resize-y py-3`}
        />
      </Field>
      <Field label="Subtítulo del Hero">
        <textarea
          name="heroSubheadline"
          defaultValue={settings.heroSubheadline}
          rows={3}
          className={`${inputClass} h-auto resize-y py-3`}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Título del Showreel">
          <input name="showreelTitle" defaultValue={settings.showreelTitle} className={inputClass} />
        </Field>
        <Field label="Duración">
          <input
            name="showreelDuration"
            defaultValue={settings.showreelDuration}
            className={inputClass}
          />
        </Field>
        <Field label="Tipo de proyecto">
          <input name="showreelType" defaultValue={settings.showreelType} className={inputClass} />
        </Field>
      </div>

      <Field label="Software del showreel (separado por comas)">
        <input
          name="showreelSoftware"
          defaultValue={settings.showreelSoftware.join(", ")}
          className={inputClass}
        />
      </Field>

      <p className="text-xs text-mist">
        Los clientes que aparecen en la franja &quot;He trabajado con&quot; se gestionan desde{" "}
        <a href="/admin/clients" className="text-accent underline underline-offset-2">
          Clientes
        </a>
        .
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Correo de contacto">
          <input name="contactEmail" defaultValue={settings.contactEmail} className={inputClass} />
        </Field>
        <Field label="Enlace de WhatsApp">
          <input name="whatsapp" defaultValue={settings.whatsapp} className={inputClass} />
        </Field>
      </div>

      <SubmitButton />
    </form>
  );
}
