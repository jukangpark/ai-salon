# AI 살롱 광주

광주 AI 모임 「AI 살롱」 웹사이트. React + Vite SPA, Express 로 서빙한다.

```bash
npm install
npm run dev      # 개발 서버 (Vite)
npm run build    # 타입 체크 + dist/ 빌드
npm start        # dist/ 를 Express 로 서빙 (PORT, 기본 3000)
```

## 배포

`main` 에 push 하면 홈서버의 self-hosted 러너가 `docker compose` 로 재빌드한다 (`.github/workflows/deploy.yml`).
컨테이너는 `127.0.0.1:4009` 로만 열리고, Cloudflare Tunnel → 호스트 nginx 를 거쳐 ai-salon.jklab.app 으로 나간다.
