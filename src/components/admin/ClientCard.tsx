"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteClientAction, saveClientAction } from "@/app/admin/actions";
import { AvatarField } from "./AvatarField";
import { PLATFORMS } from "@/lib/icons";
import type { Client } from "@/lib/types";

const inputClass =
  "h-10 w-full rounded-lg border border-line-strong bg-white/[0.03] px-3 text-sm outline-none focus:border-accent";

export function ClientCard({ client }: { client?: Client }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const action = saveClientAction.bind(null, client?.id ?? null);

  function handleDelete() {
    if (!client) return;
    if (!confirm(`¿Eliminar a ${client.name}?`)) return;
    startTransition(async () => {
      await deleteClientAction(client.id);
      toast.success("Cliente eliminado");
      router.refresh();
    });
  }

  return (
    <form
      action={async (formData) => {
        await action(formData);
        toast.success(client ? "Cliente actualizado" : "Cliente agregado");
        router.refresh();
      }}
      className="rounded-2xl border border-line bg-white/[0.02] p-5"
    >
      <div className="flex flex-wrap items-center gap-4">
        <AvatarField
          name="avatarFile"
          removeName="removeAvatar"
          currentUrl={client?.avatarUrl}
          fallbackInitials={(client?.name ?? "?")
            .split(" ")
            .map((n) => n[0])
            .join("")}
          fallbackPalette={client?.avatarPalette ?? ["#ff6a00", "#1a1a1d"]}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="color"
            name="paletteFrom"
            defaultValue={client?.avatarPalette?.[0] ?? "#ff6a00"}
            title="Color del avatar (si no hay foto)"
            className="h-9 w-16 rounded-lg border border-line-strong bg-white/[0.03]"
          />
          <input
            type="color"
            name="paletteTo"
            defaultValue={client?.avatarPalette?.[1] ?? "#1a1a1d"}
            title="Color del avatar (si no hay foto)"
            className="h-9 w-16 rounded-lg border border-line-strong bg-white/[0.03]"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input name="name" defaultValue={client?.name} placeholder="Nombre" required className={inputClass} />
        <select name="platform" defaultValue={client?.platform ?? PLATFORMS[0]} className={inputClass}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          name="followers"
          defaultValue={client?.followers}
          placeholder="Seguidores (ej. 1.9M)"
          required
          className={inputClass}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-xs font-medium text-black hover:bg-accent-soft disabled:opacity-60"
        >
          {client ? "Guardar cambios" : "Agregar cliente"}
        </button>
        {client && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-xs text-mist hover:border-red-400 hover:text-red-400"
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
