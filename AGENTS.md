# 스택

React + Vite 로 만든 SPA 다 (Next.js 에서 옮겨왔다). 라우팅은 `react-router` v7, 라우트 목록은 `src/main.tsx`.

- 페이지: `src/pages/`. 데이터는 전부 브라우저에서 살롱봇 API(no-more.app)를 직접 부른다 (`src/lib/api.ts`, `src/lib/members.ts`).
- 운영: `npm run build` → `dist/`, `server.mjs`(Express)가 서빙하고 모르는 경로는 `index.html` 로 돌려준다.
- 번들은 일부러 한 파일이다 (`vite.config.ts` 주석 참고). 홈서버가 Cloudflare 샌호세를 거쳐 요청마다 ~0.5초라, 페이지를 쪼개면 탭 전환마다 왕복이 생긴다.
- `package.json` 에 `"type": "module"` 을 넣지 말 것 — CJS 패키지(react-fast-marquee 등)의 default import 가 깨진다. ESM 파일은 `.mjs` 로.
