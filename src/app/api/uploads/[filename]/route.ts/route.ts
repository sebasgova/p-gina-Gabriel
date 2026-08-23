import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  let contentType = "application/octet-stream";
  if (filename.endsWith(".mp4")) contentType = "video/mp4";
  else if (filename.endsWith(".webm")) contentType = "video/webm";
  else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
  else if (filename.endsWith(".png")) contentType = "image/png";
  else if (filename.endsWith(".webp")) contentType = "image/webp";

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize.toString(),
      "Content-Type": contentType,
    };

    return new NextResponse(file as any, { status: 206, headers });
  }

  const file = fs.createReadStream(filePath);
  return new NextResponse(file as any, {
    headers: {
      "Content-Length": fileSize.toString(),
      "Content-Type": contentType,
    },
  });
}