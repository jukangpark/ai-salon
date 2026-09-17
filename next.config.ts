import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 홈서버 Docker 배포용 standalone 빌드 (.next/standalone/server.js → node 런타임)
  // /members/[userId] 같은 동적 라우트 때문에 정적 export 는 못 쓴다.
  output: "standalone",
};

export default nextConfig;
