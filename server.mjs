// 빌드된 SPA(dist/)를 서빙하는 운영 서버. 홈서버 nginx(터널 경유) → 이 컨테이너의 :3000.
import path from "node:path";
import express from "express";

const dist = path.join(import.meta.dirname, "dist");
const app = express();
app.disable("x-powered-by");

// 파일명에 해시가 붙은 빌드 산출물은 내용이 바뀌면 이름도 바뀌므로 1년 캐시.
app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "1y", index: false }));
// public/ 에서 온 파일(로고 등).
app.use(express.static(dist, { index: false }));

// 그 밖의 GET 은 모두 index.html — 주소는 브라우저의 라우터가 해석한다.
// 확장자가 붙은 경로는 없는 파일이므로 404 (index.html 을 이미지로 받는 일이 없게).
app.use((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return res.sendStatus(405);
  if (path.extname(req.path)) return res.sendStatus(404);
  res.set("Cache-Control", "no-cache");
  res.sendFile(path.join(dist, "index.html"));
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => console.log(`ai-salon web → http://0.0.0.0:${port}`));
