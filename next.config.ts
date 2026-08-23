import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "900mb", // Ajusta aquí el peso máximo permitido (ej: 10mb, 20mb)
    },
  },
};

export default nextConfig;