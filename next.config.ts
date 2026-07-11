import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  reactStrictMode: false,
  // allowedDevOrigins: ['172.22.112.1', '*.local-origin.dev'],
};


export default withNextVideo(nextConfig);