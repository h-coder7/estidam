import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: "export",
  // basePath: "",
  // assetPrefix: "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.inspire-sa.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);