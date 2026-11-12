import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/vagas_list.php", destination: "/", permanent: true }];
  },
  experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS || 2) },
};
export default config;
