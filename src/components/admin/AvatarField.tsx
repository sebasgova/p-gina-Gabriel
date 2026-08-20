"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type AvatarFieldProps = {
  name: string;
  removeName: string;
  currentUrl?: string;
  fallbackInitials: string;
  fallbackPalette: [string, string];
};

export function AvatarField({
  name,
  removeName,
  currentUrl,
  fallbackInitials,
  fallbackPalette,
}: AvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const activeUrl = previewUrl ?? (!removed ? currentUrl : undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRemoved(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemove() {
    setRemoved(true);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line-strong"
        style={{
          backgroundImage: activeUrl
            ? undefined
            : `linear-gradient(135deg, ${fallbackPalette[0]}, ${fallbackPalette[1]})`,
        }}
      >
        {activeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
            {fallbackInitials}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-full border border-line-strong px-3 py-1.5 text-xs text-mist hover:border-accent hover:text-accent"
        >
          <Upload size={12} />
          {activeUrl ? "Cambiar" : "Subir foto"}
        </button>
        {activeUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 rounded-full border border-line-strong px-3 py-1.5 text-xs text-mist hover:border-red-400 hover:text-red-400"
          >
            <X size={12} />
            Quitar
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <input type="hidden" name={removeName} value={removed ? "true" : "false"} />
    </div>
  );
}
