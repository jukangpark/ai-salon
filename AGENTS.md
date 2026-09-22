# 스택

React + Vite 로 만든 SPA 다 (Next.js 에서 옮겨왔다). 라우팅은 `react-router` v7, 라우트 목록은 `src/main.tsx`.
운영 주소는 https://ai-salon.jklab.app.

- 페이지: `src/pages/`. 데이터는 전부 브라우저에서 살롱봇 API(no-more.app)를 직접 부른다 (`src/lib/api.ts`, `src/lib/members.ts`, 60초 캐시).
- 운영: `npm run build` → `dist/`, `server.mjs`(Express)가 서빙하고 모르는 경로는 `index.html` 로 돌려준다.
- 메타데이터·OG 태그는 `index.html` 에 정적으로 둔다 (카톡 미리보기는 JS 를 실행하지 않는다). OG 이미지는 절대 주소.

# 배포

`main` 에 push 하면 곧바로 운영(홈서버)에 배포된다. 확인 안 된 변경은 브랜치에 둘 것.
흐름은 `.github/workflows/deploy.yml` — self-hosted 러너 → rsync → `docker compose` → `127.0.0.1:4009`.

# 지켜야 할 것

- 번들은 일부러 한 파일이다 (`vite.config.ts` 주석). 홈서버가 Cloudflare 해외 엣지를 거쳐 요청마다 ~0.5초라, 페이지를 쪼개면 탭 전환마다 왕복이 생긴다. 라우트를 `lazy()` 로 나누지 말 것.
- `package.json` 에 `"type": "module"` 을 넣지 말 것 — CJS 패키지(react-fast-marquee 등)의 default import 가 깨진다. ESM 파일은 `.mjs` 로.
- `.glass-card` 에 `backdrop-filter` 를 다시 넣지 말 것. 모바일에서 비싸다. blur 는 네비에만 쓴다 (`src/globals.css` 주석).
- 색은 `src/globals.css` 맨 위의 색 규약을 따른다. 의미색(cyan=채팅, emerald=스터디·성공, rose=취소·경고)을 장식으로 쓰지 말 것.
