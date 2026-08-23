"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type MediaFieldProps = {
  label: string;
  name: string;
  removeName: string;
  currentUrl?: string;
  kind: "image" | "video";
  accept: string;
  hint?: string;
};

export function MediaField({
  label,
  name,
  removeName,
  currentUrl,
  kind,
  accept,
  hint,
}: MediaFieldProps) {
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
    <div>
      <span className="text-xs uppercase tracking-wider text-mist">{label}</span>
      {hint && <p className="mt-1 text-xs text-mist-dim">{hint}</p>}

      <div className="mt-2">
        {activeUrl ? (
          <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-line-strong bg-black">
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <video
                src={activeUrl}
                className="h-full w-full object-contain bg-black"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/60 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-black"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 rounded-full bg-red-500/90 px-4 py-2 text-xs font-medium text-white"
              >
                <X size={13} />
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong text-mist transition-colors hover:border-accent hover:text-accent"
          >
            <Upload size={18} />
            <span className="text-xs">Subir archivo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <input type="hidden" name={removeName} value={removed ? "true" : "false"} />
    </div>
  );
}
