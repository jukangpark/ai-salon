# AI 살롱 광주

광주에서 AI 활용법을 함께 나누는 모임 「AI 살롱」의 웹사이트.

**https://ai-salon.jklab.app**

모임 소개와 회칙, 그리고 카카오톡 살롱봇이 쌓은 데이터(멤버·채팅·스터디 인증·벙)를 보여준다.

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 모임 소개 (랜딩) |
| `/members` | 둘러보기 — 멤버 목록, 채팅·스터디 순 정렬, 검색 |
| `/members/:userId` | 멤버 상세 — 프로필, 벙 참석 기록, 스터디 인증 기록 |
| `/commands` | 살롱봇 명령어 목록 |
| `/study` | 스터디 인증 현황 |
| `/stats` | 통계 — 성비·나이대·지역, 정모 참석, 채팅 활동 |
| `/calendar` | 벙 달력. `?m=2026-09&d=2026-09-18` 로 특정 날을 바로 열 수 있다 |
| `/rules` | 회칙 |
| `/invitation` | 초대장 (네비 없음, 공유용) |
| `/poster` | 모집 포스터 (네비 없음) |

## 스택

- React 19 + Vite, `react-router` v7 로 만든 SPA
- TypeScript, Tailwind CSS v4, shadcn/ui, recharts
- 운영 서버는 Express (`server.mjs`) — 빌드된 `dist/` 를 서빙한다

데이터는 브라우저에서 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API 를 직접 부른다.
주소는 `src/lib/api.ts`, `src/lib/members.ts` 에 있고, 응답은 탭 안에서 60초 동안 캐시한다.

## 개발

Node 22 기준.

```bash
npm install
npm run dev       # 개발 서버 (Vite, http://localhost:5173)
npm run build     # 타입 체크 + dist/ 빌드
npm start         # dist/ 를 Express 로 서빙 (PORT, 기본 3000)
npm run preview   # build + start
npm run lint
```

같은 와이파이의 폰에서 보려면 `npm run dev -- --host`.

```
src/
  main.tsx        라우트 목록
  pages/          페이지 (stats/, calendar/ 는 딸린 파일과 함께 폴더)
  components/     공용 컴포넌트 (ui/ 는 shadcn)
  lib/            API 주소·캐시, 닉네임 파싱 등
  globals.css     색 토큰과 색 규약
server.mjs        운영 서버
```

## 배포

`main` 에 push 하면 바로 운영에 나간다.

```
push main
 → GitHub Actions (홈서버 self-hosted 러너, label ai-salon)
 → rsync 로 /home/jukang/ai-salon 동기화
 → docker compose 재빌드·재기동 (컨테이너 ai-salon-web, 127.0.0.1:4009)
 → 헬스체크
```

밖에서는 Cloudflare Tunnel → 홈서버 nginx → `127.0.0.1:4009` 를 거쳐 ai-salon.jklab.app 으로 나간다.
설정은 `.github/workflows/deploy.yml`, `Dockerfile`, `docker-compose.prod.yml`.

Vercel 배포는 중단했다 (`vercel.json`).

## 설계 메모

- **SPA 인 이유.** 홈서버 앞의 Cloudflare 가 해외 엣지(샌호세 등)로 연결돼서 요청마다 0.5초쯤 걸린다.
  Next.js 는 탭을 옮길 때마다 서버에 요청을 보내 모바일에서 특히 느렸다. SPA 는 첫 로딩 뒤 탭 전환에 요청이 없다.
- **번들은 일부러 한 파일이다.** 페이지별로 쪼개면 탭을 누를 때마다 그 조각을 받으러 다시 왕복한다.
- **카드에 `backdrop-filter` 를 쓰지 않는다.** 모바일에서 비싸고, 카드 뒤가 이미 흐린 배경이라 눈에 띄는 차이가 없다. 네비만 blur 를 쓴다.
- **색은 역할로 쓴다.** 브랜드 violet, 의미색(cyan=채팅, emerald=스터디·성공, rose=취소·경고), 나머지는 slate. 자세한 규칙은 `src/globals.css` 맨 위에 있다.
