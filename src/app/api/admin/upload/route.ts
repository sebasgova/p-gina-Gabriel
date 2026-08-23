import { NextResponse } from "next/server";
import { getIsAuthenticated } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!(await getIsAuthenticated())) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite actual de 50 MB del bucket de Supabase." },
        { status: 413 }
      );
    }

    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al subir el archivo.";
    console.error("[admin/upload]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
