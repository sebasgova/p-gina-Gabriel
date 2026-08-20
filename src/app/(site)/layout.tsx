import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/providers/ScrollProgressBar";
import { VideoBackground } from "@/components/background/VideoBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/data/settings";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default: "Gabriel Mendoza — Video Editor & Motion Designer",
    template: "%s — Gabriel Mendoza",
  },
  description:
    "Video Editor, Motion Graphics Designer y VFX Artist. Transformo ideas en experiencias visuales cinematográficas que capturan atención y convierten.",
  keywords: [
    "video editor",
    "motion graphics",
    "vfx artist",
    "editor de video",
    "color grading",
    "portfolio",
  ],
  openGraph: {
    title: "Gabriel Mendoza — Video Editor & Motion Designer",
    description:
      "Transformo ideas en experiencias visuales cinematográficas que capturan atención y convierten.",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel Mendoza — Video Editor & Motion Designer",
    description:
      "Transformo ideas en experiencias visuales cinematográficas que capturan atención y convierten.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="es" className={`${sans.variable} h-full`}>
      <body className="min-h-full antialiased selection:bg-accent selection:text-black">
        <SmoothScrollProvider>
          <VideoBackground />
          <ScrollProgressBar />
          <div className="relative z-10 flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} />
          </div>
        </SmoothScrollProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
