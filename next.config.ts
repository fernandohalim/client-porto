import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: about a third smaller than WebP for these photographs
    formats: ["image/avif", "image/webp"],
    // pictures are swapped by filename, never in place, so they can be kept a long time
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
