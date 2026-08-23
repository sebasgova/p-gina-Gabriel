import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Legacy upload URLs are no longer served from Railway. Media is stored in Supabase Storage." },
    { status: 410 }
  );
}
