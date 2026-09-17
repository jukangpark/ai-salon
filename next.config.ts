import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 홈서버 Docker 배포용 정적 export (out/ → nginx:alpine 서빙)
  output: "export",
};

export default nextConfig;
