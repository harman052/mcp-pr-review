import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* disable strict mode to restrict LLM from generating two responses  */
  reactStrictMode: false,
};

export default nextConfig;
