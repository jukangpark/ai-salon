"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Notice from "@/components/Notice";
import StatCard from "@/components/StatCard";
import { StatCardsSkeleton } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { WEEKDAYS } from "@/lib/constants";
import { MOIM_CALENDAR_API_URL, fetchJson, peekJson } from "@/lib/api";
import { parseNick } from "@/lib/members";

// no-more.app/calendar(강이봇 벙 달력)와 같은 구성. 데이터는 살롱봇 서버의 공개 읽기 전용 API.
type CalendarRes = { ok: boolean; posts: Post[]; error?: string };

type Person = { userId: string | null; name: string | null; present: boolean };

type Post = {
  postId: string;
  title: string;
  location: string | null;
  startAt: number;
  endAt: number | null;
  startDay: string; // KST 'YYYY-MM-DD' — 서버가 여러 날 벙의 범위까지 계산해 준다
  endDay: string;
  canceled: boolean;
  scraped: boolean;
  host: Person | null;
  yes: number;
  no: number;
  maybe: number;
  attendees: Person[];
};

// ── KST 날짜 유틸 — 브라우저 TZ 와 무관하게 UTC+9 를 더해 UTC 로 읽는다 ─────────────
const KST_MS = 9 * 3600 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");
const kstDate = (sec: number) => new Date(sec * 1000 + KST_MS);
const todayKey = () => kstDate(Date.now() / 1000).toISOString().slice(0, 10);
const hm = (sec: number) => {
  const d = kstDate(sec);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
};
const addDays = (key: string, n: number) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
const addMonths = (ym: string, n: number) => {
  const [y, m] = ym.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${pad((t % 12) + 1)}`;
};
const fmtDayLong = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return `${m}월 ${d}일 (${WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]})`;
};

// 이 달을 덮는 5~6주 그리드 — 일요일 시작.
const monthGrid = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const start = addDays(first.toISOString().slice(0, 10), -first.getUTCDay());
  const weeks = Math.ceil((first.getUTCDay() + days) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
};

// 벙마다 고정 색 — post_id 해시로 팔레트에서 고른다 (새로고침해도 같은 색).
// Tailwind 가 안 쓰인 CSS 변수를 지우므로 변수 이름을 조합하지 말고 그대로 적는다.
const PALETTE = [
  "var(--chart-region-1)",
  "var(--chart-region-2)",
  "var(--chart-region-3)",
  "var(--chart-region-4)",
  "var(--chart-region-5)",
  "#22d3ee",
];
const colorOf = (id: string) => {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
};

// 하루 벙은 "19:30~22:30", 여러 날 벙은 "10월 3일 09:00 ~ 10월 5일 05:00".
const fmtRange = (p: Post) => {
  if (p.startDay !== p.endDay && p.endAt) {
    const s = kstDate(p.startAt),
      e = kstDate(p.endAt);
    return `${s.getUTCMonth() + 1}월 ${s.getUTCDate()}일 ${hm(p.startAt)} ~ ${e.getUTCMonth() + 1}월 ${e.getUTCDate()}일 ${hm(p.endAt)}`;
  }
  return p.endAt && p.endAt > p.startAt ? `${hm(p.startAt)} ~ ${hm(p.endAt)}` : hm(p.startAt);
};

function PersonLink({ p }: { p: Person }) {
  const label = parseNick(p.name ?? "").name;
  // 나간 사람은 /members/:userId 가 404 라 링크를 걸지 않는다.
  return p.present && p.userId ? (
    <Link href={`/members/${p.userId}`} className="hover:text-violet-300 transition-colors">
      {label}
    </Link>
  ) : (
    <span className="text-slate-500">{label}</span>
  );
}

function EventCard({ p, now }: { p: Post; now: number }) {
  const past = (p.endAt ?? p.startAt) < now;
  return (
    <div className={`glass-card rounded-2xl overflow-hidden flex min-w-0 ${p.canceled ? "opacity-50" : ""}`}>
      <div aria-hidden className="w-1 shrink-0" style={{ background: colorOf(p.postId) }} />
      <div className="min-w-0 flex-1 px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="tabular-nums">{fmtRange(p)}</span>
          {p.canceled ? (
            <span className="px-1.5 py-px rounded-md bg-rose-500/15 text-rose-300 text-[10px]">취소</span>
          ) : past ? (
            <span className="px-1.5 py-px rounded-md bg-white/5 text-slate-400 text-[10px]">지난 벙</span>
          ) : (
            <span className="px-1.5 py-px rounded-md border border-emerald-500/30 text-emerald-300 text-[10px]">예정</span>
          )}
        </div>
        <div className={`mt-1 break-words font-semibold tracking-tight text-slate-100 ${p.canceled ? "line-through" : ""}`}>
          {p.title}
        </div>
        {p.location && <div className="mt-0.5 text-[11px] text-slate-500">📍 {p.location}</div>}
        <div className="mt-1.5 text-xs text-slate-500">
          {p.host?.name && (
            <>
              벙주 <PersonLink p={p.host} />
              <span className="mx-1.5 opacity-40">·</span>
            </>
          )}
          {p.scraped ? (
            <>
              참석 <span className="text-slate-200 tabular-nums">{p.yes}</span>명
              {p.maybe > 0 && <> · 미정 {p.maybe}</>}
              {p.no > 0 && <> · 불참 {p.no}</>}
            </>
          ) : (
            "참석 명단 수집 전"
          )}
        </div>
        {p.attendees.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {p.attendees.map((a, i) => (
              <span key={a.userId ?? `${a.name}-${i}`} className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] text-slate-300">
                <PersonLink p={a} />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 달력 모양 자리표시 — 데이터 대기 중, 그리고 page.tsx 의 Suspense fallback 으로 쓴다.
export function CalendarSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Skeleton className="h-9 w-56 rounded-xl" />
      <StatCardsSkeleton count={4} className="grid-cols-2 gap-2 sm:grid-cols-4" />
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/[0.07] text-center text-[11px] font-medium text-slate-500">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="min-h-[64px] border-b border-r border-white/[0.05] p-1 sm:min-h-[104px] sm:p-1.5">
              <Skeleton className="size-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CalendarView() {
  const [posts, setPosts] = useState<Post[] | null>(() => {
    const j = peekJson<CalendarRes>(MOIM_CALENDAR_API_URL);
    return j?.ok ? j.posts : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [showCanceled, setShowCanceled] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const today = todayKey();
  // 월·선택일은 주소에 둔다 (?m=2026-09&d=2026-09-18) — 카톡방에 "이 날 벙" 링크를 그대로 공유할 수 있게.
  const mParam = params.get("m") ?? "";
  const dParam = params.get("d") ?? "";
  const month = /^\d{4}-\d{2}$/.test(mParam) ? mParam : today.slice(0, 7);
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(dParam) ? dParam : month === today.slice(0, 7) ? today : null;
  const go = (m: string, d: string | null) =>
    router.replace(`${pathname}?${new URLSearchParams(d ? { m, d } : { m })}`, { scroll: false });

  useEffect(() => {
    fetchJson<CalendarRes>(MOIM_CALENDAR_API_URL)
      .then((j) => (j.ok ? setPosts(j.posts) : setError(j.error ?? "불러오지 못했어요")))
      .catch(() => setError("서버에 연결하지 못했어요"));
  }, []);

  // 날짜 → 그날 걸친 벙 목록. 여러 날 벙은 범위 안의 모든 날에 넣는다 (최대 31일로 방어).
  const byDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of posts ?? []) {
      if (p.canceled && !showCanceled) continue;
      for (let d = p.startDay, i = 0; d <= p.endDay && i < 31; d = addDays(d, 1), i++) {
        let arr = map.get(d);
        if (!arr) map.set(d, (arr = []));
        arr.push(p);
      }
    }
    return map;
  }, [posts, showCanceled]);

  const grid = useMemo(() => monthGrid(month), [month]);
  const now = Date.now() / 1000;

  // 이 달 요약 — 취소 제외, 여러 날 벙은 한 번만 센다.
  const summary = useMemo(() => {
    const seen = new Map<string, Post>();
    for (const d of grid) if (d.startsWith(month)) for (const p of byDay.get(d) ?? []) if (!p.canceled) seen.set(p.postId, p);
    const list = [...seen.values()];
    let busiest: { day: string; n: number } | null = null;
    for (const d of grid) {
      if (!d.startsWith(month)) continue;
      const n = (byDay.get(d) ?? []).filter((p) => !p.canceled).length;
      if (n && (!busiest || n > busiest.n)) busiest = { day: d, n };
    }
    return {
      count: list.length,
      upcoming: list.filter((p) => (p.endAt ?? p.startAt) >= now).length,
      people: list.reduce((s, p) => s + p.yes, 0),
      busiest,
    };
  }, [grid, byDay, month, now]);

  if (error) return <Notice className="text-slate-400">{error}</Notice>;
  if (!posts) return <CalendarSkeleton />;

  const [y, m] = month.split("-").map(Number);
  const dayPosts = selected ? byDay.get(selected) ?? [] : [];
  const navBtn = "glass-card rounded-xl p-2 text-slate-300 hover:text-white transition-colors";

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start">
      {/* ── 달력 ── */}
      <div className="flex min-w-0 flex-col gap-3 lg:flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button type="button" aria-label="이전 달" className={navBtn} onClick={() => go(addMonths(month, -1), null)}>
              <ChevronLeft className="size-4" />
            </button>
            <div className="min-w-[7.5rem] text-center text-lg font-semibold tabular-nums tracking-tight text-slate-100">
              {y}년 {m}월
            </div>
            <button type="button" aria-label="다음 달" className={navBtn} onClick={() => go(addMonths(month, 1), null)}>
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              className="ml-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => go(today.slice(0, 7), today)}
            >
              오늘
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={showCanceled}
              onChange={(e) => setShowCanceled(e.target.checked)}
              className="size-4 accent-violet-400"
            />
            취소된 벙도 보기
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard label="이번 달 벙" value={`${summary.count}개`} tone="text-violet-300" valueClassName="text-lg" />
          <StatCard label="남은 벙" value={`${summary.upcoming}개`} valueClassName="text-lg" />
          <StatCard label="참석 연인원" value={`${summary.people}명`} valueClassName="text-lg" />
          <StatCard
            label="가장 바쁜 날"
            value={summary.busiest ? `${Number(summary.busiest.day.slice(8))}일 · ${summary.busiest.n}개` : "-"}
            valueClassName="text-lg"
          />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/[0.07] text-center text-[11px] font-medium text-slate-500">
            {WEEKDAYS.map((w, i) => (
              <div key={w} className={`py-2 ${i === 0 ? "text-rose-300" : i === 6 ? "text-sky-300" : ""}`}>
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {grid.map((d, i) => {
              const inMonth = d.startsWith(month);
              const list = byDay.get(d) ?? [];
              const isToday = d === today;
              const isSel = d === selected;
              const wd = i % 7;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => go(d.slice(0, 7), d)}
                  aria-label={`${fmtDayLong(d)} 벙 ${list.length}개`}
                  aria-pressed={isSel}
                  className={`flex min-h-[64px] min-w-0 flex-col items-stretch gap-1 border-b border-r border-white/[0.05] p-1 text-left transition sm:min-h-[104px] sm:p-1.5
                    ${wd === 6 ? "border-r-0" : ""} ${inMonth ? "" : "opacity-35"}
                    ${isSel ? "bg-white/[0.09]" : "hover:bg-white/[0.04]"}`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center self-start rounded-full text-xs tabular-nums
                      ${isToday ? "bg-slate-100 font-semibold text-slate-900" : wd === 0 ? "text-rose-300" : wd === 6 ? "text-sky-300" : "text-slate-300"}`}
                  >
                    {Number(d.slice(8))}
                  </span>

                  {/* 모바일 — 색 막대만 (칸이 50px 남짓이라 글자가 안 들어간다) */}
                  <div className="flex flex-col gap-0.5 sm:hidden">
                    {list.slice(0, 3).map((p) => (
                      <span
                        key={p.postId}
                        className={`h-1.5 rounded-full ${p.canceled ? "opacity-30" : ""}`}
                        style={{ background: colorOf(p.postId) }}
                      />
                    ))}
                    {list.length > 3 && <span className="text-[9px] leading-none text-slate-500">+{list.length - 3}</span>}
                  </div>

                  {/* sm 이상 — 시간 + 제목 칩 */}
                  <div className="hidden min-w-0 flex-col gap-0.5 sm:flex">
                    {list.slice(0, 3).map((p) => (
                      <span
                        key={p.postId}
                        className={`truncate rounded px-1 py-px text-[11px] leading-tight text-slate-100 ${p.canceled ? "line-through opacity-40" : ""}`}
                        style={{ background: `color-mix(in srgb, ${colorOf(p.postId)} 22%, transparent)` }}
                        title={p.title}
                      >
                        {p.startDay === d && <span className="mr-1 tabular-nums opacity-70">{hm(p.startAt)}</span>}
                        {p.title}
                      </span>
                    ))}
                    {list.length > 3 && <span className="px-1 text-[10px] text-slate-500">+{list.length - 3}개 더</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 선택한 날 ── */}
      <section className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:w-[340px] lg:shrink-0">
        <h2 className="text-base font-semibold tracking-tight text-slate-100">
          {selected ? fmtDayLong(selected) : "날짜를 골라주세요"}
          {selected && <span className="ml-2 text-sm font-normal text-slate-500">벙 {dayPosts.length}개</span>}
        </h2>
        {selected && dayPosts.length === 0 && <Notice className="py-8">이 날은 벙이 없어요</Notice>}
        {dayPosts.map((p) => (
          <EventCard key={p.postId} p={p} now={now} />
        ))}
      </section>
    </div>
  );
}
