import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  build: {
    // 일부러 한 파일로 번들한다. 홈서버가 Cloudflare 샌호세(SJC)를 거쳐 요청마다 ~0.5초가 걸려서,
    // 페이지를 쪼개 두면 탭을 누를 때마다 그 청크를 받으러 또 왕복하게 된다. 첫 로딩 뒤엔 탭 전환에 요청이 없다.
    chunkSizeWarningLimit: 1200,
  },
});
