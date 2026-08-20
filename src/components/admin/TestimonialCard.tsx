"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteTestimonialAction, saveTestimonialAction } from "@/app/admin/actions";
import { AvatarField } from "./AvatarField";
import type { Testimonial } from "@/lib/types";

const inputClass =
  "h-10 w-full rounded-lg border border-line-strong bg-white/[0.03] px-3 text-sm outline-none focus:border-accent";

export function TestimonialCard({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const action = saveTestimonialAction.bind(null, testimonial?.id ?? null);

  function handleDelete() {
    if (!testimonial) return;
    if (!confirm(`¿Eliminar el testimonio de ${testimonial.name}?`)) return;
    startTransition(async () => {
      await deleteTestimonialAction(testimonial.id);
      toast.success("Testimonio eliminado");
      router.refresh();
    });
  }

  return (
    <form
      action={async (formData) => {
        await action(formData);
        toast.success(testimonial ? "Testimonio actualizado" : "Testimonio agregado");
        router.refresh();
      }}
      className="rounded-2xl border border-line bg-white/[0.02] p-5"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="name" defaultValue={testimonial?.name} placeholder="Nombre" required className={inputClass} />
        <input name="role" defaultValue={testimonial?.role} placeholder="Cargo" className={inputClass} />
        <input
          name="company"
          defaultValue={testimonial?.company}
          placeholder="Empresa"
          className={inputClass}
        />
      </div>
      <textarea
        name="quote"
        defaultValue={testimonial?.quote}
        placeholder="Testimonio"
        rows={2}
        required
        className={`${inputClass} mt-3 h-auto resize-y py-2`}
      />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <AvatarField
          name="avatarFile"
          removeName="removeAvatar"
          currentUrl={testimonial?.avatarUrl}
          fallbackInitials={(testimonial?.name ?? "?")
            .split(" ")
            .map((n) => n[0])
            .join("")}
          fallbackPalette={testimonial?.avatarPalette ?? ["#ff6a00", "#1a1a1d"]}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="color"
            name="paletteFrom"
            defaultValue={testimonial?.avatarPalette?.[0] ?? "#ff6a00"}
            title="Color del avatar (si no hay foto)"
            className="h-9 w-16 rounded-lg border border-line-strong bg-white/[0.03]"
          />
          <input
            type="color"
            name="paletteTo"
            defaultValue={testimonial?.avatarPalette?.[1] ?? "#1a1a1d"}
            title="Color del avatar (si no hay foto)"
            className="h-9 w-16 rounded-lg border border-line-strong bg-white/[0.03]"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-xs font-medium text-black hover:bg-accent-soft disabled:opacity-60"
        >
          {testimonial ? "Guardar cambios" : "Agregar testimonio"}
        </button>
        {testimonial && (
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
