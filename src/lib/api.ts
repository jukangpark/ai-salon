// 살롱봇 API 응답을 탭 안에서 기억해 둔다. 홈서버가 Cloudflare(SJC)를 돌아 요청마다 ~0.7초가 걸려서,
// 페이지를 옮길 때마다 새로 받으면 매번 빈 화면을 기다리게 된다.
// 받아둔 값은 곧바로 보여주고(peekJson), 60초가 지났으면 fetchJson 이 새로 받아온다.
const TTL_MS = 60_000;

type Entry = { at: number; promise: Promise<unknown>; data?: unknown };
const cache = new Map<string, Entry>();

export function fetchJson<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise as Promise<T>;

  // 새로 받는 동안에도 직전 값은 peekJson 으로 보이게 넘겨준다.
  const entry: Entry = { at: Date.now(), promise: Promise.resolve(), data: hit?.data };
  entry.promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((json) => (entry.data = json))
    .catch((e) => {
      // 실패는 기억하지 않는다 → 다음 호출에서 다시 시도.
      if (cache.get(url) === entry) {
        if (hit) cache.set(url, hit);
        else cache.delete(url);
      }
      throw e;
    });
  cache.set(url, entry);
  return entry.promise as Promise<T>;
}

// 이미 받아둔 값(오래됐어도)을 동기로 꺼낸다. useState 초기값용.
export const peekJson = <T,>(url: string) => cache.get(url)?.data as T | undefined;

// 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API. 시각은 unix 초. (멤버 API 는 members.ts)
export const STATS_API_URL = "https://no-more.app/api/aisalon/stats";
export const MOIM_CALENDAR_API_URL = "https://no-more.app/api/aisalon/moim/calendar";
export const STUDY_API_URL = "https://no-more.app/api/aisalon/study-cert";
export const STUDY_CALENDAR_URL = `${STUDY_API_URL}/calendar`;
export const STUDY_RANKING_URL = `${STUDY_API_URL}/ranking?limit=5`;

// 네비 탭들이 쓰는 API 를 미리 받아둔다 → 탭을 눌렀을 때 데이터가 이미 있다. 실패는 무시(페이지에서 다시 시도).
export const warmApis = (urls: string[]) => urls.forEach((u) => fetchJson(u).catch(() => {}));
