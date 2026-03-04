/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid bundling pdf-parse/pdfjs-dist into route chunks; load them with Node instead.
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist"],
  },
};

export default nextConfig;
