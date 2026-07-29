import type { NextConfig } from "next";

// GitHub Pages serves static files with no Node runtime, so the app is fully
// static-exported (see Phase 1 decision: client-side-only data sources).
// basePath/assetPrefix are only needed for a *project* page
// (username.github.io/repo-name); leave NEXT_BASE_PATH unset for a user/org
// page (username.github.io) or local dev.
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // next/image's optimizer requires a server; unavailable on static export
  },
};

export default nextConfig;
