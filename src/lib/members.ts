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
};

export type MemberDetail = Member & { studyCerts: string[] }; // KST YYYY-MM-DD 최신순

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
