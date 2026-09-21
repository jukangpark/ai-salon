// 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API. 시각은 unix 초.
export const MEMBERS_API_URL = "https://no-more.app/api/aisalon/members";

export type Member = {
  userId: string;
  name: string;
  chatCount: number;
  level: number;
  tier: string;
  tierEmoji: string;
  studyCertCount: number;
  job: string | null;
  mbti: string | null;
  hobby: string | null;
  introduction: string | null;
  firstSeenAt: number | null;
  lastSeenAt: number | null;
  // 벙(정모) 참석 — 서버 배포 전 응답엔 없을 수 있어 optional.
  moimCount?: number;
  recentMoims?: Moim[]; // 최근 3개, 최신순
};

// 벙(정모) 1건. date 는 KST YYYY-MM-DD.
export type Moim = { postId: string; date: string | null; title: string | null; location: string | null };

export type MemberDetail = Member & { studyCerts: string[]; moims?: Moim[] }; // KST YYYY-MM-DD 최신순

// "2026-07-18" → "7/18"
export const fmtMoimDate = (ymd: string | null) => {
  if (!ymd) return "";
  const [, m, d] = ymd.split("-").map(Number);
  return `${m}/${d}`;
};

// 살롱 닉 "이름/나이/지역/성별" 파싱. 서버 util.parseNick 과 같은 규칙(앞뒤 장식 제거, '/' 옆 공백 허용).
export const parseNick = (raw: string) => {
  const cleaned = raw
    .trim()
    .replace(/^[^가-힣a-zA-Z0-9]+/, "")
    .replace(/[^가-힣a-zA-Z0-9]+$/, "")
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .trim();
  const m = /^([^/]+)\/(\d+)\/([^/]+)\/(남|여)$/.exec(cleaned);
  if (!m) return { name: raw.split("/")[0].trim() || raw, age: null, region: null, gender: null };
  return { name: m[1].trim(), age: m[2], region: m[3].trim(), gender: m[4] };
};

// 닉네임의 출생연도("96", "1996") → 한국식 세는나이. 2026년 기준 "96" → 31.
export const koreanAge = (birth: string | null) => {
  if (!birth) return null;
  const n = Number(birth);
  if (!Number.isInteger(n)) return null;
  const year = Number(new Date().toLocaleDateString("en-US", { timeZone: "Asia/Seoul", year: "numeric" }));
  // 두 자리면 세기를 보정한다. 올해 끝 두 자리보다 크면 1900년대.
  const born = birth.length === 4 ? n : n + (n <= year % 100 ? 2000 : 1900);
  return year - born + 1;
};

export const fmtAgo = (sec: number | null) => {
  if (!sec) return null;
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - sec);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

export const fmtDate = (sec: number | null) =>
  sec
    ? new Date(sec * 1000).toLocaleDateString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

// 벙 날짜 → 달력의 그 날(?m=·?d=). 날짜를 모르는 벙은 링크를 걸지 않는다.
export const moimHref = (ymd: string | null) => (ymd ? `/calendar?m=${ymd.slice(0, 7)}&d=${ymd}` : null);
